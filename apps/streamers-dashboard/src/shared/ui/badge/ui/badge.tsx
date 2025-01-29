import { HTMLAttributes, useMemo } from 'react'

import { cn } from '~shared/utils'

import { BadgeStylesProps, badgeVariants } from '../styles/badge-variants'

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    BadgeStylesProps {}

function Badge({ className, variant, ...props }: BadgeProps) {
  const styles = useMemo(() => {
    return cn(badgeVariants({ variant }), className)
  }, [className])

  return <div className={styles} {...props} />
}

export { Badge, badgeVariants }
