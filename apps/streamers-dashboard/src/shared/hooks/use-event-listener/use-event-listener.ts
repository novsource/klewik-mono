import type { RefObject } from 'react'
import { useEffect } from 'react'

function useEventListener<
  Target extends Window,
  Event extends keyof WindowEventMap,
>(
  target: Target,
  type: Event,
  listener: (this: Target, event: WindowEventMap[Event]) => void
): void
function useEventListener<
  Target extends Document,
  Event extends keyof DocumentEventMap,
>(
  target: Target,
  type: Event,
  listener: (this: Target, event: DocumentEventMap[Event]) => void
): void
function useEventListener<
  Target extends RefObject<Element>,
  Event extends keyof HTMLElementEventMap,
>(
  target: Target,
  type: Event,
  listener: (this: Target, event: HTMLElementEventMap[Event]) => void
): void
function useEventListener<Target extends Element | RefObject<Element>>(
  target: Target,
  type: keyof Event,
  listener: (this: Target, event: Event) => void,
): void {
  useEffect(() => {
    const element
      = target instanceof Window || target instanceof Document
        ? target
        : 'current' in target
          ? target.current
          : null

    if (!element)
      return

    element.addEventListener(type, listener)

    return () => {
      element.removeEventListener(type, listener)
    }
  }, [target, type])
}

export { useEventListener }
