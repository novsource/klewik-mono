'use client'

import { useMemo } from 'react'

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import { ChevronDown } from 'lucide-react'

// import { cn, toBooleanString } from '../../../../utils'

import {
  accordionItemVariants,
  accordionPanelVariants,
  accordionTriggerVariants,
  accordionVariants,
} from '../styles/accordion.variants'
import { cn } from '../../../../utils/cn'
import { toBooleanString } from '../../../../utils/to-boolean-string'

export type AccordionProps = AccordionPrimitive.Root.Props

export function Accordion(props: AccordionProps) {
  const { className, multiple, ...restProps } = props

  const classes = useMemo(() => cn(accordionVariants(), className), [className])

  return <AccordionPrimitive.Root className={classes} multiple={multiple} data-multiple={toBooleanString(multiple)} {...restProps} />
}

export type AccordionTriggerProps = AccordionPrimitive.Trigger.Props

export function AccordionTrigger(props: AccordionTriggerProps) {
  const { className, children, ...restProps } = props

  const classes = useMemo(() => cn(accordionTriggerVariants(), className), [className])

  return (
    <AccordionPrimitive.Trigger className={classes} {...restProps}>
      {children}
      <ChevronDown className="size-4 mr-2 transition-all ease-out self-center group-data-[panel-open]:rotate-180" />
    </AccordionPrimitive.Trigger>
  )
}

export type AccordionItemProps = AccordionPrimitive.Item.Props

export function AccordionItem(props: AccordionItemProps) {
  const { className, ...restProps } = props

  const classes = useMemo(() => cn(accordionItemVariants(), className), [className])

  return <AccordionPrimitive.Item className={classes} {...restProps} />
}

export type AccordionPanelProps = AccordionPrimitive.Panel.Props

export function AccordionPanel(props: AccordionPanelProps) {
  const { className, ...restProps } = props

  const classes = useMemo(() => cn(accordionPanelVariants(), className), [className])

  return <AccordionPrimitive.Panel className={classes} {...restProps} />
}

export type AccordionHeaderProps = AccordionPrimitive.Header.Props

export function AccordionHeader(props: AccordionHeaderProps) {
  const { className, ...restProps } = props

  const classes = useMemo(() => cn(className), [className])

  return <AccordionPrimitive.Header className={classes} {...restProps} />
}
