import type {
  ComponentPropsWithoutRef,
  RefObject,
} from 'react'
import {
  forwardRef,
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

import { useDebounceCallback, useDidUpdate, useResizeObserver } from '~shared/hooks'

import { MotionBox } from 'klewik-ui/motion-box'
import type { ScrollAreaProps } from 'klewik-ui/scroll-area'
import { ScrollArea } from 'klewik-ui/scroll-area'

import { cn, mergeProps } from '~shared/utils'

const animatedSides = ['top', 'bottom'] as const

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

export const ShadowScrollArea = forwardRef<HTMLDivElement, ShadowScrollAreaProps>((props, forwardRef) => {
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

  useDidUpdate(() => {
    const scrollElement = scrollRefElement.current

    const [entry] = entries

    if (!scrollElement || !entry)
      return

    const scrollValue = scrollYValue ? scrollYValue + scrollElement.clientHeight : 0

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

  useDidUpdate(() => {
    const scrollElement = scrollRefElement.current
    const contentElement = contentRefElement.current

    if (!scrollElement || !contentElement)
      return

    const isShouldShowBottomShadow
      = scrollElement.clientHeight <= scrollElement.scrollHeight
        && scrollYProgress <= 0.999
    const isElementNotScrolled = scrollYValue === 0 && scrollYProgress === 0

    if (isElementNotScrolled && !disableAnimation) {
      return debouncedShadowAnimation({
        topShadow: false,
        bottomShadow: isShouldShowBottomShadow,
      })
    }

    if (!disableAnimation) {
      debouncedShadowAnimation({
        topShadow: true,
        bottomShadow: isShouldShowBottomShadow,
      })
    }
  }, [
    disableAnimation,
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

  const animatedShadows = useMemo(() => {
    const isTopShadowShouldBeRendered
      = isShadowsAnimated.topShadow && !disableAnimation
    const isBottomShadowShouldBeRendered
      = isShadowsAnimated.bottomShadow && !disableAnimation

    return animatedSides.map((side) => {
      const isTopSide = side === 'top'
      const isBottomSide = side === 'bottom'

      const isShouldSkipSideRender
        = (!isTopShadowShouldBeRendered && isTopSide)
          || (!isBottomShadowShouldBeRendered && isBottomSide)

      if (isShouldSkipSideRender)
        return undefined

      return (
        <MotionBox
          key={`${side}-shadow`}
          className={cn(
            'w-full from-transparent via-white/70 via-20% to-transparent to-80%',
            isTopSide && 'bg-gradient-to-b',
            isBottomSide && 'bottom-0 bg-gradient-to-t',
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
      )
    })
  }, [shadowSize, isShadowsAnimated, disableAnimation])

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
        {animatedShadows}
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
