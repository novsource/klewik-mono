import { useMemo, useRef } from 'react'

export const useLocalSearchFilter = <T>(query: string, data: T[], filterFn: (query: string, item: T) => boolean): T[] => {
  const filterFnRef = useRef(filterFn)

  filterFnRef.current = filterFn

  const filteredData = useMemo(() => {
    const filter = filterFnRef.current
    return data.filter(item => filter(query, item))
  }, [data, query])

  return filteredData
}
