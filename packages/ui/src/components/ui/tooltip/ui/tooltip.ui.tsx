import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'

import { cn } from '~utils/index'

import { tooltipContentVariants } from '../styles/tooltip-variants'

function TooltipProvider({
  delay = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

type TooltipProps = TooltipPrimitive.Provider.Props & {
  rootProps?: TooltipPrimitive.Root.Props
}

function Tooltip(props: TooltipProps) {
  const { rootProps, ...providerProps } = props

  return (
    <TooltipProvider {...providerProps}>
      <TooltipPrimitive.Root data-slot="tooltip" {...rootProps} />
    </TooltipProvider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

export type TooltipContentProps = TooltipPrimitive.Popup.Props & {
  disableArrow?: boolean
  positionerProps?: TooltipPrimitive.Positioner.Props
  portalProps?: TooltipPrimitive.Portal.Props
}

function TooltipContent({
  className,
  portalProps,
  positionerProps,
  disableArrow = false,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner {...positionerProps}>
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(tooltipContentVariants(), className)}
          {...props}
        >
          {children}
          {!disableArrow && (
            <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
          )}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>

    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
