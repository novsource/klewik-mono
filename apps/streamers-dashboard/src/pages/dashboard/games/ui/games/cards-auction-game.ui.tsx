import type { CardsGameUnit } from '~entities/games/model/cards-game'
import type { Variants } from 'motion/react'

import { useEffect, useMemo, useRef, useState } from 'react'

import NumberFlow from '@number-flow/react'
import { WinnerGameSlotInfo } from '~entities/games/ui'
import { CardsGame } from '~entities/games/ui/card-game/cards-game.ui'
import { getCardFieldPositionByIndex } from '~entities/games/utils/cards'
import { AnimatePresence } from 'motion/react'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { Text, Title } from '~shared/components/typography'

import { useCssVar } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { MotionBox } from '~shared/ui/motion-box'

import { cn, getHEXColor, hexToRgba } from '~shared/utils'

import { GAME_CARDS_BG_ICONS } from '../../constants/game-cards-icons'
import { useAuctionCardsGame } from '../../hooks/use-auction-cards-game'
import { startWinnerConfetti } from '../../utils/cards-game-confetti'

type ChoosedAnimationVariantsArgs = {
  coords: {
    x: number
    y: number
  }
}

const cardsAnimationVariants: Variants = {
  initial: { position: 'relative', opacity: 0, scale: 0.75, clipPath: `rect(0% 100% 100% 0%)` },
  open: { opacity: 1, scale: 1, transition: { duration: 1.25, type: 'spring' }, clipPath: `rect(0% 100% 100% 0%)` },
  choosed: (args: ChoosedAnimationVariantsArgs) => ({
    zIndex: 104,
    opacity: 1,
    scale: 1.6,
    x: args.coords.x,
    y: args.coords.y,
    transition: { duration: 1.25, type: 'spring' },
  }),
  fired: (args: ChoosedAnimationVariantsArgs) => ({
    zIndex: 104,
    opacity: 1,
    scale: 1.6,
    x: args.coords.x,
    y: args.coords.y,
    clipPath: `rect(100% 100% 100% 0%)`,
    transition: { duration: 4.5 },
  }),
}

