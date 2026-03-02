import type { NumberFlowProps } from '@number-flow/react'

import type { UseActionTimerReturn } from '../hooks'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import NumberFlow, { NumberFlowGroup } from '@number-flow/react'

import type { ButtonProps } from '~shared/ui/button'
import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { cn, mergeProps } from '~shared/utils'

import { TimerProvider, useTimerContext } from '../context'

export type TimerValueProps = ComponentPropsWithoutRef<'div'> & {
  hoursProps?: NumberFlowProps
  minutesProps?: NumberFlowProps
  secondsProps?: NumberFlowProps
}

export const TimerValue = (props: TimerValueProps) => {
  const {
    className,
    hoursProps,
    minutesProps,
    secondsProps,
    ...restProps
  } = props

  const auctionTimer = useTimerContext()

  return (
    <NumberFlowGroup>
      <Flex
        className={cn('font-azeret-mono text-md font-medium text-gray-accent', className)}
        style={{
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.5px',
        }}
        {...restProps}
      >
        <NumberFlow
          willChange
          trend={0}
          value={auctionTimer.hours}
          digits={{ 1: { max: 5 } }}
          format={{ minimumIntegerDigits: 2 }}
          {...hoursProps}
        />
        <NumberFlow
          willChange
          trend={0}
          prefix=":"
          value={auctionTimer.minutes}
          digits={{ 1: { max: 5 } }}
          format={{ minimumIntegerDigits: 2 }}
          {...minutesProps}
        />
        <NumberFlow
          willChange
          trend={0}
          prefix=":"
          value={auctionTimer.seconds}
          digits={{ 1: { max: 5 } }}
          format={{ minimumIntegerDigits: 2 }}
          {...secondsProps}
        />
      </Flex>
    </NumberFlowGroup>
  )
}

export type TimerStartButtonProps = ButtonProps

export const TimerStartButton = (props: TimerStartButtonProps) => {
  const { className, ...restProps } = props

  const auctionTimer = useTimerContext()

  const mergedProps = mergeProps(
    {
      onClick: auctionTimer.toggle,
    },
    restProps,
  )

  return (
    <Button
      className={cn('px-0.5 hover:text-gray-accent', className)}
      variant="ghost"
      size="sm"
      isIconOnly
      icon={
        auctionTimer.status === 'ticking'
          ? (
              <Icons.Pause width={14} height={14} />
            )
          : (
              <Icons.Play width={14} height={14} />
            )
      }
      {...mergedProps}
    />
  )
}

export type TimerStopButtonProps = ButtonProps

export const TimerStopButton = (props: TimerStopButtonProps) => {
  const { className, ...restProps } = props

  const auctionTimer = useTimerContext()

  const mergedProps = mergeProps(
    { onClick: auctionTimer.stop },
    restProps,
  )

  return (
    <Button
      className={cn('px-0.5 hover:text-gray-accent', className)}
      variant="ghost"
      size="sm"
      isIconOnly
      icon={<Icons.Stop width={14} height={14} />}
      {...mergedProps}
    />
  )
}

export type TimerIncreaseButtonProps = ButtonProps & {
  addingValue?: number
}

export const TimerIncreaseButton = (props: TimerIncreaseButtonProps) => {
  const { className, addingValue, ...restProps } = props

  const auctionTimer = useTimerContext()

  const mergedProps = mergeProps(
    { onClick: () => auctionTimer.increase(addingValue ?? 1) },
    restProps,
  )

  return (
    <Button
      className={cn('px-0.5 hover:text-gray-accent', className)}
      variant="ghost"
      size="sm"
      isIconOnly
      icon={<Icons.Plus />}
      {...mergedProps}
    />
  )
}

export type TimerDecreaseButtonProps = ButtonProps & {
  decreaseValue?: number
}

export const TimerDecreaseButton = (props: TimerDecreaseButtonProps) => {
  const { className, decreaseValue, ...restProps } = props

  const timer = useTimerContext()

  const mergedProps = mergeProps(
    { onClick: () => timer.decrease(decreaseValue ?? 1) },
    restProps,
  )

  return (
    <Button
      className={cn('px-0.5 hover:text-gray-accent', className)}
      variant="ghost"
      size="sm"
      isIconOnly
      icon={<Icons.Minus />}
      {...mergedProps}
    />
  )
}

export type TimerProps = {
  children: ReactNode
  timer?: UseActionTimerReturn
}

export const Timer = (props: TimerProps) => {
  return <TimerProvider {...props} />
}
