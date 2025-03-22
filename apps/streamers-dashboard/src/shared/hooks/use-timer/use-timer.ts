import { useCallback, useRef, useState } from 'react'

type TimerControl = {
  start: () => void
  pause: () => void
  stop: () => void
  addTime: (value?: number) => void
  decreaseTime: (value?: number) => void
}

type TimerHookCallbacks = Partial<{
  onTick(time: string): void
  onInitStart(time: string): void
  onStartAfterPause(time: string): void
  onPause(time: string): void
  onStop(time: string): void
  onEnd(): void
}>

type TimerHookProperties = Partial<{
  startTimeMs: number
}>

type TimerHookProps = TimerHookCallbacks & TimerHookProperties

type TimerHookReturn = {
  control: TimerControl
  state: {
    time: string
  }
}

const convertDiffToTimerValue = (diff: number) => {
  let diffAsSeconds = diff / 1000

  const hours = Math.floor(diffAsSeconds / 3600)

  diffAsSeconds = diffAsSeconds % 3600

  const minutes = Math.floor(diffAsSeconds / 60)
  const seconds = Math.floor(diffAsSeconds % 60)

  return [hours, minutes, seconds].reduce((timeStr, curr, index) => {
    if (curr >= 10) timeStr += curr
    else timeStr += '0' + curr

    if (index !== 2) timeStr += ':'

    return timeStr
  }, '')
}

const useTimer = (props: TimerHookProps): TimerHookReturn => {
  const {
    onTick,
    onStartAfterPause,
    onEnd,
    onInitStart,
    onStop,
    onPause,
    startTimeMs,
  } = props

  const defaultTimerValueRef = useRef<number>(startTimeMs ?? 10000)

  const [time, setTime] = useState<string>(() => {
    return convertDiffToTimerValue(Date.now() + defaultTimerValueRef.current)
  })

  const isStarted = useRef<boolean>(false)
  const isOnPause = useRef<boolean>(false)

  const currentTickID = useRef<number>(0)

  const initTimeRef = useRef<number>(Date.now())
  const targetTimeRef = useRef<number>(
    Date.now() + defaultTimerValueRef.current
  )
  const stoppedTimeRef = useRef<number>(0)

  const tick = useCallback(() => {
    const currTime = targetTimeRef.current - initTimeRef.current

    if (currTime < 0) {
      cancelAnimationFrame(currentTickID.current)

      isStarted.current = false
      initTimeRef.current = Date.now()
      targetTimeRef.current = Date.now() + defaultTimerValueRef.current

      setTime(convertDiffToTimerValue(defaultTimerValueRef.current))

      onEnd && onEnd()

      return
    }

    currentTickID.current = requestAnimationFrame(tick)
    initTimeRef.current = Date.now()

    setTime(convertDiffToTimerValue(currTime))

    onTick && onTick(convertDiffToTimerValue(currTime))
  }, [defaultTimerValueRef.current])

  const start = useCallback(() => {
    if (isOnPause.current) {
      targetTimeRef.current += Date.now() - stoppedTimeRef.current

      stoppedTimeRef.current = 0
      isOnPause.current = false

      onStartAfterPause && onStartAfterPause(time)

      tick()
    }

    if (!isStarted.current) {
      onInitStart && onInitStart(time)

      isStarted.current = true

      // Time changed immedetiatly so we need to add 1 second to prevent it
      targetTimeRef.current = Date.now() + defaultTimerValueRef.current + 1000

      tick()
    }
  }, [defaultTimerValueRef.current])

  const pause = useCallback(() => {
    if (!isOnPause.current) {
      stoppedTimeRef.current = Date.now()

      isOnPause.current = true

      cancelAnimationFrame(currentTickID.current)

      onPause && onPause(time)
    }
  }, [])

  const stop = useCallback(() => {
    const tickId = currentTickID.current
    cancelAnimationFrame(tickId)

    stoppedTimeRef.current = 0
    currentTickID.current = 0

    isStarted.current = false
    isOnPause.current = false

    const initTime = convertDiffToTimerValue(defaultTimerValueRef.current)

    setTime(initTime)

    onStop && onStop(initTime)
  }, [defaultTimerValueRef.current])

  const addTime = useCallback(
    (value: number = 1000) => {
      const tickId = currentTickID.current
      cancelAnimationFrame(tickId)

      currentTickID.current = 0

      targetTimeRef.current += value

      setTime(
        convertDiffToTimerValue(targetTimeRef.current - initTimeRef.current)
      )

      if (!isOnPause.current) tick()
    },
    [targetTimeRef.current]
  )

  const decreaseTime = useCallback(
    (value: number = 1000) => {
      if (targetTimeRef.current - value - initTimeRef.current >= 0) {
        const tickId = currentTickID.current
        cancelAnimationFrame(tickId)

        currentTickID.current = 0

        targetTimeRef.current -= value

        setTime(
          convertDiffToTimerValue(targetTimeRef.current - initTimeRef.current)
        )
      }

      if (!isOnPause.current) tick()
    },
    [targetTimeRef.current]
  )

  return {
    control: {
      addTime,
      decreaseTime,
      start,
      pause,
      stop,
    },
    state: {
      time,
    },
  }
}

export { useTimer }
