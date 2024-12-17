import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import { motion } from 'framer-motion'
import { cn } from '~shared/utils/cn'

type Props = {
  children: ReactNode
  className?: string
}

const AnimatedRoute = ({ children, className }: Props) => {
  const location = useLocation()

  return (
    <motion.div
      key={location.pathname}
      className={cn('h-full w-full', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedRoute
