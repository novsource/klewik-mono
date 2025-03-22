import { ComponentProps, useState } from 'react'

import { useTimer } from '~shared/hooks/use-timer'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

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
    state: { time },
  } = useTimer({
    startTimeMs: 20000,
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
      className="transition-all bg-dark w-full px-2 gap-x-2 rounded-md text-gray-accent h-9"
      justify="center"
      align="center"
      {...props}
    >
      <Icons.Timer className="text-gray-light" size="sm" />
      <Typography
        className="text-md leading-5 font-medium font-golos-f"
        tag="span"
      >
        {timerStatus === 'stopped' ? 'Таймер' : time}
      </Typography>
      <Flex className="text-gray-light gap-x-0.5" align="center">
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
        {timerStatus !== 'stopped' && (
          <>
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
              icon={<Icons.Plus />}
              onClick={() => addTime()}
            />
            <Button
              className="hover:text-gray-accent px-0.5"
              variant="ghost"
              size="sm"
              isIconOnly
              onClick={() => decreaseTime()}
              icon={<Icons.Minus />}
            />
          </>
        )}
      </Flex>
    </Flex>
  )
}

export { TimerButton }
