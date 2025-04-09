import * as React from 'react'

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

import { cn } from '~shared/utils'

import {
  scrollAreaRootVariants,
  scrollAreaScrollbarVariants,
  scrollAreaThumbVariants,
  scrollAreaViewportVariants,
} from '../styles/scroll-area-variants'

type ScrollAreaProps = React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  viewportProps?: React.ComponentProps<typeof ScrollAreaPrimitive.Viewport>
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (props, forwardRef) => {
    const { className, children, viewportProps, ...areaProps } = props
    return (
      <ScrollAreaPrimitive.Root
        data-slot="scroll-area"
        ref={forwardRef}
        className={cn(scrollAreaRootVariants(), className)}
        {...areaProps}
      >
        <ScrollAreaViewport {...viewportProps}>{children}</ScrollAreaViewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    )
  }
)

const ScrollAreaViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ScrollAreaPrimitive.Viewport>
>((props, forwardRef) => {
  const { children, ...viewportProps } = props
  return (
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      ref={forwardRef}
      className={scrollAreaViewportVariants()}
      {...viewportProps}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
  )
})

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(scrollAreaScrollbarVariants({ orientation }), className)}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className={scrollAreaThumbVariants()}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
