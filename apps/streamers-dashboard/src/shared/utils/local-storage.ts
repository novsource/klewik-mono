const loadFromLocalStorage = (
  key: string,
  deserializer?: (raw: string) => unknown
) => {
  try {
    const storedData = localStorage.getItem(key)

    return storedData
      ? deserializer
        ? deserializer(storedData)
        : JSON.parse(storedData)
      : undefined
  } catch {
    return undefined
  }
}

const setToLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

const deleteFromLocalStorage = (key: string) => {
  localStorage.removeItem(key)
}

export { loadFromLocalStorage, setToLocalStorage, deleteFromLocalStorage }
