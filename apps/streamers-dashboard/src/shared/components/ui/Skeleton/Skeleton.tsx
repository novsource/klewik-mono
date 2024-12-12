import { useMemo } from 'react'

import { cn } from '@/lib/utils'

import { skeletonVariants } from './SkeletonVariants'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const styles = useMemo(() => cn(skeletonVariants(), className), [className])

  return <div className={styles} {...props} />
}

export { Skeleton }
