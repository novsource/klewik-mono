import { ReactNode } from 'react'

import { SliderContextProps, useSliderContext } from '../context/slider-context'

type SliderTriggerProps = {
  children: ReactNode
  value: SliderContextProps['keys'][number]
  className?: string
}

const SliderTrigger = ({ children, className, value }: SliderTriggerProps) => {
  const {
    func: { setSelectedKey },
  } = useSliderContext()

  return (
    <div className={className} onClick={() => setSelectedKey(value)}>
      {children}
    </div>
  )
}

export default SliderTrigger
