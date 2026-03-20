import { useMemo } from 'react'

export type VirtualizedItem = {
  id: string
  index: number
}

export const useVirtualizedItems = (data: unknown[]) => {
  const virtualizedItems = useMemo<VirtualizedItem[]>(() => {
    return Array
      .from({ length: data.length })
      .map((_, index) => ({ id: `virtual-item-${index}`, index }))
  }, [data])

  return virtualizedItems
}
