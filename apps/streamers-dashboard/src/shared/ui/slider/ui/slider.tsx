import { ReactNode } from 'react'

import { SliderContextProps, SliderProvider } from '../context/slider-context'

type SliderProps = SliderContextProps & {
  children: ReactNode | ReactNode[]
  className?: string
}

const Slider = ({ className, children, ...props }: SliderProps) => {
  return (
    <SliderProvider {...props}>
      <div className={className}>{children}</div>
    </SliderProvider>
  )
}

export default Slider
