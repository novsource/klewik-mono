'use client'

import { ComponentProps, useMemo } from 'react'

import { cn } from '~utils/index'

import { skeletonVariants } from '../styles/skeletonVariants'

function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  const styles = useMemo(() => cn(skeletonVariants(), className), [className])

  return <div className={styles} {...props} />
}

export { Skeleton }
