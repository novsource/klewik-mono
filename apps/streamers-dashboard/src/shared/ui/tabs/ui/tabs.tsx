import * as React from 'react'

import * as TabsPrimitive from '@radix-ui/react-tabs'

import { useIsFirstRender } from '~shared/hooks/use-is-first-render'

import { cn } from '~shared/utils/cn'

import { TabsContextProvider, useTabContext } from '../context/tabs-context'
import {
  tabsContentVariants,
  tabsListVariants,
  tabsTriggerRunnerVariants,
  tabsTriggerVariants,
} from '../styles/tabs-variants'

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ onValueChange, value, defaultValue, ...props }, ref) => {
  const [currentValue, setCurrentValue] = React.useState(
    value ?? defaultValue ?? ''
  )

  const onValueChangeHandler = React.useCallback(
    (value: string) => {
      setCurrentValue(value)

      onValueChange && onValueChange(value)
    },
    [onValueChange]
  )

  React.useLayoutEffect(() => {
    if (currentValue !== value && value) {
      setCurrentValue(value)
    }
  }, [value])

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
  const [width, setWidth] = React.useState(0)
  const [x, setX] = React.useState(0)

  const {
    state: { selectedKey, triggersData },
  } = useTabContext()

  const isFirstRender = useIsFirstRender()

  const styles = React.useMemo(
    () => cn(tabsTriggerRunnerVariants(), isFirstRender && 'transition-none'),
    [isFirstRender]
  )

  React.useLayoutEffect(() => {
    if (triggersData.length !== 0 && selectedKey.length !== 0) {
      const { startX, width } = triggersData?.filter(
        (item) => item.value === selectedKey
      )[0]

      setWidth(width)
      setX(startX)
    }
  }, [triggersData, selectedKey])

  return (
    <div
      className={styles}
      style={{
        width,
        transform: `translateX(${x - 4}px)`,
      }}
    />
  )
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const styles = React.useMemo(
    () => cn(tabsListVariants(), className),
    [className]
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

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, value, ...props }, ref) => {
  const tabTriggerRef = React.useRef<NullablePossible<HTMLElement>>(null)

  const {
    state: { triggersData },
    dispatch: { setKeys, setSelectedKey, setTriggersData },
  } = useTabContext()

  React.useEffect(() => {
    setKeys((prev) => [...prev, value])
  }, [])

  React.useEffect(() => {
    const tabElement = tabTriggerRef.current
    const resizeEventCtrl = new AbortController()

    if (tabElement) {
      tabElement.addEventListener(
        'resize',
        () => {
          const x = tabElement?.offsetLeft
          const width = tabElement?.getBoundingClientRect().width

          setTriggersData((prev) => [
            ...prev.filter((data) => data.value !== value),
            { value, startX: x, width },
          ])
        },
        { signal: resizeEventCtrl.signal }
      )
    }

    return () => {
      resizeEventCtrl.abort()
    }
  }, [tabTriggerRef])

  React.useEffect(() => {
    const tabElement = tabTriggerRef.current

    const isTriggerExists =
      triggersData.find((item) => item.value === value) !== undefined

    if (tabElement && !isTriggerExists) {
      const x = tabElement.offsetLeft
      const width = tabElement.getBoundingClientRect().width

      setTriggersData((prev) => [...prev, { value, startX: x, width }])
    }
  }, [tabTriggerRef, triggersData])

  const styles = React.useMemo(
    () => cn(tabsTriggerVariants(), className),
    [className]
  )

  return (
    <TabsPrimitive.Trigger
      ref={(node) => {
        tabTriggerRef.current = node

        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      }}
      value={value}
      className={styles}
      {...props}
      onClick={(e) => {
        props.onClick && props.onClick(e)
        setSelectedKey(value)
      }}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => {
  const styles = React.useMemo(
    () => cn(tabsContentVariants(), className),
    [className]
  )

  return <TabsPrimitive.Content ref={ref} className={styles} {...props} />
})
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
