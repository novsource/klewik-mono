import type { VListHandle } from 'virtua'

import { memo, useCallback, useEffect, useRef, useState } from 'react'

import { shallowEqual } from 'react-redux'

import { AnimatePresence } from 'motion/react'
import { VList } from 'virtua'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useLocalSearchFilter } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Group } from 'klewik-ui/group'
import { Icons } from 'klewik-ui/icons'
import { MotionBox } from 'klewik-ui/motion-box'

import { cn } from '~shared/utils/react'

import { useLocalAuctionSlotsPageContext } from '../../context/local-auction-slots-page.context'
import { DeleteAllSlotsButton } from '../delete-slots-buttons/delete-all-slots-button.ui'
import { AuctionSlotListCard } from './auction-slot-card.ui'

type MemorizedListProps = {
  data: number[]
  onFocusCard?: () => void
  onBlurCard?: () => void
}

const DEBOUNCE_LIST_STATE_TIME_MS = 150

const MemorizedList = memo((props: MemorizedListProps) => {
  const { data, onBlurCard, onFocusCard } = props

  const [isScrollToTopButtonDisabled, setIsScrollToTopButtonDisabled] = useState(true)
  const [isScrollToBottomButtonDisabled, setIsScrollToBottomButtonDisabled] = useState(true)

  const listRef = useRef<VListHandle>(null)

  const checkScrollButtonsAccessibility = useCallback((offset: number) => {
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

    checkScrollButtonsAccessibility(listRef.current.scrollOffset)
  }, [data, checkScrollButtonsAccessibility])

  return (
    <div className="relative" style={{ flex: '1 1 auto' }}>
      <VList
        ref={listRef}
        className="px-0.5 py-1 pb-16"
        onScroll={checkScrollButtonsAccessibility}
      >
        {data.map((id, index) => {
          const isVisible = data.find(actualId => actualId === id) !== undefined

          return (
            <AnimatePresence key={`presense-${id}`} initial={false} mode="wait">
              {isVisible && (
                <MotionBox
                  key={id}
                  className={cn(index !== 0 ? 'mt-2' : '')}
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: DEBOUNCE_LIST_STATE_TIME_MS }}
                >
                  <AuctionSlotListCard
                    slotId={id}
                    onFocus={onFocusCard}
                    onBlur={onBlurCard}
                  />
                </MotionBox>
              )}
            </AnimatePresence>
          )
        })}
      </VList>
      <ListBottomControlPanel
        listHandle={listRef.current}
        toBottomButtonDisabled={isScrollToBottomButtonDisabled}
        toTopButtonDisabled={isScrollToTopButtonDisabled}
      />
    </div>
  )
})

export const AuctionSlotsList = () => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const pageContext = useLocalAuctionSlotsPageContext()

  const localSearchedSlots = useLocalSearchFilter(pageContext.state.searchQuery, auctionSlots, (query, slot) => {
    return slot.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())
  })

  const [slotsIds, setSlotsIds] = useState(() => [...auctionSlots].sort((a, b) => b.points - a.points).map(slot => slot.id))

  const [isListIdsChangesBlocked, setIsListChangesBlocked] = useState(false)

  useEffect(() => {
    const possibleNewSlotsIds = [...localSearchedSlots].sort((a, b) => b.points - a.points).map(slot => slot.id)

    const isDataOrderChanged = !shallowEqual(slotsIds, possibleNewSlotsIds)
    const isDataSizeChanged = slotsIds.length !== possibleNewSlotsIds.length

    if ((isDataOrderChanged && !isListIdsChangesBlocked) || isDataSizeChanged) {
      setSlotsIds(possibleNewSlotsIds)
    }
  }, [isListIdsChangesBlocked, localSearchedSlots, slotsIds])

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
      <Group className="w-full h-full px-4">
        <Group gap="sm">
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
        </Group>

        <DeleteAllSlotsButton size="sm" />
      </Group>
    </div>
  )
}
