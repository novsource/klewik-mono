import type { ComponentPropsWithRef } from 'react'

import { cn } from '~shared/utils'

type DividerProps = ComponentPropsWithRef<'hr'> & {
  orientation?: 'horizontal' | 'vertical'
}

const Divider = (props: DividerProps) => {
  const { className, orientation = 'horizontal', ...restProps } = props

  return (
    <hr
      className={cn('border-divider', orientation === 'horizontal' && 'w-full h-[1px]', orientation === 'vertical' && 'h-full w-[1px]', className)}
      {...restProps}
    />
  )
}

export { Divider }
