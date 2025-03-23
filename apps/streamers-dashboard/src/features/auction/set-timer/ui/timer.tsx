import { ComponentProps, useState } from 'react'

import NumberFlow, { NumberFlowGroup } from '@number-flow/react'
import { motion } from 'framer-motion'

import { useTimer } from '~shared/hooks/use-timer'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

type TimerButtonProps = ComponentProps<'div'> & {
  defaultTimerText?: string
}

type TimerStatus = 'stopped' | 'paused' | 'ticking' | 'ended'

const TimerButton = ({ defaultTimerText, ...props }: TimerButtonProps) => {
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('stopped')

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
    startTimeMin: 10,
    startTimeSec: 60,
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
              style={{
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <NumberFlow
                value={hours}
                digits={{ 1: { max: 5 } }}
                format={{ minimumIntegerDigits: 2 }}
              />
              <NumberFlow
                prefix=":"
                value={minutes}
                digits={{ 1: { max: 5 } }}
                format={{ minimumIntegerDigits: 2 }}
              />
              <NumberFlow
                prefix=":"
                value={seconds}
                digits={{ 1: { max: 5 } }}
                format={{ minimumIntegerDigits: 2 }}
              />
            </Flex>
          </NumberFlowGroup>
        )}
      </Button>
      <motion.div className="flex items-center text-gray-light gap-x-0.5">
        {timerStatus !== 'stopped' && (
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              className="hover:text-gray-accent px-0.5 "
              variant="ghost"
              size="sm"
              isIconOnly
              icon={
                timerStatus === 'ticking' ? (
                  <Icons.Pause size="xs" />
                ) : (
                  <Icons.Play size="xs" />
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
              icon={<Icons.Stop size="xs" />}
            />
            <Button
              className="hover:text-gray-accent px-0.5 "
              variant="ghost"
              size="sm"
              isIconOnly
              icon={<Icons.Plus strokeWidth={1} />}
              onClick={() => addTime()}
            />
            <Button
              className="hover:text-gray-accent px-0.5"
              variant="ghost"
              size="sm"
              isIconOnly
              onClick={() => decreaseTime()}
              icon={<Icons.Minus strokeWidth={1} />}
            />
          </motion.div>
        )}
      </motion.div>
    </Flex>
  )
}

export { TimerButton }
