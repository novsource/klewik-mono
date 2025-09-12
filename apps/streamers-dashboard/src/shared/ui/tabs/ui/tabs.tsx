import type {
  TabsStylesProps,
} from '../styles/tabs-variants'

import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react'
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import * as TabsPrimitive from '@radix-ui/react-tabs'

import { useMergedRefs, useResizeObserver } from '~shared/hooks'

import { mergeProps } from '~shared/utils'
import { cn } from '~shared/utils/cn'

import { TabsContextProvider, useTabContext } from '../context/tabs-context'
import {
  tabsContentVariants,
  tabsListVariants,
  tabsTriggerRunnerVariants,
  tabsTriggerVariants,
} from '../styles/tabs-variants'

export type TabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & TabsStylesProps

export const Tabs = forwardRef<ElementRef<typeof TabsPrimitive.Root>, TabsProps>((props, ref) => {
  const {
    value,
    defaultValue,
    variant,
    ...restProps
  } = props

  const [currentValue, setCurrentValue] = useState(
    value ?? defaultValue ?? '',
  )

  useLayoutEffect(() => {
    if (currentValue !== value && value) {
      setCurrentValue(value)
    }
  }, [currentValue, value])

  const tabsProps = mergeProps(restProps, { onValueChange: setCurrentValue })

  return (
    <TabsContextProvider defaultValue={defaultValue} value={currentValue} variant={variant}>
      <TabsPrimitive.Root
        ref={ref}
        defaultValue={defaultValue}
        value={currentValue}
        {...tabsProps}
      />
    </TabsContextProvider>
  )
})

// This is component for animation of selection of tabs
const TabsTriggerRunner = () => {
  const {
    state: { selectedKey, triggersData },
    styles: variantStyles,
  } = useTabContext()

  const [width, setWidth] = useState(0)
  const [x, setX] = useState(0)

  useLayoutEffect(() => {
    if (!triggersData)
      return

    const selectedTriggerData = triggersData[selectedKey]
    const isDataExists = !!selectedTriggerData

    if (isDataExists) {
      setWidth(selectedTriggerData.width)
      setX(selectedTriggerData.startX)
    }
  }, [triggersData, selectedKey])

  const styles = useMemo(
    () =>
      cn(tabsTriggerRunnerVariants(variantStyles)),
    [variantStyles],
  )

  // If the width is zero, the trigger will be filled in
  if (width === 0) {
    return
  }

  return (
    <div
      className={styles}
      style={{
        width,
        transform: `translateX(calc(${x}px - var(--tabs-inner-padding)))`,
      }}
    />
  )
}

export type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List>

export const TabsList = forwardRef<
ElementRef<typeof TabsPrimitive.List>,
TabsListProps
>((props, forwardRef) => {
  const { className, children, ...restProps } = props

  const { styles: variantProps } = useTabContext()

  const styles = useMemo(
    () => cn(tabsListVariants(variantProps), className),
    [className, variantProps],
  )

  return (
    <TabsPrimitive.List ref={forwardRef} className={styles} {...restProps}>
      <>
        <TabsTriggerRunner />
        {children}
      </>
    </TabsPrimitive.List>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

export type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  startContent?: ReactNode
  endContent?: ReactNode
}

export const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>((props, forwardRef) => {
  const {
    className,
    value,
    startContent,
    endContent,
    onClick,
    children,
    ...restProps
  } = props

  const internalTriggerRef = useRef<HTMLButtonElement>(null)
  const triggerMergedRef = useMergedRefs(internalTriggerRef, forwardRef)

  const {
    state: { triggersData, selectedKey },
    dispatch: { setKeys, setSelectedKey, setTriggersData },
    styles: variantsProps,
  } = useTabContext()

  useResizeObserver(internalTriggerRef, {
    onChange: ([entry]) => {
      const triggerElement = internalTriggerRef.current

      if (!triggerElement || !triggersData)
        return

      const storedTriggerData = triggersData[value]

      const startX = triggerElement.offsetLeft
      const actualWidth = entry.target.clientWidth

      const isStoredWidthOutdated = actualWidth !== storedTriggerData.width

      if (isStoredWidthOutdated) {
        setTriggersData(curr =>
          ({ ...curr, [value]: { value, startX, width: actualWidth } }))
      }
    },
  })

  useEffect(() => {
    setKeys(prev => [...prev, value])
  }, [value])

  useEffect(() => {
    const triggerElement = internalTriggerRef.current

    if (!triggerElement)
      return

    const isCurrentTriggerDataNotStored = !triggersData || !triggersData[value]

    if (isCurrentTriggerDataNotStored) {
      const startX = triggerElement.offsetLeft
      const width = triggerElement.clientWidth

      setTriggersData(curr => ({ ...curr, [value]: { value, startX, width } }))
    }
  }, [value, setTriggersData, triggersData])

  const styles = useMemo(
    () => cn(
      tabsTriggerVariants(variantsProps),
      className,
      !triggersData && selectedKey === value && 'rounded-medium bg-dark-accent tabs-runner-shadow',
    ),
    [className, variantsProps, triggersData, selectedKey, value],
  )

  const triggerProps = mergeProps(restProps, { onClick: () => setSelectedKey(value) })

  return (
    <TabsPrimitive.Trigger
      ref={triggerMergedRef}
      value={value}
      className={styles}
      {...triggerProps}
    >
      {startContent}
      {children}
      {endContent}
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

export type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>

export const TabsContent = forwardRef<
ElementRef<typeof TabsPrimitive.Content>,
TabsContentProps
>((props, forwardRef) => {
  const { className, ...restProps } = props

  const styles = useMemo(
    () => cn(tabsContentVariants(), className),
    [className],
  )

  return <TabsPrimitive.Content ref={forwardRef} className={styles} {...restProps} />
})
TabsContent.displayName = TabsPrimitive.Content.displayName
