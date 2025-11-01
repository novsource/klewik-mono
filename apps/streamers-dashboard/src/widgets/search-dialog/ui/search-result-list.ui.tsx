import type { ReactNode } from 'react'
import { memo, useCallback, useRef } from 'react'

import NumberFlow from '@number-flow/react'
import { AnimatePresence } from 'motion/react'

import { useGlobalDialogsContext } from '~widgets/global-dialogs/context'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import type { ProcessedDonation } from '~entities/donation/model'
import { donationsSelectors } from '~entities/donation/store'
import { BaseDonationCard, BaseDonationCardContent, BaseDonationCardHeader, DonationCardStatusBadge, DonationCardUsernameInfo, SkeletonDonationCard } from '~entities/donation/ui/card'

import { IntegrationBadge } from '~entities/integrations/ui/badge'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useHover, useMediaQuery } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Card, CardContent } from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type { InfiniteListProps, InfiniteListRenderFunction } from '~shared/ui/infinite-list'
import { InfiniteList } from '~shared/ui/infinite-list'
import type { MotionBoxProps } from '~shared/ui/motion-box'
import { MotionBox } from '~shared/ui/motion-box'
import { Skeleton } from '~shared/ui/skeleton'
import { Typography } from '~shared/ui/typograghy'

import { isStringEmpty } from '~shared/utils'

import { useSearchDialogContext } from '../context'
import { useSearchInfiniteList } from '../hooks/use-search-infinite-list'

type SearchResultItemContainerProps = MotionBoxProps & {
  children: ReactNode | ReactNode[]
}

