import { useCallback, useEffect, useState } from 'react'

import type { UseTimerOptions, UseTimerReturn } from '~shared/hooks'
import { useTimer as useReactUseTimer } from '~shared/hooks'

import { chain } from '~shared/utils'

export type UseAuctionTimerOptions = UseTimerOptions & {
  initTime?: number
  onStart?: () => void
  onPause?: (currentValue: number) => void
}

type TimerStatus = 'ticking' | 'paused' | 'stopped'

export type UseActionTimerReturn = UseTimerReturn & {
  status: TimerStatus
  stop: () => void
}

const DEFAULT_TIMER_VALUE = 600

export const useTimer = (options?: UseAuctionTimerOptions): UseActionTimerReturn => {
  const initialTime = options?.initTime ?? DEFAULT_TIMER_VALUE

  const [status, setStatus] = useState<TimerStatus>('stopped')

  const onExpireHandler = useCallback(() => {
    if (!options?.onExpire) {
      return () => setStatus('stopped')
    }

    return chain(() => setStatus('stopped'), options.onExpire)
  }, [options?.onExpire])

  const { toggle, pause, resume, ...timer } = useReactUseTimer(
    initialTime,
    {
      onStart: () => setStatus('ticking'),
      onTick: options?.onTick,
      onExpire: onExpireHandler,
      immediately: false,
    },
  )

  useEffect(() => {
    const isTimerPaused = status === 'paused'

    if (isTimerPaused && options?.onPause)
      options.onPause(timer.count)
  }, [status, options, timer.count])

  const toggleTimer = chain(toggle, () => setStatus((curr) => {
    if (curr === 'ticking') {
      return 'paused'
    }

    return 'ticking'
  }))

  const pauseTimer = chain(pause, () => setStatus('paused'))
  const resumeTimer = chain(resume, () => setStatus('ticking'))

  const stopTimer = chain(() => {
    pause()
    timer.restart(initialTime, false)
  }, () => setStatus('stopped'))

  return {
    status,
    toggle: toggleTimer,
    resume: resumeTimer,
    pause: pauseTimer,
    stop: stopTimer,
    ...timer,
  }
}
