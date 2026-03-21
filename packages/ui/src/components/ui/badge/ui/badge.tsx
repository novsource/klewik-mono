'use client'

import type { BadgeStylesProps } from '../styles/badge-variants'

import type { HTMLAttributes } from 'react'
import { useMemo } from 'react'

import { cn } from '../../../../utils/index'

import { badgeVariants } from '../styles/badge-variants'

export type BadgeProps = HTMLAttributes<HTMLDivElement> & BadgeStylesProps

export const Badge = (props: BadgeProps) => {
  const { className, variant, size, ...restProps } = props

  const styles = useMemo(() => {
    return cn(badgeVariants({ variant, size }), className)
  }, [className, variant, size])

  return <div className={styles} {...restProps} />
}
