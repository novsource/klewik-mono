import type { AnimatePresenceProps, HTMLMotionProps } from 'motion/react'

import { forwardRef } from 'react'

import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'

export type MotionBoxProps = HTMLMotionProps<'div'> & {
  withAnimatePresense?: boolean
  animatePresenseProps?: AnimatePresenceProps
}

export const MotionBox = forwardRef<HTMLDivElement, MotionBoxProps>(
  (props, forwardRef) => {
    const {
      withAnimatePresense,
      animatePresenseProps,
      ...restProps
    } = props

    if (withAnimatePresense) {
      return (
        <AnimatePresence {...animatePresenseProps}>
          <m.div ref={forwardRef} {...restProps} />
        </AnimatePresence>
      )
    }

    return <m.div {...restProps} />
  },
)
