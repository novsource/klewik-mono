import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

type LocalStorageOptions<T extends unknown = unknown> = {
  value?: T
  serializer?: (value: T) => string
  deserializer?: (value: string) => T
}

const dispatchStorageEvent = (params: Partial<StorageEvent>) => {
  window.dispatchEvent(new StorageEvent('storage', params))
}

const setItemToLocalStorage = (
  storage: Storage,
  key: string,
  value: string
) => {
  const oldValue = localStorage.getItem(key)
  localStorage.setItem(key, value)

  dispatchStorageEvent({ key, storageArea: storage, newValue: value, oldValue })
}

const getItemFromLocalStorage = (storage: Storage, key: string) => {
  const rawData = storage.getItem(key)

  if (!rawData) {
    return undefined
  }

  return rawData
}

const removeItemFromLocalStorage = (storage: Storage, key: string) => {
  const oldValue = localStorage.getItem(key)

  localStorage.removeItem(key)
  dispatchStorageEvent({ key, storageArea: storage, newValue: null, oldValue })
}

const localStorageSubscribe = (callback: () => void) => {
  window.addEventListener('storage', callback)

  return () => {
    window.removeEventListener('storage', callback)
  }
}

const useLocalStorage = <T>(key: string, options?: LocalStorageOptions<T>) => {
  const localStorage = window.localStorage
  const initialValue = options?.value ?? undefined

  const serializer = useCallback(
    (value: T) => {
      try {
        if (!options?.serializer) return JSON.stringify(value)

        return options.serializer(value)
      } catch (err) {
        return ''
      }
    },
    [options?.serializer]
  )

  const deserializer = (raw: string) => {
    try {
      if (!options?.deserializer) return JSON.parse(raw)

      return options.deserializer(raw)
    } catch (err) {
      return undefined
    }
  }

  const getSnapshot = () => getItemFromLocalStorage(localStorage, key)

  const set = (value: T) =>
    setItemToLocalStorage(localStorage, key, serializer(value))
  const remove = () => removeItemFromLocalStorage(localStorage, key)

  const store = useSyncExternalStore(localStorageSubscribe, getSnapshot)

  useEffect(() => {
    const value = getItemFromLocalStorage(localStorage, key)

    if (initialValue !== undefined && value === undefined) {
      setItemToLocalStorage(localStorage, key, serializer(initialValue))
    }
  }, [key])

  return {
    value: store ? deserializer(store) : undefined,
    set,
    remove,
  }
}

export { useLocalStorage }
