import type { AnimatePresenceProps, HTMLMotionProps } from 'motion/react'

import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'

export type MotionBoxProps = HTMLMotionProps<'div'> & {
  withAnimatePresense?: boolean
  animatePresenseProps?: AnimatePresenceProps
}

export const MotionBox = (props: MotionBoxProps) => {
  const { withAnimatePresense, animatePresenseProps, ...restProps } = props

  if (withAnimatePresense) {
    return (
      <AnimatePresence {...animatePresenseProps}>
        <m.div {...restProps} />
      </AnimatePresence>
    )
  }

  return <m.div {...props} />
}
