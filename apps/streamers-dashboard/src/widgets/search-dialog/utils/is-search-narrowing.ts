export const isSearchNarrowing = (prev: string, current: string) => {
  if (!prev)
    return false

  return prev.length < current.length && current.includes(prev)
}
