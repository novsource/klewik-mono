import { useCallback, useRef, useState, useSyncExternalStore } from 'react'

type MediaQuery = string

export type UseDetectDeviceByMediaQueries<Device extends string> = Record<Device, MediaQuery>

type BooleanKey<Value extends string> = `is${Capitalize<Value>}`

export type UseDetectDeviceByMediaQueriesReturn<Device extends string> = Record<BooleanKey<Device>, boolean>

const getBooleanKey = <T extends string>(value: T): BooleanKey<T> => {
  return `is${value[0].toUpperCase()}${value.slice(1, value.length).toLowerCase()}` as BooleanKey<T>
}

const getDefaultDeviceMediaQueriesResult
  = <Device extends string>(mediaQueries: UseDetectDeviceByMediaQueries<Device>): UseDetectDeviceByMediaQueriesReturn<Device> => {
    const devices = Object.keys(mediaQueries) as Array<keyof UseDetectDeviceByMediaQueries<Device>>

    return devices.reduce((acc, device) => {
      const booleanKey = getBooleanKey(device) as BooleanKey<typeof device>

      acc[booleanKey] = false

      return acc
    }, {} as UseDetectDeviceByMediaQueriesReturn<Device>)
  }

export const useDetectDeviceByMedia
  = <Device extends string>
  (queries: UseDetectDeviceByMediaQueries<Device>): UseDetectDeviceByMediaQueriesReturn<Device> => {
    const defaultDeviceMediaQueriesRef = useRef(getDefaultDeviceMediaQueriesResult(queries))

    const [mediaQueriesResults, setMediaQueriesResults] = useState(() => {
      const devices = Object.keys(queries) as Array<keyof UseDetectDeviceByMediaQueries<Device>>

      return devices.reduce((acc, device) => {
        const query = queries[device]

        const matchMedia = window.matchMedia(query)

        const booleanDeviceKey = getBooleanKey(device)

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

          const booleanDeviceKey = getBooleanKey(device)

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
      [queries],
    )

    const getSnapshot = () => mediaQueriesResults
    const getServerSnapshot = () => defaultDeviceMediaQueriesRef.current

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  }
