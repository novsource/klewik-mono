import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import * as TabsPrimitive from '@radix-ui/react-tabs'

import { useResizeObserver } from '~shared/hooks/use-resize-observer'

import { cn } from '~shared/utils/cn'

import { TabsContextProvider, useTabContext } from '../context/tabs-context'
import {
  tabsContentVariants,
  tabsListVariants,
  tabsTriggerRunnerVariants,
  tabsTriggerVariants,
} from '../styles/tabs-variants'

const Tabs = forwardRef<
ElementRef<typeof TabsPrimitive.Root>,
ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ onValueChange, value, defaultValue, ...props }, ref) => {
  const [currentValue, setCurrentValue] = useState(
    value ?? defaultValue ?? '',
  )

  const onValueChangeHandler = useCallback(
    (value: string) => {
      setCurrentValue(value)

      onValueChange && onValueChange(value)
    },
    [onValueChange],
  )

  useLayoutEffect(() => {
    if (currentValue !== value && value) {
      setCurrentValue(value)
    }
  }, [currentValue, value])

  return (
    <TabsContextProvider defaultValue={defaultValue} value={currentValue}>
      <TabsPrimitive.Root
        ref={ref}
        onValueChange={onValueChangeHandler}
        defaultValue={defaultValue}
        value={currentValue}
        {...props}
      />
    </TabsContextProvider>
  )
})

// This is component for animation of selection of tabs
const TabsTriggerRunner = () => {
  const [width, setWidth] = useState(0)
  const [x, setX] = useState(0)

  // State for prevent width animation on tab trigger paint
  const [isFirstWidthSetted, setIsFirstWidthSetted] = useState(false)

  const {
    state: { selectedKey, triggersData, defaultKey },
  } = useTabContext()

  if (!isFirstWidthSetted && width !== 0 && defaultKey !== selectedKey) {
    setIsFirstWidthSetted(true)
  }

  const styles = useMemo(
    () => cn(tabsTriggerRunnerVariants(), 'transition-none', isFirstWidthSetted && 'transition-all'),
    [isFirstWidthSetted],
  )

  useLayoutEffect(() => {
    if (triggersData.length !== 0 && selectedKey.length !== 0) {
      const selectedTrigger = triggersData?.filter(
        item => item.value === selectedKey,
      )[0]

      setWidth(selectedTrigger.width)
      setX(selectedTrigger.startX)
    }
    else {
      setWidth(0)
      setX(0)
    }
  }, [triggersData, selectedKey])

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

const TabsList = forwardRef<
ElementRef<typeof TabsPrimitive.List>,
ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const styles = useMemo(
    () => cn(tabsListVariants(), className),
    [className],
  )

  return (
    <TabsPrimitive.List ref={ref} className={styles} {...props}>
      <>
        <TabsTriggerRunner />
        {children}
      </>
    </TabsPrimitive.List>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>((props, ref) => {
  const { className, value, onClick, ...restProps } = props

  const tabTriggerRef = useRef<NullablePossible<HTMLElement>>(null)

  const {
    state: { triggersData },
    dispatch: { setKeys, setSelectedKey, setTriggersData },
  } = useTabContext()

  useEffect(() => {
    setKeys(prev => [...prev, value])
  }, [setKeys, value])

  const triggerData = triggersData.find(trigger => trigger.value === value)

  const { entries } = useResizeObserver(tabTriggerRef)

  useEffect(() => {
    const tabTriggerElement = tabTriggerRef.current
    const [entry] = entries

    if (!tabTriggerElement || !entry)
      return

    const updatedElementsProperties = entry.target.getBoundingClientRect()

    const start = tabTriggerElement.offsetLeft
    const width = updatedElementsProperties.width

    const currentWidth = triggerData?.width

    if (currentWidth !== width) {
      setTriggersData(curr =>
        [...curr.filter(trigger => trigger.value !== value), { value, startX: start, width }])
    }
  }, [entries, tabTriggerRef, value, setTriggersData, triggerData])

  useEffect(() => {
    const tabElement = tabTriggerRef.current

    const isTriggerDataExists
      = triggerData !== undefined

    if (tabElement && !isTriggerDataExists) {
      const x = tabElement.offsetLeft
      const width = tabElement.getBoundingClientRect().width

      setTriggersData(prev => [...prev, { value, startX: x, width }])
    }
  }, [tabTriggerRef, triggerData, value, setTriggersData])

  const styles = useMemo(
    () => cn(tabsTriggerVariants(), className),
    [className],
  )

  return (
    <TabsPrimitive.Trigger
      ref={(node) => {
        tabTriggerRef.current = node

        if (typeof ref === 'function') {
          ref(node)
        }
        else if (ref) {
          ref.current = node
        }
      }}
      value={value}
      className={styles}
      onClick={(e) => {
        onClick && onClick(e)
        setSelectedKey(value)
      }}
      {...restProps}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = forwardRef<
ElementRef<typeof TabsPrimitive.Content>,
ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => {
  const styles = useMemo(
    () => cn(tabsContentVariants(), className),
    [className],
  )

  return <TabsPrimitive.Content ref={ref} className={styles} {...props} />
})
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
