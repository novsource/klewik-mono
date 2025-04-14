import {
  ComponentProps,
  forwardRef,
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

import { cn } from '~shared/utils'

export type ShadowScrollAreaProps = ComponentProps<'div'> & {
  shadowEnabled?: boolean
  shadowSize?: number
}

const ShadowScrollArea = forwardRef<
  typeof ScrollAreaViewport,
  SlotsShadowScrollAreaProps
>((props, forwardRef) => {
  const {
    style,
    children,
    shadowEnabled = true,
    shadowSize = 60,
    ...restProps
  } = props

  const [isShadowAnimated, setIsShadowAnimated] = useState(false)

  const [scrollYProgress, setScrollYProgress] = useState(0)
  const [scrollYValue, setScrollYValue] = useState(0)

  const scrollElementRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: motionScrollYProgress, scrollY } = useScroll({
    container: scrollElementRef,
  })

  const debouncedShadowAnimation = useDebouncedCallback(
    () => setIsShadowAnimated(true),
    2000
  )

  useLayoutEffect(() => {
    if (!scrollElementRef.current) return

    debouncedShadowAnimation()
  }, [scrollElementRef])

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
      debouncedShadowAnimation()
      return false
    })

    setScrollYProgress(value)
  })

  useMotionValueEvent(scrollY, 'change', (value) => {
    setScrollYValue(value)
  })

  const shadowScrollAreaStyle = useMemo(() => {
    const getTopGradientValue = transform([0, 0.025], [0, shadowSize])
    const getBottomGradientValue = transform([0.975, 1], [shadowSize, 0])

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
      }}
      {...restProps}
    >
      <AnimatePresence>
        {isShadowAnimated && (
          <>
            <motion.div
              className={cn(
                'w-full bg-gradient-to-b from-transparent via-white/70 via-20% to-transparent to-80%',
                `h-[50px]`
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
                display: scrollYProgress !== 0 ? 'inline-block' : 'none',
                zIndex: 2,
                position: 'absolute',
              }}
            />
            <motion.div
              className={cn(
                'w-full bg-gradient-to-t from-transparent via-white/70 via-20% to-transparent to-80% bottom-0',
                `h-[50px]`
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
                display: scrollYProgress !== 1 ? 'inline-block' : 'none',
                zIndex: 2,
                position: 'absolute',
              }}
            />
          </>
        )}
      </AnimatePresence>
      {children}
    </div>
  )
})

export { ShadowScrollArea }
