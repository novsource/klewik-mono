import { memo, useCallback, useEffect, useState } from 'react'

import { shallowEqual } from 'react-redux'

import { Reorder } from 'motion/react'
import { VList } from 'virtua'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { LocalAuctionSlotListCard } from '../cards/local-auction-slot-card.ui'

// const auctionSlots = createFakeAuctionSlotsArray({ minLength: 100, maxLength: 200 })

type MemorizedListProps = {
  data: number[]
  onFocusCard?: () => void
  onBlurCard?: () => void
}

const MemorizedList = memo((props: MemorizedListProps) => {
  const { data, onBlurCard, onFocusCard } = props

  return (
    <div style={{ flex: '1 1 auto' }}>
      <VList itemSize={64}>
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