const SearchResultItemContainer = memo((props: SearchResultItemContainerProps) => {
  const { children, ...restProps } = props

  const elementRef = useRef<HTMLDivElement>(null)

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  const isHovered = useHover(elementRef)

  return (
    <MotionBox
      ref={elementRef}
      layout
      withAnimatePresense
      initial={{ scaleX: 0.9, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      exit={{ scaleY: 0, opacity: 0 }}
      transition={{ duration: 0.15 }}
      {...restProps}
    >
      <div
        className="relative flex items-center justify-between gap-x-2 w-full bg-dark px-2 py-2.5 rounded-small border-1 border-dark-light hover:border-gray hover:bg-dark-light text-gray-light transition-all cursor-pointer hover:text-gray-accent"
      >
        {children}
        <AnimatePresence>
          {isHovered && isLargeThenTablet && (
            <MotionBox
              className="absolute right-3"
              initial={{
                x: 0,
                scale: 0.4,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { duration: 0.35, delay: 0.3 },
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
              whileInView={
                { x: [0, 2.5, 0], transition: { repeat: Infinity, duration: 2, delay: 0.65 } }
              }
            >
              <Icons.ArrowRight />
            </MotionBox>
          )}
        </AnimatePresence>
      </div>
    </MotionBox>
  )
})

type SearchResultInfinityListProps<T> = InfiniteListProps<T> & {
  searchValue: string
}

const SearchResultInfinityList = <T = unknown>(props: SearchResultInfinityListProps<T>) => {
  const { data, children, searchValue, showPlaceholders, ...infiniteProps } = props

  const renderListItem = useCallback<InfiniteListRenderFunction<T>>(
    (item, virtualizedItem, state) => {
      return children(item, virtualizedItem, state)
    },
    [children],
  )

  const countOfSearchResult = data.length
  const isSearchValueEmpty = isStringEmpty(searchValue)

  if (isSearchValueEmpty) {
    return (
      <Flex className="w-full h-full" justify="center" align="center">
        <Typography className="font-breeze text-gray" tag="span">Пустое поле ввода</Typography>
      </Flex>
    )
  }

  return (
    <Flex className="w-full tablet:px-4 gap-y-2" direction="column">
      <Flex className="gap-x-2" align="center">
        <Typography className="text-gray-light" tag="span">Найдено: </Typography>
        {!showPlaceholders && (
          <NumberFlow
            className="py-0.5 px-1 border-1 border-dark-accent text-sm rounded-sm bg-dark text-gray-accent"
            value={countOfSearchResult}
            willChange
          />
        )}
        {showPlaceholders && (
          <Skeleton className="w-6.5 h-5" />
        )}
      </Flex>
      <Flex className="w-full h-full">
        <InfiniteList
          data={data}
          slotsClassNames={{ container: 'pb-4' }}
          emptyContentProps={{ placeholder: 'По вашему запросу ничего не найдено' }}
          shadowScrollProps={{
            shadowSize: 30,
          }}
          showPlaceholders={showPlaceholders}
          {...infiniteProps}
        >
          {renderListItem}
        </InfiniteList>
      </Flex>
    </Flex>
  )
}

export type SearchAuctionSlotsProps = {
  searchValue: string
  onSlotSelect?: (slot: AuctionSlot) => void
}

export const SearchAuctionSlots = (props: SearchAuctionSlotsProps) => {
  const { searchValue } = props

  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const { functions: { closeDialog } } = useSearchDialogContext()
  const { dispatch: { setSelectedSlot, setIsEditSlotDialogOpen } } = useGlobalDialogsContext()

  const infiniteList = useSearchInfiniteList(searchValue, 'slots', auctionSlots, {
    debounceTime: 2000,
    limit: 30,
    distance: 30,
  })

  const renderAuctionSlotListItem = useCallback<InfiniteListRenderFunction<AuctionSlot>>(
    (slot, virtualizedItem) => {
      return (
        <SearchResultItemContainer
          key={virtualizedItem.id}
          style={{ marginTop: virtualizedItem.index === 0 ? 0 : 6 }}
          onClick={() => {
            setSelectedSlot(slot)
            setIsEditSlotDialogOpen(true)
            closeDialog()
          }}
        >
          <Flex className="gap-x-2 max-tablet:items-start items-center max-tablet:flex-col max-tablet:justify-start max-tablet:gap-y-1.5">
            <Typography
              className="w-fit px-1 py-0 tablet:px-1.5 tablet:py-0.25 bg-dark border-1 border-dark-light font-golos-f text-gray-light rounded-sm text-[10px] tablet:text-sm text-nowrap"
              tag="span"
            >
              { `ID: ${slot.id}`}
            </Typography>
            <Typography className="max-tablet:px-0.75" tag="span">{slot.title}</Typography>
          </Flex>
        </SearchResultItemContainer>
      )
    },
    [],
  )

  return (
    <SearchResultInfinityList
      searchValue={searchValue}
      data={infiniteList.filtredData}
      listRef={infiniteList.listRef}
      state={infiniteList.state}
      placeholder={(
        <Card className="py-0 px-1">
          <CardContent className="flex-row px-1 gap-x-2 max-tablet:items-start items-start max-tablet:flex-col max-tablet:justify-center max-tablet:gap-y-1.5">
            <Skeleton className="w-10 h-5 rounded-sm" />
            <Skeleton className="w-40 h-5 rounded-sm" />
          </CardContent>
        </Card>
      )}
      showPlaceholders={infiniteList.isShowingSkeletons}
    >
      { renderAuctionSlotListItem }
    </SearchResultInfinityList>
  )
}

export const SearchDonations = (props: SearchAuctionSlotsProps) => {
  const { searchValue } = props

  const storedDonations = useStoreSelector(donationsSelectors.getAllDonations)

  const { functions: { closeDialog } } = useSearchDialogContext()
  const { dispatch: { setSelectedDonation, setIsProcessDonationDialogOpen } } = useGlobalDialogsContext()

  const infiniteList = useSearchInfiniteList(searchValue, 'donations', storedDonations, {
    debounceTime: 1500,
    limit: 15,
    distance: 30,
  })

  const renderDonationListItem = useCallback<InfiniteListRenderFunction<ProcessedDonation>>(
    (donation, virtualizedItem) => {
      return (
        <SearchResultItemContainer
          key={virtualizedItem.id}
          style={{ marginTop: virtualizedItem.index === 0 ? 0 : 6 }}
          onClick={() => {
            setSelectedDonation(donation)
            setIsProcessDonationDialogOpen(true)
            closeDialog()
          }}
        >
          <BaseDonationCard className="border-0 bg-transparent py-0 pb-1">
            <BaseDonationCardHeader>
              <Flex className="w-full gap-y-2" justify="between" direction="column">
                <Flex className="h-6 gap-x-1.5">
                  <IntegrationBadge integration={donation.source} />
                  <DonationCardStatusBadge status={donation.processData.status} />
                </Flex>
                <DonationCardUsernameInfo donationData={donation} />
              </Flex>
            </BaseDonationCardHeader>
            <BaseDonationCardContent className="flex flex-row gap-x-2 items-center space-y-0 overflow-clip">
              <Icons.Message className="text-gray shrink-0" />
              <Typography
                className="font-golos-f text-white/70"
                tag="span"
              >
                {donation.message}
              </Typography>
            </BaseDonationCardContent>
          </BaseDonationCard>
        </SearchResultItemContainer>
      )
    },
    [],
  )

  return (
    <SearchResultInfinityList
      searchValue={searchValue}
      data={infiniteList.filtredData}
      listRef={infiniteList.listRef}
      state={infiniteList.state}
      placeholder={<SkeletonDonationCard />}
      showPlaceholders={infiniteList.isShowingSkeletons}
    >
      { renderDonationListItem }
    </SearchResultInfinityList>
  )
}
