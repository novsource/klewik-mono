import type { CardsGameUnit } from '~entities/games/model/cards-game'

import { useEffect, useMemo, useState } from 'react'

import NumberFlow from '@number-flow/react'
import { useGameConfetti } from '~entities/games/hooks'
import { useCardsGameAnimations, useCardsGameLayout } from '~entities/games/hooks/cards-game'
import { WinnerGameSlotInfo } from '~entities/games/ui'
import { CardsGame } from '~entities/games/ui/card-game/cards-game.ui'
import { AnimatePresence } from 'motion/react'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { Text, Title } from '~shared/components/typography'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Icons } from 'klewik-ui/icons'
import { MotionBox } from 'klewik-ui/motion-box'

import { cn, getHEXColor, hexToRgba } from '~shared/utils'

import { GAME_CARDS_BG_ICONS } from '../../constants/game-cards-icons'
import { useAuctionGameContext } from '../../context/auction-game-context'
import { useAuctionCardsGame } from '../../hooks/use-auction-cards-game'

export const AuctionCardsGame = () => {
  const [isCardRevealAnimationEnded, setIsCardRevealAnimationEnded] = useState(true)

  const auctionGameContext = useAuctionGameContext()
  const { queryState, ...game } = useAuctionCardsGame()

  const cardsGameLayout = useCardsGameLayout(game.state.cardsUnits, { rows: 5, columns: 6 })
  const cardsAnimations = useCardsGameAnimations(cardsGameLayout.cardsLayoutInfo)

  const gameConfetti = useGameConfetti()

  const isCardConfirmed = game.state.confirmedCard !== null

  const reset = () => {
    game.actions.clearChoosenCard()
    game.actions.clearConfirmedCard()

    setIsCardRevealAnimationEnded(false)
  }

  useEffect(() => {
    if (!isCardConfirmed) {
      gameConfetti.stopAllConfetti()
      return
    }

    if (isCardRevealAnimationEnded && isCardConfirmed) {
      if (auctionGameContext.state.mode === 'classic') {
        gameConfetti.startWinnerConfetti()
      }
      else {
        gameConfetti.startDropoutConfetti()
      }
    }
  }, [gameConfetti, isCardConfirmed, isCardRevealAnimationEnded, auctionGameContext.state.mode])

  const renderGameCard = (card: CardsGameUnit) => {
    const cardLayoutInfo = cardsGameLayout.getCardLayoutInfo(card.id)
    const currentCardAnimationVariant = cardsAnimations.getCardAnimationVariant(card.id)

    if (!cardLayoutInfo)
      return

    return (
      <MotionBox
        variants={cardsAnimations.animationVariants}
        initial="initial"
        animate={currentCardAnimationVariant?.animate}
        custom={currentCardAnimationVariant?.custom}
        exit={{ opacity: 0, scale: 0 }}
        onAnimationComplete={(definition) => {
          if (definition !== 'reveal' && isCardRevealAnimationEnded) {
            setIsCardRevealAnimationEnded(false)
          }

          if (definition === 'reveal' && !isCardRevealAnimationEnded) {
            setIsCardRevealAnimationEnded(true)
          }
        }}
      >
        <GameCard card={card} confirmed={isCardConfirmed} />
      </MotionBox>
    )
  }

  const isBackdropShowed = !!game.state.choosedCardUnit
  const isShouldShowCardInfo = isCardRevealAnimationEnded && isCardConfirmed
  const isShouldShowControlsPanel = !isCardConfirmed

  return (
    <div ref={cardsGameLayout.ref} className="flex w-full h-full">
      <CardsGame.Field>
        {renderGameCard}
      </CardsGame.Field>

      <CardsGame.Portal>
        {isBackdropShowed && (
          <>
            <CardsGame.Backdrop />

            {isShouldShowCardInfo && <GameConfirmedCardInfo card={game.state.choosedCardUnit!} onClose={reset} />}
            {isShouldShowControlsPanel && <GameCardControlsPanel onClose={reset} />}
          </>
        )}
      </CardsGame.Portal>
    </div>
  )
}

type GameCardProps = {
  card: CardsGameUnit
  confirmed?: boolean
  onSelect?: (card: CardsGameUnit) => void
}

function GameCard(props: GameCardProps) {
  const { card, confirmed = false, onSelect } = props

  const game = useAuctionCardsGame()

  const GameBgIcon = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * GAME_CARDS_BG_ICONS.length)

    return GAME_CARDS_BG_ICONS[randomIndex]
  }, [])
  const color = useMemo(() => getHEXColor(), [])

  const isCurrentCardChoosed = game.state.choosedCardUnit?.id === card.id
  const isCardRevealAnimationStarted = isCurrentCardChoosed && confirmed

  return (
    <CardsGame.Card
      key={card.title}
      className={cn(
        'relative overflow-y-clip',
        isCurrentCardChoosed && !confirmed && ' border-dark-accent data-[hovered=true]:border-dark-accent',
        isCurrentCardChoosed && confirmed && 'data-[hovered=true]:border-none cursor-default',
      )}
      cardUnit={card}
      disableRotateAnimation={confirmed}
      disableGlareAnimation={confirmed || !isCurrentCardChoosed}
      onClick={() => {
        game.actions.chooseCard(card)

        onSelect?.(card)
      }}
    >
      <AnimatePresence>
        {isCardRevealAnimationStarted && (
          <>
            <MotionBox
              className="absolute -top-2.25 h-0.5 bg-red z-[106]"
              initial={{ y: 0 }}
              animate={{ y: 'var(--game-card-height)' }}
              transition={{ duration: 4.5 }}
              style={{ width: 'var(--game-card-width)' }}
            />
            <MotionBox
              className="absolute -top-2.75 h-1.5 bg-red/60 animate-pulse blur-sm z-[105]"
              initial={{ y: 0 }}
              animate={{ y: 'var(--game-card-height)' }}
              transition={{ duration: 4.5 }}
              style={{ width: 'var(--game-card-width)' }}
            />
          </>
        )}

        <div className="z-[106] p-2.5 bg-inherit rounded-large">
          <GameBgIcon
            width={42}
            height={42}
            style={{ color: hexToRgba(color, 0.85), stroke: hexToRgba(color, 1), strokeWidth: 0.15 }}
          />
        </div>

      </AnimatePresence>

      {/* <div
        className="absolute w-[var(--game-card-width)] h-[var(--game-card-height)] p-3"
      >
        <div
          className="w-full h-full bg-dark-foreground/15"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-dark-foreground), var(--color-yellow))',
            backgroundSize: 10,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `right`,
            maskImage: 'url("https://upload.wikimedia.org/wikipedia/commons/2/21/Speaker_Icon.svg")',
            maskRepeat: 'repeat',
            maskSize: 24,
          }}
        />
      </div> */}
    </CardsGame.Card>
  )
}

