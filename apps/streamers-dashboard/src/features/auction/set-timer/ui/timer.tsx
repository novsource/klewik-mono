import { ComponentProps, useLayoutEffect, useRef, useState } from 'react'

import NumberFlow, { NumberFlowGroup } from '@number-flow/react'
import { motion } from 'framer-motion'

import { appSelectors } from '~shared/store/slices'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { useTimer } from '~shared/hooks/use-timer'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { cn } from '~shared/utils'

type TimerButtonProps = ComponentProps<'div'> & {
  defaultTimerText?: string
}

type TimerStatus = 'stopped' | 'paused' | 'ticking' | 'ended'

const TimerControls = motion.create('timer-controls')

const TimerButton = ({ defaultTimerText, ...props }: TimerButtonProps) => {
  const { initial, addedTimeValue, decreaseTimeValue } = useStoreSelector(
    appSelectors.getTimerSettings
  )

  const [timerStatus, setTimerStatus] = useState<TimerStatus>('stopped')
  const controlsElRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    console.log(controlsElRef.current?.getBoundingClientRect().width)
  }, [controlsElRef.current])

  const {
    control: {
      start: startTimer,
      stop: stopTimer,
      addTime,
      decreaseTime,
      pause: pauseTimer,
    },
    state: {
      timeValues: { hours, minutes, seconds },
    },
  } = useTimer({
    startTimeMin: initial.minutes,
    startTimeSec: initial.seconds,
    onInitStart() {
      setTimerStatus('ticking')
    },
    onStartAfterPause() {
      setTimerStatus('ticking')
    },
    onPause() {
      setTimerStatus('paused')
    },
    onStop() {
      setTimerStatus('stopped')
    },
    onEnd() {
      setTimerStatus('ended')
    },
  })

  return (
    <Flex
      className={cn(
        'w-full h-9 bg-dark rounded-medium',
        timerStatus !== 'stopped' && 'pr-2'
      )}
      justify="center"
      align="center"
      {...props}
    >
      <Button
        className={cn(
          'text-gray-accent h-full cursor-default space-x-1',
          timerStatus === 'stopped' &&
            'hover:text-white/80 hover:bg-dark/80 cursor-pointer'
        )}
        startContent={<Icons.Timer className="text-gray-light" size="sm" />}
        onClick={timerStatus === 'stopped' ? startTimer : undefined}
      >
        {timerStatus === 'stopped' ? (
          'Запустить таймер'
        ) : (
          <NumberFlowGroup>
            <Flex
              className="font-medium font-azeret-mono"
              style={{
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.5px',
                fontFamily: 'Azeret Mono',
              }}
            >
              <NumberFlow
                willChange
                trend={0}
                value={hours}
                digits={{ 1: { max: 5 } }}
                format={{ minimumIntegerDigits: 2 }}
              />
              <NumberFlow
                willChange
                trend={0}
                prefix=":"
                value={minutes}
                digits={{ 1: { max: 5 } }}
                format={{ minimumIntegerDigits: 2 }}
              />
              <NumberFlow
                willChange
                trend={0}
                prefix=":"
                value={seconds}
                digits={{ 1: { max: 5 } }}
                format={{ minimumIntegerDigits: 2 }}
              />
            </Flex>
          </NumberFlowGroup>
        )}
      </Button>

      {timerStatus !== 'stopped' && (
        <TimerControls
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Flex ref={controlsElRef} className="text-gray-light" align="center">
            <Button
              className="hover:text-gray-accent px-0.5 "
              variant="ghost"
              size="sm"
              isIconOnly
              icon={
                timerStatus === 'ticking' ? (
                  <Icons.Pause width={14} height={14} />
                ) : (
                  <Icons.Play width={14} height={14} />
                )
              }
              onClick={timerStatus === 'ticking' ? pauseTimer : startTimer}
            />
            <Button
              className="hover:text-gray-accent px-0.5"
              variant="ghost"
              size="sm"
              isIconOnly
              onClick={stopTimer}
              icon={<Icons.Stop width={14} height={14} />}
            />
            <Button
              className="hover:text-gray-accent px-0.5 "
              variant="ghost"
              size="sm"
              isIconOnly
              icon={<Icons.Plus strokeWidth={1} />}
              onClick={() => addTime(addedTimeValue * 1000)}
            />
            <Button
              className="hover:text-gray-accent px-0.5"
              variant="ghost"
              size="sm"
              isIconOnly
              onClick={() => decreaseTime(decreaseTimeValue * 1000)}
              icon={<Icons.Minus strokeWidth={1} />}
            />
          </Flex>
        </TimerControls>
      )}
    </Flex>
  )
}

export { TimerButton }
