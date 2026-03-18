import type { SerializedError } from '@reduxjs/toolkit'
import type { AuctionGamesSliceState } from '~entities/games/store'

import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'

import { useDropoutSlotMutation, useSetAuctionWinnerMutation } from '~entities/games/api'

import { auctionActions, auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useMutation } from '~shared/hooks'

import type { AxiosBaseQueryError } from '~shared/lib/redux-toolkit'
import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { createReactContext } from '~shared/utils/react'

type AuctionGameContextValue = {
  state: AuctionGamesSliceState & {
    playMutationState: {
      isLoading: boolean
      isSuccess: boolean
      isError: boolean
    }
  }
  actions: {
    play: (slotId: number) => Promise<{ data: void, error?: undefined } | { data?: undefined, error: AxiosBaseQueryError | SerializedError }>
  }
}

const [Provider, useAuctionGameContext] = createReactContext<AuctionGameContextValue>({
  contextName: 'AuctionGameContext',
  hookName: 'useAuctionGameContext',
})

type AuctionGameContextProviderProps = {
  children: ReactNode
  onDrop?: (slot: AuctionSlot) => void
  onWinner?: (slot: AuctionSlot) => void
}

export const AuctionGameContextProvider = (props: AuctionGameContextProviderProps) => {
  const { children, onWinner, onDrop } = props

  const { uuid: auctionUUID, winnerSlotId } = useStoreSelector(auctionSelectors.getInfo)

  const allAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const alivedSlotsIds = useStoreSelector(auctionSlotsSelectors.getAlivedSlotsIds)
  const droppedSlotsIds = useStoreSelector(auctionSlotsSelectors.getDroppedSlotsIds)

  const gameSlice = useStoreSelector(state => state.auctionGames)

  const { updateInfo } = useActionCreators(auctionActions)

  const [dropSlotMutation] = useDropoutSlotMutation()
  const [sendAuctionWinnerMutation] = useSetAuctionWinnerMutation()

  const winner = winnerSlotId !== null ? allAuctionSlots.find(slot => slot.id === winnerSlotId)! : null

  const alivedSlots = useMemo(() => {
    return allAuctionSlots.filter(slot => alivedSlotsIds.includes(slot.id))
  }, [allAuctionSlots, alivedSlotsIds])

  const droppedSlots = useMemo(() => {
    return allAuctionSlots.filter(slot => droppedSlotsIds.includes(slot.id))
  }, [allAuctionSlots, droppedSlotsIds])

  const dropSlot = useCallback(async (...args: Parameters<typeof dropSlotMutation>) => {
    const [{ slotId, auctionUUID }] = args

    if (alivedSlotsIds.length === 2) {
      const winnerId = alivedSlotsIds.filter(id => id !== slotId)[0]

      const sendWinnerResponse = await sendAuctionWinnerMutation({ auctionUUID, slotId: winnerId })

      if (sendWinnerResponse.error) {
        return sendWinnerResponse
      }

      const winnerSlot = allAuctionSlots.find(slot => slot.id === slotId)

      if (winnerSlot) {
        onWinner?.(winnerSlot)
      }

      updateInfo({ winnerSlotId: winnerId })
    }

    const response = await dropSlotMutation(...args)

    if (response.error) {
      return response
    }

    const droppedSlot = alivedSlots.find(slot => slot.id === slotId)!

    onDrop?.(droppedSlot)

    return response
  }, [
    updateInfo,
    dropSlotMutation,
    alivedSlotsIds,
    alivedSlots,
    allAuctionSlots,
    onDrop,
    onWinner,
    sendAuctionWinnerMutation,
  ])

  const sendWinnerSlot = useCallback(async (...args: Parameters<typeof sendAuctionWinnerMutation>) => {
    const response = await sendAuctionWinnerMutation(...args)

    if (response.error) {
      return response
    }

    const [{ slotId }] = args

    updateInfo({ winnerSlotId: slotId })

    const winnerSlot = allAuctionSlots.find(slot => slot.id === slotId)

    if (winnerSlot) {
      onWinner?.(winnerSlot)
    }

    return response
  }, [sendAuctionWinnerMutation, allAuctionSlots, onWinner, updateInfo])

  const play = useCallback(async (slotId: number) => {
    const isSlotAlreadyWasPlayed
      = droppedSlotsIds.includes(slotId)
        || gameSlice.slots.winner?.id === slotId

    if (isSlotAlreadyWasPlayed) {
      return { data: undefined, error: new Error('Slot with this id is already was played') }
    }

    const gameMode = gameSlice.mode

    if (gameMode === 'dropout') {
      return dropSlot({ auctionUUID, slotId })
    }
    else {
      return sendWinnerSlot({ auctionUUID, slotId })
    }
  }, [
    gameSlice.mode,
    gameSlice.slots.winner,
    droppedSlotsIds,
    auctionUUID,
    dropSlot,
    sendWinnerSlot,
  ])

  const playMutation = useMutation(async (slotId: number) => play(slotId))

  const contextValue = useMemo<AuctionGameContextValue>(() => ({
    state: {
      ...gameSlice,
      slots: {
        alived: alivedSlots,
        dropped: droppedSlots,
        winner,
      },
      playMutationState: {
        isLoading: playMutation.isLoading,
        isError: playMutation.isError,
        isSuccess: playMutation.isSuccess,
      },
    },
    actions: {
      play: playMutation.mutateAsync,
    },
  }), [
    playMutation,
    gameSlice,
    alivedSlots,
    droppedSlots,
    winner,
  ])

  return (
    <Provider value={contextValue}>{ children}</Provider>
  )
}

export { useAuctionGameContext }