type GameCardControlsPanelProps = {
  onConfirm?: () => void
  onClose?: () => void
}

function GameCardControlsPanel(props: GameCardControlsPanelProps) {
  const { onConfirm, onClose } = props

  const auctionGame = useAuctionGameContext()
  const cardsGame = useAuctionCardsGame()

  const currentCardIndex = cardsGame.state.choosedCardUnit?.id ?? -1
  const isPossibleToSwapLeft = currentCardIndex > 1
  const isPossibleToSwapRight = currentCardIndex >= 1 && currentCardIndex < cardsGame.state.cardsUnits.length

  const swapToLeft = () => {
    if (!isPossibleToSwapLeft)
      return

    const backwardCard = cardsGame.state.cardsUnits[currentCardIndex - 2]

    cardsGame.actions.chooseCard(backwardCard)
  }

  const swapToRight = () => {
    if (!isPossibleToSwapRight)
      return

    const forwardCard = cardsGame.state.cardsUnits[currentCardIndex]

    cardsGame.actions.chooseCard(forwardCard)
  }

  const confirmChoice = async () => {
    if (!cardsGame.state.choosedCardUnit)
      return

    const response = await cardsGame.actions.confirmCardChoice(cardsGame.state.choosedCardUnit)
    if (response?.error || !response)
      return

    onConfirm?.()
  }

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring' }}
    >
      <div className="absolute inline-flex gap-x-1 items-center left-1/2 -translate-x-1/2 top-1/2 -translate-y-[var(--game-card-height)] z-[100]">
        <NumberFlow className="font-azeret-mono text-white/80" value={((currentCardIndex) ?? 0)} />
        <Text className="font-azeret-mono text-gray-accent">
          {`/${cardsGame.state.cardsUnits.length}`}
        </Text>
      </div>

      <Button
        className="absolute left-1/2 top-1/2 -translate-y-[calc(50%-var(--game-card-height))] -translate-x-[calc(50%+var(--game-card-width)/2)] z-[100] w-20"
        isIconOnly
        icon={<Icons.AltArrowLeft />}
        disabled={!isPossibleToSwapLeft || auctionGame.state.playMutationState.isLoading}
        onClick={swapToLeft}
      />
      <Button
        className="absolute top-1/2 -translate-y-[calc(50%-var(--game-card-height))] right-[calc(50%-var(--game-card-width))] z-[100]"
        isIconOnly
        icon={<Icons.AltArrowRight />}
        disabled={!isPossibleToSwapRight || auctionGame.state.playMutationState.isLoading}
        onClick={swapToRight}
      />

      <Button
        className="absolute left-1/2 -translate-x-[calc(50%-var(--game-card-width))] top-1/2 -translate-y-[var(--game-card-height)] text-gray-accent hover:text-white transition-colors z-[100]"
        icon={<Icons.LargeCross />}
        size="sm"
        isIconOnly
        disabled={auctionGame.state.playMutationState.isLoading}
        onClick={onClose}
      />

      <Button
        variant="action"
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[calc(50%-var(--game-card-height))] animate-pulse hover:animate-none z-[100]"
        icon={<Icons.LargeCross />}
        loading={auctionGame.state.playMutationState.isLoading}
        onClick={confirmChoice}
      >
        Подтвердить выбор
      </Button>
    </MotionBox>
  )
}

type GameCardSlotInfoProps = {
  card: CardsGameUnit
  onClose?: () => void
}

function GameConfirmedCardInfo(props: GameCardSlotInfoProps) {
  const { card, onClose } = props

  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const slotByCardId = useMemo(() => {
    const slotIndex = storedAuctionSlots.findIndex(slot => slot.id === card.auctionSlotId)

    return storedAuctionSlots[slotIndex]!
  }, [storedAuctionSlots, card])

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 z-[100]">
      <div className="flex flex-col gap-y-8 items-center">
        <MotionBox
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{
            duration: 0.75,
            type: 'spring',
          }}
        >
          <Title className="p-1" style={{ fontSize: 32 }}>{card.title}</Title>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: 0.5 } }}
        >
          <WinnerGameSlotInfo auctionSlot={slotByCardId} />
        </MotionBox>

        <Button
          className="absolute left-1/2 -translate-x-[calc(50%-var(--game-card-width))] top-1/2 -translate-y-[var(--game-card-height)] text-gray-accent hover:text-white transition-colors z-[100]"
          icon={<Icons.LargeCross />}
          size="sm"
          isIconOnly
          onClick={onClose}
        />
      </div>
    </div>
  )
}
