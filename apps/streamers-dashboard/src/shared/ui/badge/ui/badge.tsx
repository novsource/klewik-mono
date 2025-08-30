import type { BadgeStylesProps } from '../styles/badge-variants'

import type { HTMLAttributes } from 'react'
import { useMemo } from 'react'

import { cn } from '~shared/utils'

import { badgeVariants } from '../styles/badge-variants'

export type BadgeProps = HTMLAttributes<HTMLDivElement> & BadgeStylesProps

export const Badge = (props: BadgeProps) => {
  const { className, variant, ...restProps } = props

  const styles = useMemo(() => {
    return cn(badgeVariants({ variant }), className)
  }, [className, variant])

  return <div className={styles} {...restProps} />
}
