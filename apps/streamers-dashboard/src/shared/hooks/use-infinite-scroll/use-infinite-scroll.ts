import type { StateRef } from '../use-ref-state/use-ref-state'

import { useEffect, useRef, useState } from 'react'

import type { HookTarget } from '~shared/utils'
import { getElement, isTarget } from '~shared/utils'

import { useRefState } from '../use-ref-state/use-ref-state'

/** The use infinite scroll options type */
export type UseInfiniteScrollOptions = {
  /** The direction to trigger the callback */
  direction?: 'bottom' | 'left' | 'right' | 'top'
  /** The distance in pixels to trigger the callback */
  distance?: number
}

export type UseInfiniteScroll = {
  (
    target: HookTarget,
    callback: (event: Event) => void,
    options?: UseInfiniteScrollOptions
  ): boolean

  <Target extends Window | Element>(
    callback: (event: Event) => void,
    options?: UseInfiniteScrollOptions,
    target?: never
  ): {
    ref: StateRef<Target>
    loading: boolean
  }
}

/**
 * @name useInfiniteScroll
 * @description - Hook that defines the logic for infinite scroll
 * @category Sensors
 * @usage medium
 *
 * @overload
 * @template Target The target element
 * @param {(event: Event) => void} callback The callback to execute when a click outside the target is detected
 * @param {number} [options.distance] The distance in pixels to trigger the callback
 * @param {string} [options.direction] The direction to trigger the callback
 * @returns {{ ref: StateRef<Target>, loading: boolean }} An object containing the ref and loading
 *
 * @example
 * const { ref, loading } = useInfiniteScroll(() => console.log('infinite scroll'));
 *
 * @overload
 * @param {HookTarget} target The target element to detect infinite scroll for
 * @param {(event: Event) => void} callback The callback to execute when a click outside the target is detected
 * @param {number} [options.distance] The distance in pixels to trigger the callback
 * @param {string} [options.direction] The direction to trigger the callback
 * @returns {boolean} A loading indicator of the infinite scroll
 *
 * @example
 * const loading = useInfiniteScroll(ref, () => console.log('infinite scroll'));
 */
export const useInfiniteScroll = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined
  const callback = (target ? params[1] : params[0]) as (event: Event) => void
  const options = (target ? params[2] : params[1]) as UseInfiniteScrollOptions | undefined

  const direction = options?.direction ?? 'bottom'
  const distance = options?.distance ?? 10

  const [loading, setIsLoading] = useState(false)

  const internalRef = useRefState<Window | Element>()
  const internalCallbackRef = useRef(callback)
  internalCallbackRef.current = callback
  const internalLoadingRef = useRef(loading)
  internalLoadingRef.current = loading

  useEffect(() => {
    if (!target && !internalRef.state)
      return
    const element = (target ? getElement(target) : internalRef.current)

    const isTargetWindow = element instanceof Window

    if (!element)
      return

    const onLoadMore = async (event: Event) => {
      if (internalLoadingRef.current)
        return

      const { clientHeight, scrollHeight, scrollTop, clientWidth, scrollWidth, scrollLeft }
        = isTargetWindow ? document.documentElement : event.target as Element

      const scrollBottom = scrollHeight - (scrollTop + clientHeight)
      const scrollRight = scrollWidth - (scrollLeft + clientWidth)

      const distances = {
        bottom: scrollBottom,
        top: scrollTop,
        right: scrollRight,
        left: scrollLeft,
      }

      if (distances[direction] <= distance) {
        setIsLoading(true)
        await internalCallbackRef.current(event)
        setIsLoading(false)
      }
    }

    element.addEventListener('scroll', onLoadMore)

    return () => {
      element.removeEventListener('scroll', onLoadMore)
    }
  }, [target, internalRef.state, direction, distance])

  if (target)
    return loading
  return {
    ref: internalRef,
    loading,
  }
}) as UseInfiniteScroll
