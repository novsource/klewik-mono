import { useMemo } from 'react'

import { cn } from '~shared/utils/cn'

import { skeletonVariants } from '../styles/skeletonVariants'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const styles = useMemo(() => cn(skeletonVariants(), className), [className])

  return <div className={styles} {...props} />
}

export { Skeleton }
