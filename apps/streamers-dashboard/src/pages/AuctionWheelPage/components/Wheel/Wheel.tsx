import { RefObject, forwardRef } from 'react'

type WheelProps = {
  wheelSelectorRef: RefObject<HTMLCanvasElement>
}

const Wheel = forwardRef<HTMLCanvasElement, WheelProps>(
  ({ wheelSelectorRef }, ref) => {
    return (
      <div className="flex-shrink-1 flex h-full w-full items-center justify-center">
        <div className="relative flex h-full w-full items-start justify-center">
          <canvas ref={ref} />
          <canvas className="absolute top-0" ref={wheelSelectorRef} />
        </div>
      </div>
    )
  }
)

export default Wheel
