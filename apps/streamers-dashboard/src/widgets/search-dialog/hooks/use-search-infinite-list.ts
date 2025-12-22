import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { SearchQueryDomain } from '~entities/auction/api'
import { useLazySearchQuery } from '~entities/auction/api'
import { auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type { ProcessedDonation } from '~entities/donation/model'

import { useDebounceCallback, useDidUpdate, useInfiniteList, useUnmount } from '~shared/hooks'
import type { UseInfiniteListOptions, UseInfiniteListServiceFunction } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

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

  const [isPending, setIsPending] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCanLoadMore, setIsCanLoadMore] = useState(true)

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const [lazySearchQuery] = useLazySearchQuery()

  const searchResultsFromInputData = useMemo<T[]>(() => {
    if (domain === 'slots') {
      return (data as AuctionSlot[]).filter(
        slot => slot.title?.toLowerCase().includes(searchValue.toLowerCase()),
      ) as T[]
    }

    return (data as ProcessedDonation[]).filter(
      donation => donation.message?.toLowerCase().includes(searchValue.toLowerCase()),
    ) as T[]
  }, [data, searchValue, domain])

  const queryRef = useRef<NullablePossible<ReturnType<typeof lazySearchQuery>>>(null)
  const lastDataItemIdRef = useRef<Maybe<number>>(searchResultsFromInputData.at(-1)?.id)
  const lastSearchValueRequestRef = useRef('')
  const pendingSearchValueTriggerRef = useRef('')

  const searchQuery: UseInfiniteListServiceFunction<T> = async () => {
    try {
      setIsLoading(true)

      queryRef.current = lazySearchQuery({
        auctionUUID,
        domain,
        query: searchValue,
        after: lastDataItemIdRef.current,
        limit: 15,
      })

      const response = await queryRef.current
      const responseData = response.data as Maybe<T[]>

      const isResponseDataEmpty = !responseData || !responseData.length

      if (isResponseDataEmpty) {
        setIsCanLoadMore(false)

        return { list: [] }
      }

      lastDataItemIdRef.current = responseData[responseData.length - 1].id

      const listLimit = infiniteListOptions.limit ?? 15
      const isNotPossibleToLoadMoreData = responseData.length < listLimit

      if (isNotPossibleToLoadMoreData) {
        setIsCanLoadMore(false)
      }

      return { list: responseData }
    }
    catch (error) {
      if (error instanceof Error)
        throw error
    }
    finally {
      lastSearchValueRequestRef.current = searchValue
      queryRef.current = null

      setIsPending(false)
      setIsLoading(false)
    }
  }

  const {
    ref: listRef,
    state: infiniteListState,
    functions: { reset: resetInfiniteList, updateIsCanLoadMore: updateListIsCanLoadMore },
  } = useInfiniteList<T>(searchQuery, infiniteListOptions)

  const debouncedSearchQuery = useDebounceCallback(searchQuery, debounceTime)

  const resetAll = useCallback(() => {
    debouncedSearchQuery.cancel()
    queryRef.current?.abort()

    lastDataItemIdRef.current = undefined
    lastSearchValueRequestRef.current = ''
    pendingSearchValueTriggerRef.current = ''
    queryRef.current = null

    resetInfiniteList()

    setIsCanLoadMore(true)
    setIsPending(false)
  }, [resetInfiniteList, debouncedSearchQuery])

  useDidUpdate(() => {
    const isInfiniteListEmpty = infiniteListState.value.length === 0

    if (isInfiniteListEmpty) {
      lastDataItemIdRef.current = searchResultsFromInputData.at(-1)?.id
    }
    else {
      lastDataItemIdRef.current = infiniteListState.value.at(-1)?.id
    }
  }, [searchResultsFromInputData, infiniteListState.value])

  // useEffect(() => {
  //   const isPossibleSearchMoreData
  //     = (searchResultsFromInputData.length > infiniteListState.limit)
  //       && isCanLoadMore && !isStringEmpty(searchValue)

  //   console.log(isCanLoadMore)

  //   if (!isPossibleSearchMoreData && isCanLoadMore) {
  //     setIsCanLoadMore(false)
  //     updateListIsCanLoadMore(false)
  //   }

  //   if (isPossibleSearchMoreData && !isCanLoadMore) {
  //     setIsCanLoadMore(true)
  //     updateListIsCanLoadMore(true)
  //   }
  // }, [infiniteListState.limit, searchResultsFromInputData.length, updateListIsCanLoadMore, isCanLoadMore, searchValue])

  useEffect(() => {
    const isSearchValueNotEmpty = !isStringEmpty(searchValue)
    const isShouldStartSearch = isSearchValueNotEmpty && isCanLoadMore && !isLoading && searchResultsFromInputData.length < infiniteListState.limit

    if (!isShouldStartSearch)
      return

    console.log('search')

    debouncedSearchQuery()
    setIsPending(true)
    pendingSearchValueTriggerRef.current = searchValue
  }, [
    debouncedSearchQuery,
    searchResultsFromInputData.length,
    isCanLoadMore,
    isLoading,
    searchValue,
    infiniteListState.limit,
  ])

  useEffect(() => {
    const isShouldCancelSearchQuery = (isPending && !isCanLoadMore)
      || (isPending && pendingSearchValueTriggerRef.current !== searchValue)

    if (isShouldCancelSearchQuery) {
      debouncedSearchQuery.cancel()

      setIsPending(false)
    }
  }, [
    updateListIsCanLoadMore,
    searchValue,
    isCanLoadMore,
    isPending,
    debouncedSearchQuery,
    searchResultsFromInputData.length,
    infiniteListState.limit,
  ])

  useEffect(() => {
    const isSearchValueNotEmpty = !isStringEmpty(searchValue)
    const isPreviousSearchValueWasLarge = lastSearchValueRequestRef.current.length > searchValue.length

    const isShouldResetAll
      = (isSearchValueNotEmpty && isPreviousSearchValueWasLarge && !isPending)
        || (!isSearchValueNotEmpty && isPreviousSearchValueWasLarge)

    if (!isShouldResetAll)
      return

    resetAll()
  }, [isPending, searchValue, resetAll])

  useUnmount(() => {
    resetAll()
  })

  return {
    isPending,
    isLoading,
    filtredData: searchResultsFromInputData,
    listRef,
    state: infiniteListState,
  }
}
