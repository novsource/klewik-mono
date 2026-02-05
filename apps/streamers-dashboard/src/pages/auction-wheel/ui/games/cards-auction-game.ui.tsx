import { useEffect, useRef, useState } from 'react'

import { useDropoutSlotMutation, useSetAuctionWinnerMutation } from '~entities/games/api'
import { useCardsAuctionGame } from '~entities/games/hooks/cards-game'
import { auctionGamesSelectors } from '~entities/games/store'
import { CardsGame } from '~entities/games/ui/card-game/cards-game.ui'
import confetti from 'canvas-confetti'

import { auctionSelectors } from '~entities/auction/store'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { Title } from '~shared/components/typography'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { MotionBox } from '~shared/ui/motion-box'
import { toastErrorNotification } from '~shared/ui/toaster/lib'

export const AuctionCardsGame = () => {
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const gameMode = useStoreSelector(auctionGamesSelectors.getGameMode)

  const game = useCardsAuctionGame(auctionSlots)

  const [isChoosedCardConfirmed, setIsChoosedCardConfirmed] = useState(false)
  const [isBackdropShowed, setIsBackdropShowed] = useState(false)

  const [dropSlotMutation, { isLoading: dropoutMutationLoading }] = useDropoutSlotMutation()
  const [sendAuctionWinnerMutation, { isLoading: sendAuctionWinnerLoading }] = useSetAuctionWinnerMutation()

  const fireworksIntervalRef = useRef<NullablePossible<NodeJS.Timeout>>(null)

  if (game.state.choosedCardUnit !== null && !isBackdropShowed) {
    setIsBackdropShowed(true)
  }

  if (!game.state.choosedCardUnit && isBackdropShowed) {
    setIsBackdropShowed(false)
  }

  const confirmChoice = async (slotId: number) => {
    if (gameMode === 'dropout') {
      const response = await dropSlotMutation({ auctionUUID, slotId })

      if (response.error) {
        toastErrorNotification('Не удалось подтвердить выбор. Попробуйте еще раз')
      }
      else {
        setIsChoosedCardConfirmed(true)
      }
    }
    else {
      const response = await sendAuctionWinnerMutation({ auctionUUID, slotId })

      if (response.error) {
        toastErrorNotification('Не удалось подтвердить выбор. Попробуйте еще раз')
      }
      else {
        setIsChoosedCardConfirmed(true)
      }
    }
  }

  const reset = () => {
    game.actions.clearChoosenCard()
    setIsChoosedCardConfirmed(false)
  }

  useEffect(() => {
    if (!isChoosedCardConfirmed) {
      if (fireworksIntervalRef.current) {
        clearInterval(fireworksIntervalRef.current)
        fireworksIntervalRef.current = null
      }

      return
    }

    fireworksIntervalRef.current = startFireworksConfetti()

    return () => {
      if (fireworksIntervalRef.current) {
        clearInterval(fireworksIntervalRef.current)
      }
    }
  }, [isChoosedCardConfirmed])

  const isLoading = dropoutMutationLoading || sendAuctionWinnerLoading

  return (
    <CardsGame game={game}>
      <CardsGame.Field>
        {(card) => {
          const isCurrentCardChoosed = game.state.choosedCardUnit?.id === card.id

          return (
            <MotionBox
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: 'spring' }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <CardsGame.Card
                key={card.id}
                className="data-[choosed=true]:bg-green-dark data-[choosed=true]:border-green-accent data-[hovered=true]:data-[choosed=true]:border-green-accent"
                cardUnit={card}
                onClick={() => game.actions.chooseCard(card)}
              >
                {isCurrentCardChoosed
                  && (
                    <Button
                      className="bg-green-light text-green-accent hover:bg-green/40 hover:text-green-accent animate-pulse hover:animate-none"
                      variant="ghost"
                      isIconOnly
                      loading={isLoading}
                      icon={<Icons.Success />}
                      size="lg"
                      onClick={() => confirmChoice(card.auctionSlotId)}
                    />
                  )}
              </CardsGame.Card>
            </MotionBox>
          )
        }}
      </CardsGame.Field>

      <CardsGame.Portal>
        {isChoosedCardConfirmed && (
          <>
            <CardsGame.Backdrop />
            <MotionBox
              className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 z-[100] overflow-clip"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{
                delay: 0.5,
                duration: 1.5,
                type: 'spring',
              }}
            >
              <Title className="p-1" style={{ fontSize: 32 }}>{game.state.choosedCardUnit?.title}</Title>
            </MotionBox>

            <Button
              className="absolute right-4 top-4 text-gray-accent hover:text-white transition-colors z-[100]"
              variant="ghost"
              isIconOnly
              icon={<Icons.LargeCross style={{ width: 34, height: 34 }} />}
              onClick={reset}
            />
          </>
        )}
      </CardsGame.Portal>

    </CardsGame>
  )
}

function startFireworksConfetti() {
  const duration = 15 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 120, zIndex: 102 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
  }, 250)

  return interval
}
