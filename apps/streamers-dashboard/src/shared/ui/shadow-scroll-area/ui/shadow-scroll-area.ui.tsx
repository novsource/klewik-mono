import type {
  ScrollAreaProps,
} from '@radix-ui/react-scroll-area'

import type {
  ComponentPropsWithoutRef,
  RefObject,
} from 'react'
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  AnimatePresence,
  transform,
  useMotionValueEvent,
  useScroll,
} from 'motion/react'

import { useDebounceCallback, useResizeObserver } from '~shared/hooks'

import { MotionBox } from '~shared/ui/motion-box'
import { ScrollArea } from '~shared/ui/scroll-area'

import { cn, mergeProps } from '~shared/utils'

export type ShadowScrollAreaProps = ComponentPropsWithoutRef<'div'> & {
  width: string | number
  height: string | number
  contentAreaHTMLProps?: ScrollAreaProps
  externalScrollRef?: RefObject<HTMLDivElement>
  externalContentRef?: RefObject<HTMLDivElement>
  shadowEnabled?: boolean
  shadowSize?: number
  disableAnimation?: boolean
}

const ShadowScrollArea = forwardRef<HTMLDivElement, ShadowScrollAreaProps>((props, forwardRef) => {
  const {
    style,
    children,
    className,
    width,
    height,
    contentAreaHTMLProps,
    externalScrollRef,
    externalContentRef,
    shadowEnabled = true,
    disableAnimation = true,
    shadowSize = 50,
    ...restProps
  } = props

  const [isShadowsAnimated, setIsShadowAnimated] = useState({
    topShadow: false,
    bottomShadow: true,
  })

  const [scrollYProgress, setScrollYProgress] = useState(0)
  const [scrollYValue, setScrollYValue] = useState(0)

  const internalScrollElementRef = useRef<HTMLDivElement>(null)
  const internalContentAreaRef = useRef<HTMLDivElement>(null)

  const scrollRefElement
    = externalScrollRef ?? internalScrollElementRef
  const contentRefElement
    = externalContentRef ?? internalContentAreaRef

  const { scrollYProgress: motionScrollYProgress, scrollY }
    = useScroll({ container: scrollRefElement, axis: 'y' })

  const { entries } = useResizeObserver(contentRefElement)

  const debouncedShadowAnimation = useDebounceCallback(
    (
      values: { topShadow: boolean, bottomShadow: boolean } = {
        topShadow: true,
        bottomShadow: true,
      },
    ) => {
      setIsShadowAnimated(values)
    },
    2500,
  )

  useMotionValueEvent(motionScrollYProgress, 'change', (value) => {
    setIsShadowAnimated(() => {
      return { bottomShadow: false, topShadow: false }
    })

    setScrollYProgress(value)
  })

  useMotionValueEvent(scrollY, 'change', (value) => {
    setScrollYValue(value)
  })

  useEffect(() => {
    const scrollElement = scrollRefElement.current

    const [entry] = entries

    if (!scrollElement || !entry)
      return

    const scrollValue = scrollYValue + scrollElement.clientHeight

    const newScrollYProgress
          = scrollValue / scrollElement.scrollHeight >= 1
            ? 1
            : scrollValue / scrollElement.scrollHeight

    if (scrollYProgress !== 0)
      setScrollYProgress(newScrollYProgress)

    if (entry.target.scrollHeight < scrollElement.clientHeight) {
      setScrollYProgress(0)
      setScrollYValue(0)
      setIsShadowAnimated({ topShadow: false, bottomShadow: false })
    }
  }, [
    scrollRefElement,
    contentRefElement,
    entries,
    scrollYProgress,
    scrollYValue,
  ])

  useEffect(() => {
    const scrollElement = scrollRefElement.current
    const contentElement = contentRefElement.current

    if (!scrollElement || !contentElement)
      return

    const isShouldShowBottomShadow
      = scrollElement.clientHeight <= scrollElement.scrollHeight
        && scrollYProgress <= 0.999

    if (scrollYValue === 0 && scrollYProgress === 0) {
      return debouncedShadowAnimation({
        topShadow: false,
        bottomShadow: isShouldShowBottomShadow,
      })
    }
    else {
      debouncedShadowAnimation({
        topShadow: true,
        bottomShadow: isShouldShowBottomShadow,
      })
    }
  }, [
    scrollRefElement,
    contentRefElement,
    scrollYValue,
    scrollYProgress,
    debouncedShadowAnimation,
  ])

  const shadowScrollAreaStyle = useMemo(() => {
    const getTopGradientValue = transform([0, 0.1], [0, shadowSize])
    const getBottomGradientValue = transform([0.99, 1], [shadowSize, 0])

    return `linear-gradient(
      #000,
      #000,
      transparent 0,
      #000 ${getTopGradientValue(scrollYProgress)}px,
      #000 calc(100% - ${getBottomGradientValue(scrollYProgress)}px),
      transparent
    )`
  }, [scrollYProgress, shadowSize])

  const isTopShadowShouldBeRendered
    = isShadowsAnimated.topShadow && !disableAnimation
  const isBottomShadowShouldBeRendered
    = isShadowsAnimated.bottomShadow && !disableAnimation

  const scrollAreaProps = mergeProps(contentAreaHTMLProps, { style: { width, height } })

  return (
    <div
      ref={forwardRef}
      data-slot="shadow-scroll-area"
      className={cn(className)}
      style={{
        width,
        height,
        position: 'relative',
        maskImage: shadowEnabled ? shadowScrollAreaStyle : 'none',
        ...style,
      }}
      {...restProps}
    >
      <AnimatePresence>
        <>
          {isTopShadowShouldBeRendered && (
            <MotionBox
              className={cn(
                'w-full bg-gradient-to-b from-transparent via-white/70 via-20% to-transparent to-80%',
              )}
              initial={{
                opacity: 0,
                height: shadowSize,
              }}
              animate={{
                opacity: [0, 0.6, 0],
                height: 0,
              }}
              transition={{
                duration: 3,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatDelay: 1,
              }}
              style={{
                position: 'absolute',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />
          )}
          {isBottomShadowShouldBeRendered && (
            <MotionBox
              className={cn(
                'bottom-0 w-full bg-gradient-to-t from-transparent via-white/70 via-20% to-transparent to-80%',
              )}
              initial={{
                opacity: 0,
                height: shadowSize,
              }}
              animate={{
                opacity: [0, 1, 0],
                height: 0,
              }}
              transition={{
                duration: 3,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatDelay: 1,
              }}
              style={{
                position: 'absolute',
                zIndex: 2,
              }}
            />
          )}
        </>
      </AnimatePresence>
      <ScrollArea
        ref={internalContentAreaRef}
        viewportProps={{ ref: internalScrollElementRef }}
        {...scrollAreaProps}
      >
        {children}
      </ScrollArea>
    </div>
  )
})

export { ShadowScrollArea }
