import type { CardsGameUnit } from '~entities/games/model/cards-game'
import type { Variants } from 'motion/react'

import { useEffect, useMemo, useRef, useState } from 'react'

import { CardsGame } from '~entities/games/ui/card-game/cards-game.ui'
import { getCardFieldPositionByIndex } from '~entities/games/utils/cards'
import { AnimatePresence } from 'motion/react'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { Text, Title } from '~shared/components/typography'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import type { ButtonProps } from '~shared/ui/button'
import { Button } from '~shared/ui/button'
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { MotionBox } from '~shared/ui/motion-box'

import { cn, formatNumberToIntlString, getHEXColor, hexToRgba } from '~shared/utils'

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
  initial: { opacity: 0, scale: 0.75, clipPath: `rect(0% 100% 100% 0%)` },
  open: { opacity: 1, scale: 1, transition: { duration: 1.25, type: 'spring' }, clipPath: `rect(0% 100% 100% 0%)` },
  choosed: (args: ChoosedAnimationVariantsArgs) => ({
    opacity: 1,
    scale: 1.6,
    x: args.coords.x,
    y: args.coords.y,
    transition: { duration: 1.25, type: 'spring' },
  }),
  fired: (args: ChoosedAnimationVariantsArgs) => ({
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
    const isCurrentCardChoosed = game.state.choosedCardUnit?.id === card.id

    const fieldColumnsCount = 6
    const fieldRowsCount = 5

    const fieldWidth = gameFieldContainerRef.current?.clientWidth || 0
    const fieldHeight = gameFieldContainerRef.current?.clientHeight || 0

    const cardWidth = fieldWidth / fieldColumnsCount
    const cardHeight = fieldHeight / fieldRowsCount

    const cardPosition = getCardFieldPositionByIndex(index, fieldColumnsCount)

    const initialX = cardPosition.column * cardWidth + (gameFieldContainerRef.current?.offsetLeft ?? 0)
    const initialY = cardPosition.row * cardHeight + (gameFieldContainerRef.current?.offsetTop ?? 0)

    const targetX = (document.body.clientWidth / 2) - initialX - cardWidth
    const targetY = (document.body.clientHeight / 2) - initialY - cardHeight

    // if (isChoosedCardConfirmed && isCurrentCardChoosed && !isFireCardAnimationStartedRef.current) {
    //   const startY = transform((document.body.clientHeight / 2) - (cardHeight / 2), [0, document.body.clientHeight], [0, 1])
    //   const endY = transform((document.body.clientHeight / 2) + (cardHeight / 2), [0, document.body.clientHeight], [0, 1])

    //   isFireCardAnimationStartedRef.current = true
    //   // startFireCardConfetti({ duration: 6, startY, endY })
    // }

    const animationVariant = isChoosedCardConfirmed && isCurrentCardChoosed
      ? 'fired'
      : isCurrentCardChoosed
        ? 'choosed'
        : 'open'

    return (
      <MotionBox
        className={cn(isCurrentCardChoosed && 'z-[104]')}
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
        <GameCard
          width={cardWidth}
          height={cardHeight}
          card={card}
          confirmed={isChoosedCardConfirmed}
          confirmButtonProps={{ onClick: () => setIsChoosedCardConfirmed(true) }}
        />
      </MotionBox>
    )
  }

  const isBackdropShowed = !!game.state.choosedCardUnit

  return (
    <div ref={gameFieldContainerRef} className="w-full h-full">
      <CardsGame.Field>
        {renderGameCard}
      </CardsGame.Field>

      <CardsGame.Portal>
        {isBackdropShowed && (
          <>
            <CardsGame.Backdrop />

            {isFireCardAnimationEnded && isChoosedCardConfirmed && <GameChoosedCardInfo card={game.state.choosedCardUnit!} />}

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
    </div>
  )
}

type GameCardProps = {
  card: CardsGameUnit
  confirmed?: boolean
  confirmButtonProps?: Omit<ButtonProps, 'className'>
  width: number
  height: number
}

function GameCard(props: GameCardProps) {
  const { card, confirmed = false, confirmButtonProps, width, height } = props

  const game = useAuctionCardsGame()

  const GameBgIcon = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * GAME_CARDS_BG_ICONS.length)

    return GAME_CARDS_BG_ICONS[randomIndex]
  }, [])
  const color = useMemo(() => getHEXColor(), [])

  const isCurrentCardChoosed = game.state.choosedCardUnit?.id === card.id

  const isConfirmButtonShowed = isCurrentCardChoosed && !confirmed
  const isCardFireAnimationStarted = isCurrentCardChoosed && confirmed

  return (
    <CardsGame.Card
      key={card.id}
      className={cn(
        'relative overflow-y-clip',
        isCurrentCardChoosed && !confirmed && 'bg-green-dark border-green-accent data-[hovered=true]:border-green-accent',
        confirmed && 'data-[hovered=true]:border-none cursor-default',
      )}
      cardUnit={card}
      disableAnimation={confirmed}
      onClick={() => game.actions.chooseCard(card)}
    >
      <AnimatePresence>
        {isCardFireAnimationStarted && (
          <>
            <MotionBox
              className="absolute -top-2.5 h-0.5 bg-red z-[106]"
              initial={{ y: 6 }}
              animate={{ y: height }}
              transition={{ duration: 4.5 }}
              style={{ width }}
            />
            <MotionBox
              className="absolute -top-2.75 h-1.5 bg-red/60 animate-pulse blur-sm z-[105]"
              initial={{ y: 0 }}
              animate={{ y: height }}
              transition={{ duration: 4.5 }}
              style={{ width }}
            />
          </>
        )}

        {!isCurrentCardChoosed
          && (
            <GameBgIcon
              width={42}
              height={42}
              style={{ color: hexToRgba(color, 0.85), stroke: hexToRgba(color, 1), strokeWidth: 0.15 }}
            />
          )}

        {isConfirmButtonShowed && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <Button
              className="bg-green-light text-green-accent hover:bg-green/40 hover:text-green-accent animate-pulse hover:animate-none"
              variant="ghost"
              isIconOnly
              icon={<Icons.Success />}
              size="lg"
              {...confirmButtonProps}
            />
          </MotionBox>
        )}
      </AnimatePresence>
    </CardsGame.Card>
  )
}

