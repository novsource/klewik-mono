import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'

import type { ButtonProps } from '~shared/ui/button'
import { Button } from '~shared/ui/button'

export type ToggleProps = Omit<ButtonProps, 'value'> & {
  value: string
}

export const Toggle = (props: ToggleProps) => {
  return (
    <TogglePrimitive
      render={(props: ButtonProps, state) => {
        return <Button variant="ghost" disabled={state.disabled} {...props} />
      }}
      {...props}
    />
  )
}

export type ToggleGroupProps = ToggleGroupPrimitive.Props

export const ToggleGroup = (props: ToggleGroupProps) => {
  return (
    <ToggleGroupPrimitive {...props} />
  )
}