export const AuctionCardsGame = () => {
  const [isChoosedCardConfirmed, setIsChoosedCardConfirmed] = useState(false)
  const [isFireCardAnimationEnded, setIsFireCardAnimationEnded] = useState(true)

  const gameFieldContainerRef = useRef<HTMLDivElement>(null)
  const fireworksIntervalRef = useRef<NullablePossible<NodeJS.Timeout>>(null)

  const gameCardWidthCssVar = useCssVar('--game-card-width', '0px')
  const gameCardHeightCssVar = useCssVar('--game-card-height', '0px')

  const { queryState, ...game } = useAuctionCardsGame()

  const reset = () => {
    game.actions.clearChoosenCard()

    setIsChoosedCardConfirmed(false)
    setIsFireCardAnimationEnded(false)
  }

  useEffect(() => {
    if (!isChoosedCardConfirmed) {
      if (fireworksIntervalRef.current) {
        clearInterval(fireworksIntervalRef.current)
        fireworksIntervalRef.current = null
      }

      return
    }

    if (isFireCardAnimationEnded && isChoosedCardConfirmed) {
      fireworksIntervalRef.current = startWinnerConfetti()
    }

    return () => {
      if (fireworksIntervalRef.current) {
        clearInterval(fireworksIntervalRef.current)
      }
    }
  }, [isChoosedCardConfirmed, isFireCardAnimationEnded])

  const renderGameCard = (card: CardsGameUnit, index: number) => {
    const gameFieldContainer = gameFieldContainerRef.current

    const isCurrentCardChoosed = game.state.choosedCardUnit?.id === card.id

    const fieldColumnsCount = 6
    const fieldRowsCount = 5

    const fieldWidth = gameFieldContainer?.offsetWidth || 0
    const fieldHeight = gameFieldContainer?.offsetHeight || 0

    const cardWidth = fieldWidth / fieldColumnsCount
    const cardHeight = fieldHeight / fieldRowsCount

    const cardPosition = getCardFieldPositionByIndex(index, fieldColumnsCount)

    const cardsGap = 1
    const headerHeight = 48
    const asideWidth = 65

    const initialX = cardPosition.column * cardWidth + (cardPosition.column * cardsGap) + ((gameFieldContainer?.offsetLeft ?? 0) + asideWidth)
    const initialY = cardPosition.row * cardHeight + (cardPosition.row * cardsGap) + ((gameFieldContainer?.offsetTop ?? 0) + headerHeight)

    const targetX = (document.body.offsetWidth / 2) - initialX - cardWidth / 2
    const targetY = (document.body.offsetHeight / 2) - initialY - cardHeight / 2

    const animationVariant = isChoosedCardConfirmed && isCurrentCardChoosed
      ? 'fired'
      : isCurrentCardChoosed
        ? 'choosed'
        : 'open'

    gameCardWidthCssVar.set(`${cardWidth}px`)
    gameCardHeightCssVar.set(`${cardHeight}px`)

    return (
      <MotionBox
        variants={cardsAnimationVariants}
        initial="initial"
        animate={animationVariant}
        onAnimationComplete={(definition) => {
          if (definition !== 'fired') {
            setIsFireCardAnimationEnded(false)
          }
          else {
            setIsFireCardAnimationEnded(true)
          }
        }}
        custom={{ coords: { x: targetX, y: targetY } }}
        exit={{ opacity: 0, scale: 0 }}
      >
        <GameCard card={card} confirmed={isChoosedCardConfirmed} />
      </MotionBox>
    )
  }

  const isBackdropShowed = !!game.state.choosedCardUnit
  const isShouldShowCardInfo = isFireCardAnimationEnded && isChoosedCardConfirmed
  const isShouldShowControlsPanel = !isChoosedCardConfirmed

  return (
    <div ref={gameFieldContainerRef} className="flex w-full h-full">
      <CardsGame.Field>
        {renderGameCard}
      </CardsGame.Field>

      <CardsGame.Portal>
        {isBackdropShowed && (
          <>
            <CardsGame.Backdrop />

            {isShouldShowCardInfo && <GameChoosedCardInfo card={game.state.choosedCardUnit!} onClose={reset} />}
            {isShouldShowControlsPanel && (
              <GameCardControlsPanel
                onConfirm={() => {
                  setIsChoosedCardConfirmed(true)
                }}
                onClose={reset}
              />
            )}
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

  const isCardFireAnimationStarted = isCurrentCardChoosed && confirmed

  return (
    <CardsGame.Card
      key={card.title}
      className={cn(
        'relative overflow-y-clip',
        isCurrentCardChoosed && !confirmed && ' border-dark-accent data-[hovered=true]:border-dark-accent',
        isCurrentCardChoosed && confirmed && 'data-[hovered=true]:border-none cursor-default',
      )}
      cardUnit={card}
      disableAnimation={confirmed}
      onClick={() => {
        game.actions.chooseCard(card)

        onSelect?.(card)
      }}
    >
      <AnimatePresence>
        {isCardFireAnimationStarted && (
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

        <GameBgIcon
          width={42}
          height={42}
          style={{ color: hexToRgba(color, 0.85), stroke: hexToRgba(color, 1), strokeWidth: 0.15 }}
        />
      </AnimatePresence>
    </CardsGame.Card>
  )
}

type GameCardControlsPanelProps = {
  onConfirm?: () => void
  onClose?: () => void
}

function GameCardControlsPanel(props: GameCardControlsPanelProps) {
  const { onConfirm, onClose } = props

  const game = useAuctionCardsGame()

  const currentCardIndex = game.state.choosedCardUnit?.id ?? -1
  const isPossibleToSwapLeft = currentCardIndex > 1
  const isPossibleToSwapRight = currentCardIndex >= 1 && currentCardIndex < game.state.cardsUnits.length

  const swapToLeft = () => {
    if (!isPossibleToSwapLeft)
      return

    const backwardCard = game.state.cardsUnits[currentCardIndex - 2]

    game.actions.chooseCard(backwardCard)
  }

  const swapToRight = () => {
    if (!isPossibleToSwapRight)
      return

    const forwardCard = game.state.cardsUnits[currentCardIndex]

    game.actions.chooseCard(forwardCard)
  }

  const confirmChoice = async () => {
    if (!game.state.choosedCardUnit)
      return

    const response = await game.actions.confirmCardChoice(game.state.choosedCardUnit.auctionSlotId)
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
          {`/${game.state.cardsUnits.length}`}
        </Text>
      </div>

      <Button
        className="absolute top-1/2 -translate-y-1/2 left-[calc(50%-var(--game-card-width)-1rem)] z-[100]"
        isIconOnly
        icon={<Icons.AltArrowLeft />}
        disabled={!isPossibleToSwapLeft || game.queryState.isLoading}
        onClick={swapToLeft}
      />
      <Button
        className="absolute top-1/2 -translate-y-1/2 right-[calc(50%-var(--game-card-width)-1rem)] z-[100]"
        isIconOnly
        icon={<Icons.AltArrowRight />}
        disabled={!isPossibleToSwapRight || game.queryState.isLoading}
        onClick={swapToRight}
      />

      <Button
        className="absolute left-1/2 -translate-x-[calc(50%-var(--game-card-width))] top-1/2 -translate-y-[var(--game-card-height)] text-gray-accent hover:text-white transition-colors z-[100]"
        icon={<Icons.LargeCross />}
        size="sm"
        isIconOnly
        disabled={game.queryState.isLoading}
        onClick={onClose}
      />

      <Button
        variant="action"
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[calc(50%-var(--game-card-height))] animate-pulse hover:animate-none z-[100]"
        icon={<Icons.LargeCross />}
        size="sm"
        loading={game.queryState.isLoading}
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

function GameChoosedCardInfo(props: GameCardSlotInfoProps) {
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
