import {
  ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { ScrollAreaViewport } from '@radix-ui/react-scroll-area'
import {
  AnimatePresence,
  motion,
  transform,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion'

import { useDebouncedCallback } from '~shared/hooks/use-debounced-callback'
import { useResizeObserver } from '~shared/hooks/use-resize-observer'

import { cn } from '~shared/utils'

export type ShadowScrollAreaProps = ComponentPropsWithoutRef<'div'> & {
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
    shadowEnabled = true,
    shadowSize = 60,
    ...restProps
  } = props

  const [isShadowsAnimated, setIsShadowAnimated] = useState({
    topShadow: false,
    bottomShadow: false,
  })

  const [scrollYProgress, setScrollYProgress] = useState(0)
  const [scrollYValue, setScrollYValue] = useState(0)

  const scrollElementRef = useRef<HTMLDivElement>(null)
  const contentAreaRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: motionScrollYProgress, scrollY } = useScroll({
    container: scrollElementRef,
  })

  const { entries } = useResizeObserver(contentAreaRef)

  const debouncedShadowAnimation = useDebouncedCallback(
    (
      values: { topShadow: boolean; bottomShadow: boolean } = {
        topShadow: true,
        bottomShadow: true,
      }
    ) => {
      setIsShadowAnimated(values)
    },
    2000
  )

  useLayoutEffect(() => {
    if (!forwardRef) return

    if (typeof forwardRef === 'function') {
      return
    } else if (typeof forwardRef === 'string') {
      return
    } else {
      scrollElementRef.current = forwardRef.current
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
    const scrollElement = scrollElementRef.current
    const element = contentAreaRef.current

    if (!element || !scrollElement) return

    for (const entry of entries) {
      if (entry.target === element) {
        const scrollValue = scrollYValue + scrollElement.clientHeight

        const newScrollYProgress =
          scrollValue / entry.target.scrollHeight >= 1
            ? 1
            : scrollValue / entry.target.scrollHeight

        if (scrollYProgress !== 0) setScrollYProgress(newScrollYProgress)
      }

      if (entry.target.scrollHeight <= scrollElement.clientHeight) {
        setScrollYProgress(0)
        setScrollYValue(0)
        setIsShadowAnimated({ topShadow: false, bottomShadow: false })
      }
    }
  }, [entries, scrollElementRef.current, contentAreaRef.current])

  useEffect(() => {
    const element = scrollElementRef.current
    const contentElement = contentAreaRef.current

    if (!element || !contentElement) return

    const isShouldShowBottomShadow =
      element.clientHeight <= contentElement.scrollHeight && scrollYValue !== 1

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
    scrollElementRef.current,
    contentAreaRef.current,
  ])

  console.log(scrollYValue)

  const shadowScrollAreaStyle = useMemo(() => {
    const getTopGradientValue = transform([0, 0.015], [0, shadowSize])
    const getBottomGradientValue = transform([0.985, 1], [shadowSize, 0])

    return `linear-gradient(#000, #000,transparent 0,#000 ${getTopGradientValue(scrollYProgress)}px,#000 calc(100% - ${getBottomGradientValue(scrollYProgress)}px),transparent)`
  }, [scrollYProgress, shadowSize])

  return (
    <div
      ref={scrollElementRef}
      data-slot="shadow-scroll-area"
      style={{
        ...style,
        position: 'relative',
        maskImage: shadowEnabled ? shadowScrollAreaStyle : 'none',
        overflowY: 'scroll',
      }}
      {...restProps}
    >
      <AnimatePresence>
        <>
          {isShadowsAnimated.topShadow && (
            <motion.div
              className={cn(
                'w-full bg-gradient-to-b from-transparent via-white/70 via-20% to-transparent to-80%'
              )}
              initial={{ opacity: 0, translateY: 0 + scrollYValue }}
              animate={{
                opacity: [0, 1, 0],
                translateY: [0 + scrollYValue, -40 + scrollYValue],
              }}
              transition={{
                duration: 2.5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatDelay: 1,
              }}
              style={{
                position: 'absolute',
                zIndex: 2,
                height: transform([0, 0.015], [0, shadowSize])(scrollYProgress),
              }}
            />
          )}
          {isShadowsAnimated.bottomShadow && (
            <motion.div
              className={cn(
                'w-full bg-gradient-to-t from-transparent via-white/70 via-20% to-transparent to-80% bottom-0'
              )}
              initial={{ opacity: 0, translateY: 0 + scrollYValue }}
              animate={{
                translateY: [0 + scrollYValue, 40 + scrollYValue],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatDelay: 1,
              }}
              style={{
                position: 'absolute',
                zIndex: 2,
                height: shadowSize,
              }}
            />
          )}
        </>
      </AnimatePresence>
      <div ref={contentAreaRef} className="w-full h-fit">
        {children}
      </div>
    </div>
  )
})

export { ShadowScrollArea }
