import type { UseCardsGameReturnValue } from '~entities/games/hooks/cards-game'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { CardsGameContextProvider } from '~entities/games/context/cards-game/cards-game.context'

import { cn } from '~shared/utils'

import { GameCard } from './cards-game-item.ui'
import { CardsGameLayout } from './cards-game-layout.ui'

export type CardsGameProps = {
  game: UseCardsGameReturnValue
  children: ReactNode
}

export const CardsGame = (props: CardsGameProps) => {
  const { game, ...restProps } = props

  return (
    <CardsGameContextProvider cardGame={game} {...restProps} />
  )
}

CardsGame.Field = CardsGameLayout
CardsGame.Card = GameCard
CardsGame.Backdrop = GameBackdrop
CardsGame.Portal = GameBackdropPortal

type GameBackdropPortalProps = {
  children: ReactNode
}

function GameBackdropPortal(props: GameBackdropPortalProps) {
  if (!props.children)
    return null

  return createPortal(props.children, document.body)
}

type GameBackdropProps = ComponentPropsWithoutRef<'div'>

function GameBackdrop(props: GameBackdropProps) {
  const { className, ...restProps } = props

  return (
    <div
      className={cn('fixed w-full h-full top-0 left-0 bg-black opacity-85 z-[100] select-none', className)}
      {...restProps}
    />
  )
}
