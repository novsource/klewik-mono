import type { TargetAndTransition } from 'motion/react'

import { useState } from 'react'

import { Icons } from 'klewik-ui/icons'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'

type LoaderAnimationsConditions = 'appear' | 'visible' | 'loopVisible'

const loaderAnimationsVariants: Record<
  LoaderAnimationsConditions,
  TargetAndTransition
> = {
  appear: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.8,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
    },
  },
  loopVisible: {
    opacity: 1,
    scale: [0.95, 1, 0.95, 1, 0.95],
    rotate: [0, -180, 0, 180, 0],
    transition: {
      duration: 3.5,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
}

const Loader = () => {
  const [isInitialAnimationDone, setIsInitialAnimationDone] = useState(false)

  return (
    <AnimatePresence>
      <m.div
        variants={loaderAnimationsVariants}
        initial="appear"
        animate={isInitialAnimationDone ? 'visible' : 'loopVisible'}
        onAnimationComplete={(definition) => {
          console.log(definition)
          if (!isInitialAnimationDone)
            setIsInitialAnimationDone(true)
        }}
      >
        <Icons.Logo className="text-gray-accent" width={32} height={32} />
      </m.div>
    </AnimatePresence>
  )
}

export { Loader }
