import { ReactNode } from 'react'
import { SliderContextProps, SliderProvider } from './SliderContext'

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
