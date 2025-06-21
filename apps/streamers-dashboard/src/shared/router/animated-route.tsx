import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import * as m from 'motion/react-m'

import { cn } from '~shared/utils/cn'

type Props = {
  children: ReactNode
  className?: string
}

const AnimatedRoute = ({ children, className }: Props) => {
  const location = useLocation()

  return (
    <m.div
      key={location.pathname}
      className={cn('h-full w-full', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </m.div>
  )
}

export default AnimatedRoute
