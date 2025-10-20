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
    orientation,
    ...restProps
  } = props

  const [currentValue, setCurrentValue] = useState(value ?? defaultValue)

  useLayoutEffect(() => {
    if (currentValue !== value && value) {
      setCurrentValue(value)
    }
  }, [currentValue, value])

  const tabsProps = mergeProps(restProps, { onValueChange: setCurrentValue })

  return (
    <TabsContextProvider
      defaultValue={defaultValue}
      value={currentValue}
      variant={variant}
      orientation={orientation}
    >
      <TabsPrimitive.Root
        ref={ref}
        defaultValue={defaultValue}
        value={currentValue}
        orientation={orientation}
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

  const [sizes, setSizes] = useState({
    width: 0,
    height: 0,
  })
  const [coords, setCoords] = useState({
    x: 0,
    y: 0,
  })

  useLayoutEffect(() => {
    if (!triggersData)
      return

    const selectedTriggerData = triggersData[selectedKey]
    const isDataExists = !!selectedTriggerData

    if (isDataExists) {
      setSizes({
        width: selectedTriggerData.width,
        height: selectedTriggerData.height,
      })
      setCoords({
        x: selectedTriggerData.startX,
        y: selectedTriggerData.startY,
      })
    }
  }, [triggersData, selectedKey])

  const classes = useMemo(
    () =>
      cn(tabsTriggerRunnerVariants(variantStyles)),
    [variantStyles],
  )

  if (sizes.width === 0 || sizes.height === 0) {
    return
  }

  const isHorizontal = variantStyles.orientation === 'horizontal'

  const triggerStyles = isHorizontal
    ? {
        width: sizes.width,
        transform: `translateX(calc(${coords.x}px - var(--tabs-inner-padding)))`,
      }
    : {
        height: sizes.height,
        transform: `translateY(calc(${coords.y}px)`,
      }

  return <div className={classes} style={triggerStyles} />
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
      const startY = triggerElement.offsetTop

      const actualWidth = entry.target.clientWidth
      const actualHeight = entry.target.clientHeight

      const isStoredWidthOutdated = actualWidth !== storedTriggerData.width
      const isStoredHeightOutdated = actualHeight !== storedTriggerData.height

      if (isStoredWidthOutdated || isStoredHeightOutdated) {
        setTriggersData(curr =>
          ({
            ...curr,
            [value]: {
              value,
              startX,
              startY,
              width: actualWidth,
              height: actualHeight,
            },
          }))
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
      const startY = triggerElement.offsetTop

      const width = triggerElement.clientWidth
      const height = triggerElement.clientHeight

      setTriggersData(curr => ({
        ...curr,
        [value]: {
          value,
          startX,
          startY,
          width,
          height,
        },
      }))
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
