import type { HTMLMotionProps } from 'motion/react'

import * as m from 'motion/react-m'

export type MotionBoxProps = HTMLMotionProps<'div'>

export const MotionBox = (props: MotionBoxProps) => {
  return <m.div {...props} />
}
