'use client'

import type { ComponentProps } from 'react'
import type { ButtonProps } from 'klewik-ui/button'
import type {
  BaseAuctionSlotCardProps,
} from '../slot-card'
import { memo, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { Button } from 'klewik-ui/button'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { cn } from '~utils/cn'
import {
  AuctionSlotCardContentInfoDivider,
  AuctionSlotCardPointsInfo,
  AuctionSlotCardWinPercents,
  BaseAuctionSlotCard,
  BaseAuctionSlotCardContent,
  SolidAuctionSlotContent,
  SolidAuctionSlotHeader,
} from '../slot-card'
import { useMediaQuery } from '~hooks/index'
import { greaterThenDeviceWidthMediaQueries } from '~/constants'
import { CardProps } from 'klewik-ui/card'

export type AuctionSlotsListCardProps = CardProps & {
  auctionSlot: AuctionSlot
  actionButtonProps?: ButtonProps
  isWinner?: boolean
  isDropped?: boolean
}

export const AuctionSlotsListCard = (props: AuctionSlotsListCardProps) => {
  const {
    auctionSlot,
    className,
    actionButtonProps,
    isWinner = false,
    isDropped = false,
    ...restProps
  } = props

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  return (
    <BaseAuctionSlotCard
      className={cn('flex-row items-end pr-2', className)}
      {...restProps}
    >
      <Flex className="gap-y-2 pr-3.5" direction="column">
        <SolidAuctionSlotHeader slotTitle={auctionSlot.title} />

        <BaseAuctionSlotCardContent {...restProps}>
          <Flex
            className="w-fit"
            direction="row"
            align="center"
          >
            <div className={cn('size-7.5 tablet:size-8 bg-red/10 flex items-center justify-center rounded-small', isDropped && 'bg-dark-light', isWinner && 'bg-orange/10')}>
              {isWinner
                ? <Icons.Crown className="text-orange" />
                : isDropped
                  ? <Icons.BrokenHeart className="text-gray-light" />
                  : <Icons.Heart className="  text-red animate-heartbeating" size="xs" />}
            </div>
            <AuctionSlotCardContentInfoDivider />
            <AuctionSlotCardPointsInfo slotPoints={auctionSlot.points} />
            <AuctionSlotCardContentInfoDivider />
            <AuctionSlotCardWinPercents winPercents={auctionSlot.winPercents} />
          </Flex>
        </BaseAuctionSlotCardContent>
      </Flex>

      <Button
        className="bg-dark-light text-gray-light transition-colors hover:text-white"
        isIconOnly
        icon={<Icons.ArrowRight size={isLargeThenTablet ? 'default' : 'sm'} />}
        size={isLargeThenTablet ? 'sm' : 'xs'}
        {...actionButtonProps}
      />

    </BaseAuctionSlotCard>
  )
}


type SlotsListProps = ComponentProps<'ul'> & {
  slots: AuctionSlot[]
  setSlot: (slot: AuctionSlot) => void
  filterTitle?: string | null
}

export const SlotsList = memo((props: SlotsListProps) => {
  const {
    slots,
    setSlot,
    filterTitle,
    className,
    ...restProps
  } = props

  const [showedSlots, setShowedSlots] = useState(() => {
    const sortedSlots = slots.sort((a, b) => b.points - a.points)

    if (!filterTitle)
      return sortedSlots

    return sortedSlots.filter(slot => slot.title
      .toLowerCase()
      .includes(filterTitle.toLowerCase()))
  })

  const pointsSum = useMemo(() => {
    return showedSlots.reduce((sum, slot) => sum + slot.points, 0)
  }, [showedSlots])

  const [isPending, startTransition] = useTransition()

  const prevFilterTitleRef = useRef(filterTitle)

  useEffect(() => {
    if (prevFilterTitleRef.current === filterTitle)
      return

    if (!filterTitle) {
      prevFilterTitleRef.current = filterTitle
      return setShowedSlots(slots)
    }

    startTransition(() => {
      const filtredByTitleSlots = showedSlots.filter(
        slot => slot.title
          .toLocaleLowerCase()
          .includes(filterTitle.toLocaleLowerCase()),
      )

      prevFilterTitleRef.current = filterTitle
      setShowedSlots(filtredByTitleSlots)
    })
  }, [filterTitle, showedSlots, slots])

  return (
    <Flex
      as="ul"
      direction="column"
      className={cn(
        'relative gap-y-1.5 tablet:gap-y-2 pb-4',
        isPending && 'after:w-full after:h-full after:bg-dark/10 after:absolute after:top-0',
        className,
      )}
      {...restProps}
    >
      {showedSlots.map((slot) => {
        const winPercent = (slot.points / pointsSum) * 100
        return (
          <li key={slot.title}>
            <AuctionSlotCard
              auctionSlot={slot}
              winPercent={winPercent}
              triggerProps={{
                onClick: () => setSlot(slot),
              }}
            />
          </li>
        )
      })}
    </Flex>
  )
})
