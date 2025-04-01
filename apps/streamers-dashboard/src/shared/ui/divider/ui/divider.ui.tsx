import { ComponentProps } from 'react'

import { cn } from '~shared/utils'

const Divider = ({ className, ...props }: ComponentProps<'hr'>) => {
  return (
    <hr className={cn('w-full h-[1px] border-divider', className)} {...props} />
  )
}

export { Divider }
