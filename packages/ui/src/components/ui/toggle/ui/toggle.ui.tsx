import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'

import type { ButtonProps } from '../../button'
import { Button } from '../../button'

export type ToggleProps = Omit<TogglePrimitive.Props, 'render'> & {
  buttonProps?: ButtonProps
  value: string
}

export const Toggle = (props: ToggleProps) => {
  const { buttonProps, ...toggleProps } = props

  return (
    <TogglePrimitive
      render={(props, state) => {
        return <Button variant="ghost" disabled={state.disabled} {...buttonProps} {...props} />
      }}
      {...toggleProps}
    />
  )
}

export type ToggleGroupProps = ToggleGroupPrimitive.Props

export const ToggleGroup = (props: ToggleGroupProps) => {
  return (
    <ToggleGroupPrimitive {...props} />
  )
}
