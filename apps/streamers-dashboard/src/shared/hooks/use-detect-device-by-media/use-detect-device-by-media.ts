import { useCallback, useRef, useState, useSyncExternalStore } from 'react'

type MediaQuery = string

export type UseDetectDeviceByMediaQueries<Device extends string = string> = Record<Device, MediaQuery>
export type UseDetectDeviceByMediaQueriesOptions<BooleanPrefix extends string | undefined = undefined> = {
  booleanPrefix?: BooleanPrefix
}

type BooleanKey<Value extends string = string, BooleanPrefix extends string | undefined = undefined>
= BooleanPrefix extends string ? `${BooleanPrefix}${Capitalize<Value>}` : Value

export type UseDetectDeviceByMediaQueriesReturn<Device extends string, BooleanPrefix extends string | undefined = undefined>
= Record<BooleanKey<Device, BooleanPrefix>, boolean>

const getBooleanKey = <T extends string, K extends string | undefined = undefined>
(value: T,
  booleanPrefix?: K,
): BooleanKey<T, K> => {
  const key = `${value[0].toLowerCase()}${value.slice(1, value.length).toUpperCase()}` as BooleanKey<T, K>

  if (!booleanPrefix) {
    return key
  }

  return `${booleanPrefix}${key}` as BooleanKey<T, K>
}

const getDefaultDeviceMediaQueriesResult
  = <Device extends string, BooleanPrefix extends string | undefined = undefined>(
    mediaQueries: UseDetectDeviceByMediaQueries<Device>,
    options?: UseDetectDeviceByMediaQueriesOptions<BooleanPrefix>,
  ): UseDetectDeviceByMediaQueriesReturn<Device, BooleanPrefix> => {
    const devices = Object.keys(mediaQueries) as Array<keyof UseDetectDeviceByMediaQueries<Device>>

    return devices.reduce((acc, device) => {
      const booleanKey = getBooleanKey(device, options?.booleanPrefix)

      acc[booleanKey] = false

      return acc
    }, {} as UseDetectDeviceByMediaQueriesReturn<Device, BooleanPrefix>)
  }

export const useDetectDeviceByMedia
  = <Device extends string, BooleanPrefix extends string | undefined = undefined>
  (queries: UseDetectDeviceByMediaQueries<Device>,
    options?: UseDetectDeviceByMediaQueriesOptions<BooleanPrefix>,
  ): UseDetectDeviceByMediaQueriesReturn<Device, BooleanPrefix> => {
    const defaultDeviceMediaQueriesRef = useRef(getDefaultDeviceMediaQueriesResult(queries, options))

    const [mediaQueriesResults, setMediaQueriesResults] = useState(() => {
      const devices = Object.keys(queries) as Array<keyof UseDetectDeviceByMediaQueries<Device>>

      return devices.reduce((acc, device) => {
        const query = queries[device]

        const matchMedia = window.matchMedia(query)

        const booleanDeviceKey = getBooleanKey(device, options?.booleanPrefix)

        acc[booleanDeviceKey] = matchMedia.matches

        return acc
      }, defaultDeviceMediaQueriesRef.current)
    })

    const subscribe = useCallback(
      (callback: () => void) => {
        const devices = Object.keys(queries) as Array<keyof UseDetectDeviceByMediaQueries<Device>>

        const matchMedias: Array<[MediaQueryList, (event: MediaQueryListEvent) => void]> = []

        devices.forEach((device) => {
          const query = queries[device]

          const matchMedia = window.matchMedia(query)

          const booleanDeviceKey = getBooleanKey(device, options?.booleanPrefix)

          const changeHandler = (event: MediaQueryListEvent) => {
            callback()
            setMediaQueriesResults(curr => ({ ...curr, [booleanDeviceKey]: event.matches }))
          }

          matchMedias.push([matchMedia, changeHandler])

          matchMedia.addEventListener('change', changeHandler)
        })

        return () => {
          for (const [media, callback] of matchMedias) {
            media.removeEventListener('change', callback)
          }
        }
      },
      [queries, options?.booleanPrefix],
    )

    const getSnapshot = () => mediaQueriesResults
    const getServerSnapshot = () => defaultDeviceMediaQueriesRef.current

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  }
