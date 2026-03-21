'use client'

import type { ComponentProps } from 'react'
import { forwardRef } from 'react'

import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react'

import { cn } from '../../../../utils/index'

import {
  scrollAreaRootVariants,
  scrollAreaScrollbarVariants,
  scrollAreaThumbVariants,
  scrollAreaViewportVariants,
} from '../styles/scroll-area-variants'

export type ScrollAreaViewportProps = ComponentProps<typeof ScrollAreaPrimitive.Viewport>

const ScrollAreaViewport = forwardRef<HTMLDivElement, ScrollAreaViewportProps>
  ((props, forwardRef) => (
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      ref={forwardRef}
      className={scrollAreaViewportVariants()}
      {...props}
    />
  ),
  )

export type ScrollAreaProps = ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  viewportProps?: ComponentProps<typeof ScrollAreaPrimitive.Viewport>
}

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (props, forwardRef) => {
    const { className, children, viewportProps, ...restProps } = props

    return (
      <ScrollAreaPrimitive.Root
        data-slot="scroll-area"
        ref={forwardRef}
        className={cn(scrollAreaRootVariants(), className)}
        {...restProps}
      >
        <ScrollAreaViewport {...viewportProps}>{children}</ScrollAreaViewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    )
  },
)

export type ScrollBarProps = ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>

function ScrollBar(props: ScrollBarProps) {
  const { className, orientation = 'vertical', ...restProps } = props

  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(scrollAreaScrollbarVariants({ orientation }), className)}
      {...restProps}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className={scrollAreaThumbVariants()}
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea }
