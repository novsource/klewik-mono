import type { CardsGameUnit } from '~entities/games/model/cards-game'

import { useMemo, useRef, useState } from 'react'

import { getCardLayoutPositionByIndex } from '~entities/games/utils/cards'

import type { StateRef } from '~shared/hooks'
import { useCssVar, useRefState, useResizeObserver } from '~shared/hooks'

const DEFAULT_LAYOUT_ROWS_COUNT = 5
const DEFAULT_LAYOUT_COLUMNS_COUNT = 6

type CardsLayoutInfoCollectionItem = {
  width: number
  height: number
  position: {
    row: number
    column: number
  }
  initialCoords: {
    x: number
    y: number
  }
}

export type UseCardsGameLayoutReturnValue = {
  ref: StateRef<HTMLDivElement>
  cardsLayoutInfo: Map<number, CardsLayoutInfoCollectionItem>
  getCardLayoutInfo: (cardId: number) => Maybe<CardsLayoutInfoCollectionItem>
}

export type UseCardsGameLayoutOptions = {
  rows: number
  columns: number
}

export const useCardsGameLayout = (cards: CardsGameUnit[], options?: UseCardsGameLayoutOptions): UseCardsGameLayoutReturnValue => {
  const [layoutParameters, setLayoutParameters] = useState({
    width: 0,
    height: 0,
    offsetLeft: 0,
    offsetTop: 0,
  })

  const optionsRef = useRef(options)
  optionsRef.current = options

  const gameLayoutRef = useRefState<HTMLDivElement>()

  const gameCardWidthCssVar = useCssVar('--game-card-width', '0px')
  const gameCardHeightCssVar = useCssVar('--game-card-height', '0px')

  useResizeObserver(gameLayoutRef, {
    onChange: (entry) => {
      const [entries] = entry

      const actualWidth = entries.contentRect.width
      const actualHeight = entries.contentRect.height

      if (actualWidth !== layoutParameters.width || actualHeight !== layoutParameters.height) {
        setLayoutParameters({
          width: actualWidth,
          height: actualHeight,
          offsetLeft: gameLayoutRef.current.offsetLeft,
          offsetTop: gameLayoutRef.current.offsetTop,
        })
      }
    },
  })

  const cardsLayoutGapCssVar = useCssVar('--cards-layout-gap', '1px')
  const headerHeightCssVar = useCssVar('--header-height')
  const asideWidthCssVar = useCssVar('--aside-width')

  const cardsLayoutInfo = useMemo(() => {
    const layoutInfoCollection = new Map<number, CardsLayoutInfoCollectionItem>()

    if (!layoutParameters.height || !layoutParameters.width)
      return layoutInfoCollection

    const { width: layoutWidth, height: layoutHeight, offsetLeft: layoutOffsetLeft, offsetTop: layoutOffsetTop } = layoutParameters

    const fieldRowsCount = optionsRef.current?.rows ?? DEFAULT_LAYOUT_ROWS_COUNT
    const fieldColumnsCount = optionsRef.current?.columns ?? DEFAULT_LAYOUT_COLUMNS_COUNT

    const cardWidth = layoutWidth / fieldColumnsCount
    const cardHeight = layoutHeight / fieldRowsCount

    const cardsGap = Number(cardsLayoutGapCssVar.value.slice(0, 1))
    const asideWidth = Number(asideWidthCssVar.value.slice(0, 2))
    const headerHeight = Number(headerHeightCssVar.value.slice(0, 2))

    cards.forEach((card, index) => {
      const cardPosition = getCardLayoutPositionByIndex(index, fieldColumnsCount)

      const initialX = cardPosition.column * cardWidth + (cardPosition.column * cardsGap) + (layoutOffsetLeft + asideWidth)
      const initialY = cardPosition.row * cardHeight + (cardPosition.row * cardsGap) + (layoutOffsetTop + headerHeight)

      const cardLayoutInfo: CardsLayoutInfoCollectionItem = {
        position: cardPosition,
        width: cardWidth,
        height: cardHeight,
        initialCoords: {
          x: initialX,
          y: initialY,
        },
      }

      layoutInfoCollection.set(card.id, cardLayoutInfo)
    })

    gameCardWidthCssVar.set(`${cardWidth}px`)
    gameCardHeightCssVar.set(`${cardHeight}px`)

    return layoutInfoCollection
  }, [cards, layoutParameters, headerHeightCssVar.value, asideWidthCssVar.value, cardsLayoutGapCssVar.value])

  const getCardLayoutInfo = (cardId: number) => cardsLayoutInfo.get(cardId)

  return { ref: gameLayoutRef, cardsLayoutInfo, getCardLayoutInfo }
}
