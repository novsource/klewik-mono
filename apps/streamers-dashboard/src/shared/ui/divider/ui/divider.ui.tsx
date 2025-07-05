import type { ComponentPropsWithRef } from 'react'

import { cn } from '~shared/utils'

type DividerProps = ComponentPropsWithRef<'hr'> & {
  orientation?: 'horizontal' | 'vertical'
}

const Divider = (props: DividerProps) => {
  const { className, orientation = 'horizontal', ...restProps } = props

  return (
    <hr
      className={cn('border-1 border-dark-accent', orientation === 'horizontal' && 'w-full', orientation === 'vertical' && 'h-2/3', className)}
      {...restProps}
    />
  )
}

export { Divider }