type GameCardSlotInfoProps = {
  card: CardsGameUnit
}

function GameChoosedCardInfo(props: GameCardSlotInfoProps) {
  const { card } = props

  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const slotByCardId = useMemo(() => {
    const slotIndex = storedAuctionSlots.findIndex(slot => slot.id === card.auctionSlotId)

    if (slotIndex === -1) {
      return null
    }

    return storedAuctionSlots[slotIndex]
  }, [storedAuctionSlots, card])

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 z-[100] overflow-clip">
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
          <Flex className="relative px-6 py-4 w-full h-full bg-dark-foreground-light rounded-medium" align="center" justify="between">
            <Flex className="gap-x-1.5" align="center">
              <Icons.Coin className="text-gray-light" size="lg" />
              <Text className="font-golos-f font-medium !text-title text-gray-accent" asSpan>
                {formatNumberToIntlString(slotByCardId?.points ?? 0)}
              </Text>
            </Flex>

            <Divider className="mx-4 h-full" orientation="vertical" />

            <Flex className="gap-x-1.5" align="center">
              <Icons.Crown className="text-gray-light" size="lg" />
              <Text className="font-golos-f font-medium !text-title text-green" asSpan>
                {`${formatNumberToIntlString(slotByCardId?.winPercents ?? 0)}%`}
              </Text>
            </Flex>
          </Flex>
        </MotionBox>
      </div>
    </div>
  )
}
