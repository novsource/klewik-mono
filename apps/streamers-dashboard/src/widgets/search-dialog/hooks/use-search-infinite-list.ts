import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { SearchQueryArgs } from '~entities/auction/api'
import { useLazySearchQuery } from '~entities/auction/api'
import { auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type { ProcessedDonation } from '~entities/donation/model'

import type { UseInfiniteListOptions, UseInfiniteListReturn, UseInfiniteListServiceFunction } from '~shared/hooks'
import { useInfiniteList, useSearch, useUnmount } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { isStringEmpty } from '~shared/utils'

import { isSearchNarrowing } from '../utils/is-search-narrowing'

type UseSearchInfiniteListOptions<T> = Omit<UseInfiniteListOptions<T>, 'queryOnEnd'> & {
  debounceTime?: number
  onError?: () => void
}

type SearchDomainData = {
  slots: AuctionSlot
  donations: ProcessedDonation
}

type UseSearchInfiniteListReturnValue<T> = {
  state: UseInfiniteListReturn<T>['state'] & {
    filteredData: T[]
    isLoading: boolean
  }
  meta: {
    listRef: RefObject<HTMLDivElement>
  }
}

export const useSearchInfiniteList = <SearchDomain extends keyof SearchDomainData>(
  searchValue: string,
  domain: SearchDomain,
  data: Array<SearchDomainData[SearchDomain]>,
  options: UseSearchInfiniteListOptions<SearchDomainData[SearchDomain]>,
): UseSearchInfiniteListReturnValue<SearchDomainData[SearchDomain]> => {
  const {
    debounceTime = 300,
    distance,
    ...infiniteListOptions
  } = options

  const [hasMoreData, setHasMoreData] = useState(true)

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const normalizedSearchValue = searchValue.trim().toLowerCase()

  const localFilteredData = useLocalSearchFilter(normalizedSearchValue, data, domain)

  const requestIdRef = useRef(0)
  const lastDataItemIdRef = useRef<Maybe<number>>(localFilteredData.at(-1)?.id)
  const pendingSearchValueRef = useRef('')

  const searchInfiniteListQuery = useSearchInfiniteListQuery<SearchDomainData[SearchDomain]>({
    auctionUUID,
    domain,
    query: searchValue,
    after: lastDataItemIdRef.current,
    limit: 15,
  })

  const infiniteList = useInfiniteList<SearchDomainData[SearchDomain]>(searchInfiniteListQuery.query, infiniteListOptions)

  const search = useSearch({
    initialValue: searchValue,
    debounceTime,
    onCancelSearch: () => {
      searchInfiniteListQuery.abort()
    },
    onSearch: async () => {
      try {
        const requestId = ++requestIdRef.current

        const response = await searchInfiniteListQuery.query()

        if (requestIdRef.current !== requestId)
          return

        if (!response) {
          setHasMoreData(false)
          return
        }

        const listLimit = infiniteListOptions.limit ?? 15
        const isNoMoreData = response.list.length < listLimit

        if (isNoMoreData) {
          setHasMoreData(false)
        }

        lastDataItemIdRef.current = response.list.at(-1)?.id
      }
      catch (error) {
        options.onError?.()

        console.error(error)
      }
    },
  })

  const shouldStartSearch = useCallback(() => {
    const isSameSearch = searchInfiniteListQuery.lastUsedSearchValue === searchValue
    const isEmpty = isStringEmpty(searchValue)
    const isAlreadyLoading = search.state.isDebouncing || searchInfiniteListQuery.queryState.isLoading
    const isNarrowingWithoutMoreData
      = isSearchNarrowing(searchInfiniteListQuery.lastUsedSearchValue, searchValue) && !hasMoreData

    const isEnoughLocalData
      = !hasMoreData && localFilteredData.length >= infiniteList.state.limit

    const isShouldNotStartSearch = isSameSearch
      || isEmpty
      || isAlreadyLoading
      || isNarrowingWithoutMoreData
      || isEnoughLocalData

    return !isShouldNotStartSearch
  }, [
    searchValue,
    search.state.isDebouncing,
    hasMoreData,
    searchInfiniteListQuery.queryState.isLoading,
    searchInfiniteListQuery.lastUsedSearchValue,
    localFilteredData.length,
    infiniteList.state.limit,
  ])

  const shouldCancelQuery = useCallback(() => {
    const isSearchValueChanged = pendingSearchValueRef.current !== searchValue
    const isShouldCancelSearchQuery = search.state.isDebouncing && isSearchValueChanged

    return isShouldCancelSearchQuery
  }, [search.state.isDebouncing, searchValue])

  useEffect(() => {
    if (shouldStartSearch()) {
      search.actions.start()
      pendingSearchValueRef.current = searchValue

      return
    }

    if (shouldCancelQuery()) {
      search.actions.cancel()
    }
  }, [search.actions, searchValue, shouldStartSearch, shouldCancelQuery])

  useEffect(() => {
    const dataSource = infiniteList.state.value.length === 0
      ? localFilteredData
      : infiniteList.state.value

    lastDataItemIdRef.current = dataSource.at(-1)?.id
  }, [localFilteredData, infiniteList.state.value])

  const resetAll = useCallback(() => {
    search.actions.cancel()

    lastDataItemIdRef.current = undefined
    pendingSearchValueRef.current = ''

    infiniteList.functions.reset()

    setHasMoreData(true)
  }, [infiniteList.functions.reset, search.actions])

  useEffect(() => {
    const isSearchValueNotEmpty = !isStringEmpty(searchValue)

    if (!isSearchValueNotEmpty && !isStringEmpty(pendingSearchValueRef.current)) {
      resetAll()
    }
  }, [searchValue, resetAll])

  useUnmount(() => {
    resetAll()
  })

  return {
    state: {
      ...infiniteList.state,
      isPending: search.state.isDebouncing,
      isLoading: searchInfiniteListQuery.queryState.isLoading,
      filteredData: localFilteredData,
    },
    meta: {
      listRef: infiniteList.ref,
    },
  }
}

function useSearchInfiniteListQuery<T>(options: SearchQueryArgs) {
  const [lazySearchQuery, queryState] = useLazySearchQuery()

  const optionsRef = useRef(options)
  optionsRef.current = options

  const queryPromiseRef = useRef<NullablePossible<ReturnType<typeof lazySearchQuery>>>(null)

  const searchQuery: UseInfiniteListServiceFunction<T> = async () => {
    try {
      queryPromiseRef.current = lazySearchQuery(optionsRef.current)

      const response = await queryPromiseRef.current
      const responseData = response.data as Maybe<T[]>

      const isResponseDataEmpty = !responseData || !responseData.length

      if (isResponseDataEmpty) {
        return { list: [] }
      }

      return { list: responseData }
    }
    catch (error) {
      if (error instanceof Error)
        throw error
    }
    finally {
      queryPromiseRef.current = null
    }
  }

  const abort = () => {
    queryPromiseRef.current?.abort()
  }

  const lastUsedSearchValue = queryState.originalArgs?.query ?? ''

  return {
    query: searchQuery,
    queryState,
    lastUsedSearchValue,
    abort,
  }
}

type LocalSearchFilterFn = (searchValue: string, item: SearchDomainData[keyof SearchDomainData]) => boolean

const localSearchFilterFn = {
  slots: (query: string, item: SearchDomainData['slots']) => item.title.toLowerCase().includes(query),
  donations: (query: string, item: SearchDomainData['donations']) => item.message?.toLowerCase().includes(query) ?? false,
}

function useLocalSearchFilter<Domain extends keyof SearchDomainData>(searchValue: string, data: SearchDomainData[Domain][], domain: Domain) {
  const filteredData = useMemo<typeof data>(() => {
    const filterFn = localSearchFilterFn[domain] as LocalSearchFilterFn

    return data.filter(item => filterFn(searchValue, item))
  }, [data, searchValue, domain])

  return filteredData
}
