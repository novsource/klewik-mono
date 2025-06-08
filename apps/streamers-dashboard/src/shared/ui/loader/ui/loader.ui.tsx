import { useState } from 'react'

import { AnimatePresence, TargetAndTransition, motion } from 'framer-motion'

import { Icons } from '~shared/ui/icons'

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

  console.log(isInitialAnimationDone)

  return (
    <AnimatePresence>
      <motion.div
        variants={loaderAnimationsVariants}
        initial={'appear'}
        animate={isInitialAnimationDone ? 'visible' : 'loopVisible'}
        onAnimationComplete={(definition) => {
          console.log(definition)
          if (!isInitialAnimationDone) setIsInitialAnimationDone(true)
        }}
      >
        <Icons.Logo className="text-gray-accent" width={32} height={32} />
      </motion.div>
    </AnimatePresence>
  )
}

export { Loader }
