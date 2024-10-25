import { cn } from '@utils/cn'
import { useEffect, useRef, useState } from 'react'

import { animate, useMotionValue } from 'framer-motion'
import { fitTextEllipsis } from '@utils/canvas'

const trimText = (text: string, maxWidth: number): string => {
  const canvas = document.createElement('canvas')
  const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D
  const ratio = window.devicePixelRatio || 1

  canvas.width = Math.floor(maxWidth * ratio)
  canvas.style.width = `${maxWidth}px`

  canvasContext.font = '17px sans-serif'

  const trimmedText = fitTextEllipsis(
    canvas.getContext('2d') as CanvasRenderingContext2D,
    text,
    maxWidth
  )

  return trimmedText
}

const getTextMaxWidth = (text: string, maxWidth: number): number => {
  const canvas = document.createElement('canvas')
  const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D
  const ratio = window.devicePixelRatio || 1

  canvas.width = Math.floor(maxWidth * ratio)
  canvas.style.width = `${maxWidth}px`

  canvasContext.font = '17px sans-serif'

  return Math.ceil(canvasContext.measureText(text).width)
}

const AnimatedTruncText = ({
  children,
  classNames = '',
}: {
  children: string
  classNames?: string
}) => {
  const [isAnimationPlaying, setAnimationPlaying] = useState<boolean>(false)
  const [animationControls, setAnimationControls] = useState<ReturnType<
    typeof animate
  > | null>(null)

  const [text, setText] = useState<string>(children)
  const [isNeedToShowEllipsis, setIsNeedToShowEllipsis] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const translateValue = useMotionValue(0)
  const needToTranslate = useRef(0)

  const boxRef = useRef<HTMLDivElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let spanElement: HTMLSpanElement | null = null
    let boxElement: HTMLDivElement | null = null

    if (spanRef.current) spanElement = spanRef.current
    if (boxRef.current) boxElement = boxRef.current

    if (spanElement && boxElement && needToTranslate.current === 0) {
      const boxWidth = boxElement.getBoundingClientRect().width
      const textWidth = getTextMaxWidth(children, boxWidth)

      needToTranslate.current = Number(textWidth) - Number(boxWidth)
    }

    if (isHovered && spanElement !== null) {
      if (isAnimationPlaying && animationControls !== null) {
        animationControls.cancel()
      }

      if (translateValue.get() !== needToTranslate.current) {
        const controls = animate(translateValue, needToTranslate.current, {
          ease: 'linear',
          delay: 2,
          duration: needToTranslate.current / 45,
          onPlay: () => {
            setAnimationPlaying(true)
          },
          onUpdate: (latest) => {
            spanElement?.setAttribute(
              'style',
              `transform:translate(-${latest}px,-50%)`
            )

            const newText = trimText(
              children,
              (boxElement?.getBoundingClientRect().width as number) + latest
            )

            setIsNeedToShowEllipsis(newText.includes('...'))
            setText(newText.replace('...', ''))
          },
          onStop: () => setAnimationPlaying(false),
          onComplete: () => {
            setAnimationPlaying(false)
          },
        })

        setAnimationControls(controls)
      }
    }

    if (
      isHovered &&
      translateValue.get() === needToTranslate.current &&
      needToTranslate.current !== 0
    ) {
      animate(1, 0, {
        ease: 'easeIn',
        duration: 1.25,
        delay: 2,
        onPlay: () => {
          setAnimationPlaying(true)
        },
        onUpdate(latest) {
          spanElement?.setAttribute(
            'style',
            `transform:translate(-${needToTranslate.current}px,-50%); opacity: ${latest}`
          )
        },
      }).then(() => {
        animate(0, 1, {
          ease: 'easeOut',
          duration: 0.75,
          onUpdate(op) {
            spanElement?.setAttribute(
              'style',
              `transform:translate(0px,-50%); opacity: ${op}`
            )
          },
          onComplete: () => {
            translateValue.set(0)
            needToTranslate.current = 0
            setAnimationPlaying(false)
          },
        })
      })
    }

    if (!isHovered && spanElement) {
      if (isAnimationPlaying && animationControls !== null) {
        animationControls.cancel()
      }

      needToTranslate.current = 0

      spanElement.setAttribute('style', 'transform:translate(0px, -50%)')

      const trimmedText = trimText(
        children,
        boxElement?.getBoundingClientRect().width as number
      )

      setAnimationPlaying(false)
      setIsNeedToShowEllipsis(trimmedText.includes('...'))
      setText(trimmedText.replace('...', ''))
    }
  }, [isHovered, isAnimationPlaying])

  return (
    <div
      ref={boxRef}
      className="relative h-8 w-full overflow-hidden text-nowrap"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        ref={spanRef}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 font-medium',
          ...classNames
        )}
      >
        {text}
      </span>
      {isNeedToShowEllipsis && (
        <span
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 font-medium',
            ...classNames
          )}
        >
          ...
        </span>
      )}
    </div>
  )
}

export default AnimatedTruncText
