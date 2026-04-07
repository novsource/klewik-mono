import type { VListHandle } from 'virtua'

import { memo, useCallback, useEffect, useRef, useState } from 'react'

import { shallowEqual } from 'react-redux'

import { Reorder } from 'motion/react'
import { VList } from 'virtua'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Icons } from 'klewik-ui/icons'

import { DeleteAllLocalSlotsButton } from '../buttons/delete-all-local-slots.ui'
import { LocalAuctionSlotListCard } from '../cards/local-auction-slot-card.ui'

// const auctionSlots = createFakeAuctionSlotsArray({ minLength: 100, maxLength: 200 })

type MemorizedListProps = {
  data: number[]
  onFocusCard?: () => void
  onBlurCard?: () => void
}

const MemorizedList = memo((props: MemorizedListProps) => {
  const { data, onBlurCard, onFocusCard } = props

  const [isScrollToTopButtonDisabled, setIsScrollToTopButtonDisabled] = useState(true)
  const [isScrollToBottomButtonDisabled, setIsScrollToBottomButtonDisabled] = useState(true)

  const listRef = useRef<VListHandle>(null)

  const checkScrollButtonsAccess = useCallback((offset: number) => {
    const vListHandle = listRef.current
    if (!vListHandle)
      return

    const isScrollNotPossible = vListHandle.viewportSize >= vListHandle.scrollSize

    const isNotPossibleScrollToTop = isScrollNotPossible || offset === 0
    const isNotPossibleScrollToBottom = isScrollNotPossible || (offset + vListHandle.viewportSize) === vListHandle.scrollSize

    if (isNotPossibleScrollToTop !== isScrollToTopButtonDisabled) {
      setIsScrollToTopButtonDisabled(isNotPossibleScrollToTop)
    }

    if (isNotPossibleScrollToBottom !== isScrollToBottomButtonDisabled) {
      setIsScrollToBottomButtonDisabled(isNotPossibleScrollToBottom)
    }
  }, [isScrollToBottomButtonDisabled, isScrollToTopButtonDisabled])

  useEffect(() => {
    if (!listRef.current)
      return

    checkScrollButtonsAccess(listRef.current.scrollOffset)
  }, [data, checkScrollButtonsAccess])

  return (
    <div className="relative" style={{ flex: '1 1 auto' }}>
      <VList
        ref={listRef}
        className="pb-16"
        itemSize={64}
        onScroll={checkScrollButtonsAccess}
      >
        <Reorder.Group values={data} onReorder={() => { }}>
          {data.map((id, index) => {
            return (
              <Reorder.Item
                key={`item-${id}`}
                value={id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, type: 'tween' }}
              >
                <LocalAuctionSlotListCard
                  className={index !== 0 ? 'mt-2' : ''}
                  slotId={id}
                  onFocus={onFocusCard}
                  onBlur={onBlurCard}
                />
              </Reorder.Item>
            )
          })}
        </Reorder.Group>
      </VList>

      <ListBottomControlPanel
        listHandle={listRef.current}
        toBottomButtonDisabled={isScrollToBottomButtonDisabled}
        toTopButtonDisabled={isScrollToTopButtonDisabled}
      />
    </div>
  )
})

export const LocalAuctionSlotsList = () => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const [slotsIds, setSlotsIds] = useState(() => [...auctionSlots].sort((a, b) => b.points - a.points).map(slot => slot.id))

  const [isListIdsChangesBlocked, setIsListChangesBlocked] = useState(false)

  useEffect(() => {
    const possibleNewSlotsIds = [...auctionSlots].sort((a, b) => b.points - a.points).map(slot => slot.id)

    if ((!shallowEqual(slotsIds, possibleNewSlotsIds) && !isListIdsChangesBlocked) || slotsIds.length !== possibleNewSlotsIds.length) {
      setSlotsIds(possibleNewSlotsIds)
    }
  }, [isListIdsChangesBlocked, auctionSlots, slotsIds])

  const handleOnFocusCard = useCallback(() => setIsListChangesBlocked(true), [])
  const handleOnBlurCard = useCallback(() => setIsListChangesBlocked(false), [])

  return <MemorizedList data={slotsIds} onFocusCard={handleOnFocusCard} onBlurCard={handleOnBlurCard} />
}

type ListBottomControlPanelProps = {
  listHandle: NullablePossible<VListHandle>
  toBottomButtonDisabled?: boolean
  toTopButtonDisabled?: boolean
}

function ListBottomControlPanel(props: ListBottomControlPanelProps) {
  const { listHandle, toBottomButtonDisabled = true, toTopButtonDisabled = true } = props

  const scrollToTop = () => {
    if (!listHandle)
      return

    listHandle.scrollTo(0)
  }

  const scrollToBottom = () => {
    if (!listHandle)
      return

    listHandle.scrollTo(listHandle.scrollSize)
  }

  return (
    <div className="absolute w-full h-12 bg-dark-light/10 backdrop-blur-lg bottom-2 rounded-medium">
      <div className="flex w-full h-full items-center justify-between px-4">
        <div className="flex gap-x-2">
          <Button
            startContent={<Icons.ArrowRight className="-rotate-90" />}
            size="sm"
            disabled={toTopButtonDisabled}
            onClick={scrollToTop}
          >
            В начало
          </Button>
          <Button
            startContent={<Icons.ArrowRight className="rotate-90" />}
            size="sm"
            disabled={toBottomButtonDisabled}
            onClick={scrollToBottom}
          >
            В конец
          </Button>
        </div>

        <div className="flex gap-x-2">
          <DeleteAllLocalSlotsButton size="sm" />
        </div>

      </div>
    </div>
  )
}
