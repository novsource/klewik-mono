import * as React from 'react'

import { Popover as PopoverPrimitive } from '@base-ui/react/popover'

import { cn } from '~shared/utils'

import { popoverVariants } from '../styles/popover.styles'

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

type PopoverContentProps = PopoverPrimitive.Popup.Props & {
  positionerProps?: PopoverPrimitive.Positioner.Props
  portalProps?: PopoverPrimitive.Portal.Props
}

function PopoverContent(props: PopoverContentProps) {
  const {
    className,
    positionerProps,
    portalProps,
    children,
    ...restProps
  } = props

  return (
    <PopoverPrimitive.Portal {...portalProps}>
      <PopoverPrimitive.Backdrop />
      <PopoverPrimitive.Positioner {...positionerProps}>
        <PopoverPrimitive.Popup
          className={cn(popoverVariants(), className)}
          data-slot="popover-content"
          {...restProps}
        >
          <PopoverPrimitive.Arrow />
          { children }
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverContent, PopoverTrigger }
