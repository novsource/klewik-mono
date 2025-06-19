import {
  ComponentPropsWithoutRef,
  RefObject,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  ScrollAreaProps,
  ScrollAreaViewport,
} from '@radix-ui/react-scroll-area'
import {
  AnimatePresence,
  transform,
  useMotionValueEvent,
  useScroll,
} from 'motion/react'
import * as m from 'motion/react-m'

import { useDebouncedCallback } from '~shared/hooks/use-debounced-callback'
import { useResizeObserver } from '~shared/hooks/use-resize-observer'

import { ScrollArea } from '~shared/ui/scroll-area'

import { cn } from '~shared/utils'

export type ShadowScrollAreaProps = ComponentPropsWithoutRef<'div'> & {
  contentAreaHTMLProps?: ScrollAreaProps
  externalScrollRef?: RefObject<HTMLDivElement>
  externalContentRef?: RefObject<HTMLElement>
  shadowEnabled?: boolean
  shadowSize?: number
}

const ShadowScrollArea = forwardRef<
  typeof ScrollAreaViewport,
  ShadowScrollAreaProps
>((props, forwardRef) => {
  const {
    style,
    children,
    className,
    contentAreaHTMLProps,
    externalScrollRef,
    externalContentRef,
    shadowEnabled = true,
    shadowSize = 60,
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

  const { scrollYProgress: motionScrollYProgress, scrollY } = useScroll({
    container: externalScrollRef ?? internalScrollElementRef,
  })

  const { entries } = useResizeObserver(
    externalContentRef ?? internalContentAreaRef
  )

  const debouncedShadowAnimation = useDebouncedCallback(
    (
      values: { topShadow: boolean; bottomShadow: boolean } = {
        topShadow: true,
        bottomShadow: true,
      }
    ) => {
      setIsShadowAnimated(values)
    },
    2500
  )

  useLayoutEffect(() => {
    if (!forwardRef) return

    if (typeof forwardRef === 'function') {
      return
    } else if (typeof forwardRef === 'string') {
      return
    } else {
      internalScrollElementRef.current = forwardRef.current
    }
  }, [forwardRef])

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
    const scrollElement =
      externalScrollRef?.current ?? internalScrollElementRef.current
    const contentAreaElement =
      externalContentRef?.current ?? internalContentAreaRef.current

    if (!contentAreaElement || !scrollElement) return

    for (const entry of entries) {
      if (entry.target === contentAreaElement) {
        const scrollValue = scrollYValue + scrollElement.clientHeight

        const newScrollYProgress =
          scrollValue / contentAreaElement.scrollHeight >= 1
            ? 1
            : scrollValue / contentAreaElement.scrollHeight

        if (scrollYProgress !== 0) setScrollYProgress(newScrollYProgress)
      }

      if (entry.target.scrollHeight < scrollElement.clientHeight) {
        setScrollYProgress(0)
        setScrollYValue(0)
        setIsShadowAnimated({ topShadow: false, bottomShadow: false })
      }
    }
  }, [
    entries,
    externalScrollRef,
    externalContentRef,
    internalScrollElementRef,
    internalContentAreaRef,
  ])

  useEffect(() => {
    const scrollElement =
      externalScrollRef?.current ?? internalScrollElementRef.current
    const contentElement =
      externalContentRef?.current ?? internalContentAreaRef.current

    if (!scrollElement || !contentElement) return

    const isShouldShowBottomShadow =
      scrollElement.clientHeight <= contentElement.scrollHeight &&
      scrollYProgress <= 0.999

    if (scrollYValue === 0 && scrollYProgress === 0) {
      return debouncedShadowAnimation({
        topShadow: false,
        bottomShadow: isShouldShowBottomShadow,
      })
    } else
      debouncedShadowAnimation({
        topShadow: true,
        bottomShadow: isShouldShowBottomShadow,
      })
  }, [
    scrollYValue,
    scrollYProgress,
    externalScrollRef,
    externalContentRef,
    internalScrollElementRef,
    internalContentAreaRef,
  ])

  const shadowScrollAreaStyle = useMemo(() => {
    const getTopGradientValue = transform([0, 0.015], [0, shadowSize])
    const getBottomGradientValue = transform([0.985, 1], [shadowSize, 0])

    return `linear-gradient(#000, #000,transparent 0,#000 ${getTopGradientValue(scrollYProgress)}px,#000 calc(100% - ${getBottomGradientValue(scrollYProgress)}px),transparent)`
  }, [scrollYProgress, shadowSize])

  return (
    <div
      ref={internalScrollElementRef}
      data-slot="shadow-scroll-area"
      className={cn(className)}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        maskImage: shadowEnabled ? shadowScrollAreaStyle : 'none',
        ...style,
      }}
      {...restProps}
    >
      <AnimatePresence>
        <>
          {isShadowsAnimated.topShadow && (
            <m.div
              className={cn(
                'w-full bg-gradient-to-b from-transparent via-white/70 via-20% to-transparent to-80%'
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
          {isShadowsAnimated.bottomShadow && (
            <m.div
              className={cn(
                'bottom-0 w-full bg-gradient-to-t from-transparent via-white/70 via-20% to-transparent to-80%'
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
      <ScrollArea ref={internalContentAreaRef} {...contentAreaHTMLProps}>
        {children}
      </ScrollArea>
    </div>
  )
})

export { ShadowScrollArea }
