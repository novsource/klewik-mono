import type { StateRef } from '../use-ref-state/use-ref-state'

import { useEffect, useRef, useState } from 'react'

import { isTarget } from '~shared/utils/react'
import type { HookTarget } from '~shared/utils/react'

import { useRefState } from '../use-ref-state/use-ref-state'

/** The resize observer options type */
export type UseResizeObserverOptions = {
  /** The enabled state */
  enabled?: boolean
  /** The resize observer callback */
  onChange?: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void
} & ResizeObserverOptions

/** The resize observer return type */
export type UseResizeObserverReturn = {
  /** The resize observer entries */
  entries: ResizeObserverEntry[]
}

export type UseResizeObserver = {
  (target: HookTarget, options?: UseResizeObserverOptions): UseResizeObserverReturn

  <Target extends Element>(
    options?: UseResizeObserverOptions,
    target?: never
  ): UseResizeObserverReturn & { ref: StateRef<Target> }
}

/**
 *  @name useResizeObserver
 *  @description - Hook that gives you resize observer state
 *  @category Sensors
 *  @usage low
 *
 *  @browserapi ResizeObserver https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 *
 *  @overload
 *  @template Target The target element
 *  @param {boolean} [options.enabled] The IntersectionObserver options
 *  @param {boolean} [options.box] The IntersectionObserver options
 *  @param {(entries: ResizeObserverEntry[], observer: ResizeObserver) => void} [options.onChange] The callback to execute when resize is detected
 *  @returns {UseResizeObserverReturn & { ref: StateRef<Target> }} An object containing the resize observer state
 *
 *  @example
 *  const { ref, entries } = useResizeObserver();
 *
 *  @overload
 *  @template Target The target element
 *  @param {HookTarget} target The target element to observe
 *  @param {boolean} [options.enabled] The IntersectionObserver options
 *  @param {boolean} [options.box] The IntersectionObserver options
 *  @param {(entries: ResizeObserverEntry[], observer: ResizeObserver) => void} [options.onChange] The callback to execute when resize is detected
 *  @returns {UseResizeObserverReturn} An object containing the resize observer state
 *
 *  @example
 *  const { entries } = useResizeObserver(ref);
 */
export const useResizeObserver = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined
  const options = (target ? params[1] : params[0]) as UseResizeObserverOptions | undefined
  const enabled = options?.enabled ?? true

  const [entries, setEntries] = useState<ResizeObserverEntry[]>([])

  const internalRef = useRefState<Element>()
  const internalOnChangeRef = useRef<UseResizeObserverOptions['onChange']>(options?.onChange)
  internalOnChangeRef.current = options?.onChange

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state))
      return

    const element = target ? isTarget.getElement(target) : internalRef.current
    if (!element)
      return

    const observer = new ResizeObserver((entries) => {
      setEntries(entries)
      internalOnChangeRef.current?.(entries, observer)
    })
    observer.observe(element as Element, options)

    return () => {
      observer.disconnect()
    }
  }, [target, internalRef.state, options?.box, enabled])

  if (target)
    return { entries }
  return {
    ref: internalRef,
    entries,
  }
}) as UseResizeObserver
