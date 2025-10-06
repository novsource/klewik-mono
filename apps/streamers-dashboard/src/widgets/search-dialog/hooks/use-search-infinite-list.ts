import { useEffect, useMemo, useRef, useState } from 'react'

import type { SearchQueryDomain } from '~entities/auction/api'
import { useLazySearchQuery } from '~entities/auction/api'
import { auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type { ProcessedDonation } from '~entities/donation/model'

import { useDebounceCallback, useDidUpdate, useInfiniteList, useUnmount } from '~shared/hooks'
import type { UseInfiniteListOptions, UseInfiniteListServiceFunction } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { isStringEmpty, objectToDeps } from '~shared/utils'

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

  const [isShowingSkeletons, setIsShowingSkeletons] = useState(false)
  const [isListShouldBeCleared, setIsListShouldBeCleared] = useState(false)
  const [isDebounceStarted, setIsDebounceStarted] = useState(false)
  const [isCanLoadMore, setIsCanLoadMore] = useState(false)

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const filtredDataWithSearchValue = useMemo<T[]>(() => {
    if (domain === 'slots') {
      return (data as AuctionSlot[]).filter(
        slot => slot.title?.toLowerCase().includes(searchValue.toLowerCase()),
      ) as T[]
    }

    return (data as ProcessedDonation[]).filter(
      donation => donation.message?.toLowerCase().includes(searchValue.toLowerCase()),
    ) as T[]
  }, [data, searchValue, domain])

  const [query] = useLazySearchQuery()

  const queryRef = useRef<NullablePossible<ReturnType<typeof query>>>(null)
  const lastDataItemIdRef = useRef<Maybe<number>>(filtredDataWithSearchValue.at(-1)?.id)

  const searchQuery: UseInfiniteListServiceFunction<T> = async () => {
    try {
      setIsDebounceStarted(false)

      queryRef.current = query({
        auctionUUID,
        domain,
        query: searchValue,
        after: lastDataItemIdRef.current,
        limit: 15,
      })

      const response = await queryRef.current

      setIsShowingSkeletons(false)
      queryRef.current = null

      const responseData = response.data as Maybe<T[]>

      if (!responseData || responseData.length === 0) {
        setIsCanLoadMore(false)
        return { list: [] }
      }

      const limit = infiniteListOptions.limit ?? 15

      if (responseData.length < limit) {
        setIsCanLoadMore(false)
      }

      lastDataItemIdRef.current = responseData.at(-1)?.id ?? lastDataItemIdRef.current

      return { list: responseData }
    }
    catch (error) {
      queryRef.current = null

      if (error instanceof Error)
        throw error
    }
  }

  const debouncedSearchDonationQuery = useDebounceCallback(searchQuery, debounceTime)

  const {
    ref: listRef,
    state: infiniteListState,
    functions: { reset },
  } = useInfiniteList<T>(searchQuery, infiniteListOptions)

  useDidUpdate(() => {
    const isInfiniteListValueEmpty = infiniteListState.value.length === 0

    if (isInfiniteListValueEmpty) {
      lastDataItemIdRef.current = filtredDataWithSearchValue.at(-1)?.id
    }
    else {
      lastDataItemIdRef.current = infiniteListState.value.at(-1)?.id
    }
  }, [filtredDataWithSearchValue, infiniteListState.value])

  useDidUpdate(() => {
    if (isListShouldBeCleared) {
      reset()

      lastDataItemIdRef.current = undefined
      queryRef.current?.abort()
      queryRef.current = null

      setIsListShouldBeCleared(false)
    }
  }, [isListShouldBeCleared])

  useEffect(() => {
    const isStringNotEmpty = !isStringEmpty(searchValue)
    const isShouldLoadMore
      = (filtredDataWithSearchValue.length < infiniteListState.limit)
        && isCanLoadMore

    if (isDebounceStarted && !isShouldLoadMore) {
      debouncedSearchDonationQuery.cancel()

      setIsDebounceStarted(false)
    }

    if (isStringNotEmpty && isShouldLoadMore) {
      debouncedSearchDonationQuery()
      setIsDebounceStarted(true)
      setIsListShouldBeCleared(true)
      setIsShowingSkeletons(true)
    }

    if (!isStringNotEmpty) {
      setIsListShouldBeCleared(true)
      setIsShowingSkeletons(false)
      setIsCanLoadMore(true)
    }
  }, [
    searchValue,
    isCanLoadMore,
    isDebounceStarted,
    debouncedSearchDonationQuery,
    filtredDataWithSearchValue.length,
    ...objectToDeps(
      infiniteListState,
      ['isCanLoadMore', 'isPending', 'limit'],
    ),
  ])

  useUnmount(() => queryRef.current?.abort())

  return {
    isShowingSkeletons,
    filtredData: filtredDataWithSearchValue,
    listRef,
    state: infiniteListState,
  }
}
