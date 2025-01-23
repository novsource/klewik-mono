import { useSyncExternalStore } from 'react'

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

const getItemFromLocalStorage = <T>(
  key: string,
  deserializer: NonNullable<LocalStorageOptions<T>['deserializer']>
) => {
  const rawData = localStorage.getItem(key)

  if (!rawData) {
    return null
  }

  return deserializer(rawData)
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
  const serializer = (value: T) => {
    try {
      if (!options?.serializer) return JSON.stringify(value)

      return options.serializer(value)
    } catch (err) {
      return ''
    }
  }

  const deserializer = (raw: string) => {
    try {
      if (!options?.deserializer) return JSON.parse(raw)

      return options.deserializer(raw)
    } catch (err) {
      return undefined
    }
  }

  const getSnapshot = () => getItemFromLocalStorage(key, deserializer)
  const set = (value: T) =>
    setItemToLocalStorage(window.localStorage, key, serializer(value))
  const remove = () => removeItemFromLocalStorage(window.localStorage, key)

  const store = useSyncExternalStore<string>(localStorageSubscribe, getSnapshot)

  return {
    value: store ? deserializer(store) : undefined,
    set,
    get: getSnapshot,
    remove,
  }
}

export { useLocalStorage }
