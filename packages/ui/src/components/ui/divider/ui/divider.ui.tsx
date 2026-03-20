import type { ComponentPropsWithRef } from 'react'

import { cn } from '~utils/index'

type DividerProps = ComponentPropsWithRef<'hr'> & {
  orientation?: 'horizontal' | 'vertical'
}

const Divider = (props: DividerProps) => {
  const { className, orientation = 'horizontal', ...restProps } = props

  return (
    <hr
      className={cn(
        'border-dark-accent',
        orientation === 'horizontal' && 'w-full border-b-0 border-t-1',
        orientation === 'vertical' && 'h-2/3 border-l-0 border-r-1',
        className,
      )}
      {...restProps}
    />
  )
}

export { Divider }
