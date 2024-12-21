import { ReactNode, useEffect, useMemo, useRef } from 'react'

import { cn } from '~shared/utils'

import { useSliderContext } from '../context/slider-context'

type SliderContentProps = {
  children: ReactNode | ReactNode[]
  value: string
  className?: string
}

const SliderContent = ({ children, value, className }: SliderContentProps) => {
  const {
    state: { selectedKey },
  } = useSliderContext()

  const animationEffect = useRef<'mount' | 'unmount'>('mount')

  useEffect(() => {
    if (selectedKey === value) {
      animationEffect.current = 'mount'
    }

    return () => {
      if (selectedKey !== value) {
        animationEffect.current = 'unmount'
      }
    }
  }, [selectedKey])

  const isPresents = useMemo(() => selectedKey === value, [selectedKey])

  return (
    isPresents && (
      <div className={cn('transition-[opacity]', className)}>{children}</div>
    )
  )
}

export default SliderContent
