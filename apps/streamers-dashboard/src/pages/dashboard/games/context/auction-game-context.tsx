import type { SerializedError } from '@reduxjs/toolkit'
import type { AuctionGameMode } from '~entities/games/model'
import type { AuctionGamesSliceState } from '~entities/games/store'

import type { ReactNode } from 'react'
import { useCallback, useMemo, useRef } from 'react'

import { useDropoutSlotMutation, useSetAuctionWinnerMutation } from '~entities/games/api'

import { auctionActions, auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions, auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useMutation } from '~shared/hooks'

import type { AxiosBaseQueryError } from '~shared/lib/redux-toolkit'
import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { getPercentValue } from '~shared/utils/common'
import { createReactContext } from '~shared/utils/react'

type AuctionGameContextValue = {
  state: AuctionGamesSliceState & {
    slots: {
      all: AuctionSlot[]
    }
    playMutationState: {
      isLoading: boolean
      isSuccess: boolean
      isError: boolean
    }
  }
  actions: {
    play: (slotId: number) => Promise<{ data: void, error?: undefined } | { data?: undefined, error: AxiosBaseQueryError | SerializedError }>
    applyResults: () => void
  }
}

const [Provider, useAuctionGameContext] = createReactContext<AuctionGameContextValue>({
  contextName: 'AuctionGameContext',
  hookName: 'useAuctionGameContext',
})

type AuctionGameTempResult = {
  mode: AuctionGameMode
  slotId: number
}

type AuctionGameContextProviderProps = {
  children: ReactNode
  onDrop?: (slot: AuctionSlot) => void
  onWinner?: (slot: AuctionSlot) => void
}

export const AuctionGameContextProvider = (props: AuctionGameContextProviderProps) => {
  const { children, onWinner, onDrop } = props

  const { uuid: auctionUUID } = useStoreSelector(auctionSelectors.getInfo)
  const allAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const gameSlice = useStoreSelector(state => state.auctionGames)

  const { updateInfo } = useActionCreators(auctionActions)
  const { updateSlot, updateSlots } = useActionCreators(auctionSlotsActions)

  const [dropSlotMutation] = useDropoutSlotMutation()
  const [sendAuctionWinnerMutation] = useSetAuctionWinnerMutation()

  const tempGameResultRef = useRef<NullablePossible<AuctionGameTempResult>>(null)

  const { winner, allGameSlots, alivedGameSlots, droppedGameSlots } = useGameSlotsGroups()

  const sendWinnerSlot = useCallback(async (...args: Parameters<typeof sendAuctionWinnerMutation>) => {
    const response = await sendAuctionWinnerMutation(...args)

    if (response.error) {
      return response
    }

    const [{ slotId }] = args

    const winnerSlot = allAuctionSlots.find(slot => slot.id === slotId)

    if (winnerSlot) {
      onWinner?.(winnerSlot)
    }

    tempGameResultRef.current = { mode: 'classic', slotId }

    return response
  }, [sendAuctionWinnerMutation, allAuctionSlots, onWinner])

  const dropSlot = useCallback(async (...args: Parameters<typeof dropSlotMutation>) => {
    const [{ slotId, auctionUUID }] = args

    const droppedSlot = alivedGameSlots.find(slot => slot.id === slotId)!

    if (alivedGameSlots.length === 2) {
      const winner = alivedGameSlots.filter(slot => slot.id !== slotId)[0]

      return sendWinnerSlot({ auctionUUID, slotId: winner.id })
    }

    const response = await dropSlotMutation(...args)

    if (response.error) {
      return response
    }

    onDrop?.(droppedSlot)

    tempGameResultRef.current = { mode: 'dropout', slotId }

    return response
  }, [sendWinnerSlot, dropSlotMutation, alivedGameSlots, onDrop])

  const play = useCallback(async (slotId: number) => {
    const isSlotAlreadyWasPlayed = droppedGameSlots.some(slot => slot.id === slotId) || gameSlice.slots.winner?.id === slotId

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
    droppedGameSlots,
    auctionUUID,
    dropSlot,
    sendWinnerSlot,
  ])

  const playMutation = useMutation(async (slotId: number) => play(slotId))

  const applyPlayedResults = useCallback(() => {
    if (!tempGameResultRef.current)
      return

    const { mode, slotId } = tempGameResultRef.current

    if (mode === 'classic') {
      updateInfo({ winnerSlotId: slotId })
      updateSlots(allAuctionSlots.map<AuctionSlot>((slot) => {
        if (slot.id === slotId) {
          return slot
        }

        return { ...slot, isAlived: false, isDropped: true }
      }))
    }
    else {
      updateSlot({ id: slotId, data: { isDropped: true, isAlived: false } })
    }

    tempGameResultRef.current = null
  }, [updateInfo, updateSlot, allAuctionSlots, updateSlots])

  const contextValue = useMemo<AuctionGameContextValue>(() => ({
    state: {
      ...gameSlice,
      slots: {
        all: allGameSlots,
        alived: alivedGameSlots,
        dropped: droppedGameSlots,
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
      applyResults: applyPlayedResults,
    },
  }), [
    allGameSlots,
    applyPlayedResults,
    playMutation,
    gameSlice,
    alivedGameSlots,
    droppedGameSlots,
    winner,
  ])

  return (
    <Provider value={contextValue}>{children}</Provider>
  )
}

export { useAuctionGameContext }

function useGameSlotsGroups() {
  const allAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const { winnerSlotId } = useStoreSelector(auctionSelectors.getInfo)

  const winnerSlot = useMemo(() => {
    if (!winnerSlotId)
      return null

    return allAuctionSlots.find(slot => slot.id === winnerSlotId)!
  }, [winnerSlotId, allAuctionSlots])

  const alivedSlotsPointsSum = useMemo(() => {
    if (winnerSlot) {
      return winnerSlot.points
    }

    return allAuctionSlots.reduce((sum, slot) => sum + slot.points, 0)
  }, [allAuctionSlots, winnerSlot])

  const gameSlots = useMemo(() => {
    if (winnerSlot) {
      return allAuctionSlots.map(slot => ({
        ...slot,
        isAlived: slot.id === winnerSlot.id,
        isDropped: slot.id !== winnerSlot.id,
        winPercents: slot.id === winnerSlot.id ? 100 : 0,
      }))
    }

    return allAuctionSlots.map(slot => (
      {
        ...slot,
        winPercents:
          slot.isAlived
            ? getPercentValue(alivedSlotsPointsSum, slot.points)
            : 0,
      }))
  }, [allAuctionSlots, winnerSlot, alivedSlotsPointsSum])

  const alivedSlots = useMemo(() => {
    if (winnerSlot)
      return [{ ...winnerSlot, winPercents: 100 }]

    return gameSlots.filter(slot => slot.isAlived)
  }, [gameSlots, winnerSlot])

  const droppedSlots = useMemo(() => gameSlots.filter(slot => slot.isDropped), [gameSlots])

  return { winner: winnerSlot, allGameSlots: gameSlots, alivedGameSlots: alivedSlots, droppedGameSlots: droppedSlots }
}
