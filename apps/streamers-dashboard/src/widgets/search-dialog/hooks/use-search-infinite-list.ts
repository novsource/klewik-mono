import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { isAxiosError } from 'axios'

import type { SearchQueryArgs, SearchQueryDomain } from '~entities/auction/api'
import { useLazySearchQuery } from '~entities/auction/api'
import { auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type { ProcessedDonation } from '~entities/donation/model'

import { useDebounceCallback, useDidUpdate, useInfiniteList, useUnmount } from '~shared/hooks'
import type { UseInfiniteListOptions, UseInfiniteListServiceFunction } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { toastErrorNotification } from '~shared/ui/toaster/lib'

import { isStringEmpty } from '~shared/utils'

type UseSearchInfiniteListOptions<T> = Omit<UseInfiniteListOptions<T>, 'queryOnEnd'> & {
  debounceTime?: number
}

export const useSearchInfiniteList = <Domain extends SearchQueryDomain, T extends Domain extends 'slots' ? AuctionSlot : ProcessedDonation>
(searchValue: string,
  domain: Domain,
  data: Array<T>,
  options: UseSearchInfiniteListOptions<T>,
) => {
  const {
    debounceTime = 1500,
    distance,
    ...infiniteListOptions
  } = options

  const [isQueryDebouncingActive, setIsQueryDebouncingActive] = useState(false)
  const [isCanLoadMore, setIsCanLoadMore] = useState(true)

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const searchResultsFromInputData = useMemo<T[]>(() => {
    function isIncludeSearchValue(target: string) {
      return target.toLowerCase().includes(searchValue.toLowerCase())
    }

    if (domain === 'slots') {
      const castedData = data as AuctionSlot[]
      return castedData.filter(slot => isIncludeSearchValue(slot.title)) as T[]
    }

    const castedData = data as ProcessedDonation[]
    return castedData.filter(donation => donation.message ? isIncludeSearchValue(donation.message) : false) as T[]
  }, [data, searchValue, domain])

  const lastDataItemIdRef = useRef<Maybe<number>>(searchResultsFromInputData.at(-1)?.id)
  const lastUsedSearchValueRef = useRef('')
  const pendingSearchValueTriggerRef = useRef('')

  const { searchQuery, queryState: searchQueryState, promise: searchQueryPromise } = useSearchInfiniteListQuery<T>({
    auctionUUID,
    domain,
    query: searchValue,
    after: lastDataItemIdRef.current,
    limit: 15,
  })

  const {
    ref: listRef,
    state: infiniteListState,
    functions: { reset: resetInfiniteList, updateIsCanLoadMore: updateListIsCanLoadMore },
  } = useInfiniteList<T>(searchQuery, infiniteListOptions)

  const debouncedSearchQuery = useDebounceCallback(async () => {
    try {
      const response = await searchQuery()

      lastUsedSearchValueRef.current = pendingSearchValueTriggerRef.current

      if (!response) {
        setIsCanLoadMore(false)
        return
      }

      const listLimit = infiniteListOptions.limit ?? 15
      const isNoMoreData = response.list.length < listLimit

      if (isNoMoreData) {
        setIsCanLoadMore(false)
      }

      lastDataItemIdRef.current = response.list.at(-1)?.id
    }
    catch (error) {
      if (isAxiosError(error)) {
        toastErrorNotification('Не удалось выполнить поисковый запрос')
      }

      if (error instanceof Error) {
        toastErrorNotification('Не удалось выполнить поисковый запрос')
      }
    }
  }, debounceTime)

  const resetAll = useCallback(() => {
    debouncedSearchQuery.cancel()
    searchQueryPromise?.abort()

    lastDataItemIdRef.current = undefined
    lastUsedSearchValueRef.current = ''
    pendingSearchValueTriggerRef.current = ''

    resetInfiniteList()

    setIsCanLoadMore(true)
    setIsQueryDebouncingActive(false)
  }, [searchQueryPromise, resetInfiniteList, debouncedSearchQuery])

  useDidUpdate(() => {
    const isListEmpty = infiniteListState.value.length === 0

    if (isListEmpty) {
      lastDataItemIdRef.current = searchResultsFromInputData.at(-1)?.id
    }
    else {
      lastDataItemIdRef.current = infiniteListState.value.at(-1)?.id
    }
  }, [searchResultsFromInputData, infiniteListState.value])

  useEffect(() => {
    const isSearchValueNotEmpty = !isStringEmpty(searchValue)
    const isPreviousSearchValueWasLarge = lastUsedSearchValueRef.current.length === 0 || lastUsedSearchValueRef.current.length > searchValue.length

    const isShouldStartSearching
      = isSearchValueNotEmpty
        && isCanLoadMore
        && !searchQueryState.isLoading
        && searchResultsFromInputData.length < infiniteListState.limit
        && isPreviousSearchValueWasLarge

    if (!isShouldStartSearching)
      return

    debouncedSearchQuery()
    setIsQueryDebouncingActive(true)
    pendingSearchValueTriggerRef.current = searchValue
  }, [
    debouncedSearchQuery,
    searchResultsFromInputData.length,
    isCanLoadMore,
    searchQueryState.isLoading,
    searchValue,
    infiniteListState.limit,
  ])

  useEffect(() => {
    const isSearchValueChanged = pendingSearchValueTriggerRef.current !== searchValue
    const isShouldCancelSearchQuery = (isQueryDebouncingActive && !isCanLoadMore)
      || (isQueryDebouncingActive && isSearchValueChanged)

    if (isShouldCancelSearchQuery) {
      debouncedSearchQuery.cancel()

      setIsQueryDebouncingActive(false)
    }
  }, [
    updateListIsCanLoadMore,
    searchValue,
    isCanLoadMore,
    isQueryDebouncingActive,
    debouncedSearchQuery,
    searchResultsFromInputData.length,
    infiniteListState.limit,
  ])

  useEffect(() => {
    const isSearchValueNotEmpty = !isStringEmpty(searchValue)
    const isPreviousSearchValueWasLarge = lastUsedSearchValueRef.current.length > searchValue.length

    const isShouldResetAll
      = (isSearchValueNotEmpty && isPreviousSearchValueWasLarge && !isQueryDebouncingActive)
        || (!isSearchValueNotEmpty && isPreviousSearchValueWasLarge)

    if (!isShouldResetAll)
      return

    resetAll()
  }, [isQueryDebouncingActive, searchValue, resetAll])

  useUnmount(() => {
    resetAll()
  })

  return {
    isPending: isQueryDebouncingActive,
    isLoading: searchQueryState.isLoading,
    filtredData: searchResultsFromInputData,
    listRef,
    state: infiniteListState,
  }
}

function useSearchInfiniteListQuery<T>(options: SearchQueryArgs) {
  const [lazySearchQuery, queryState] = useLazySearchQuery()

  const queryRef = useRef<NullablePossible<ReturnType<typeof lazySearchQuery>>>(null)

  const searchQuery: UseInfiniteListServiceFunction<T> = async () => {
    try {
      queryRef.current = lazySearchQuery(options)

      const response = await queryRef.current
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
      queryRef.current = null
    }
  }

  return { searchQuery, queryState, promise: queryRef.current }
}
