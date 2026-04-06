import type { CardsGameUnit } from '~entities/games/model/cards-game'

import type { ComponentPropsWithoutRef, MouseEvent } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'

import { useCardsGameContext } from '~entities/games/context/cards-game/cards-game.context'
import { transform } from 'motion'

import { mergeProps } from 'klewik-ui/utils'

import { cn } from '~shared/utils/react'

import logoSvgUrl from '../../../../shared/assets/icons/Logo.svg?url'

export type GameCardProps = ComponentPropsWithoutRef<'div'> & {
  cardUnit: CardsGameUnit
  disableRotateAnimation?: boolean
  disableGlareAnimation?: boolean
}

export const GameCard = (props: GameCardProps) => {
  const {
    className,
    cardUnit,
    disableRotateAnimation = false,
    disableGlareAnimation = false,
    children,
    ...restProps
  } = props

  const [rotateCoords, setRotateCoords] = useState({ x: 0, y: 0, z: 0 })
  const [glareCoords, setGlareCoords] = useState({ x: -100, y: -100 })

  const [isHovered, setIsHovered] = useState(false)

  const cardElementRef = useRef<HTMLDivElement>(null)

  const { state } = useCardsGameContext()

  const handleOnMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const element = cardElementRef.current

    if (!element)
      return

    const { left, top, width, height } = cardElementRef.current.getBoundingClientRect()

    const diffX = event.clientX - left
    const diffY = event.clientY - top

    const actualRotateX = transform(diffY, [0, height], [10, -10])
    const actualRotateY = transform(diffX, [0, width], [-10, 10])
    const actualRotateZ = 0

    const isShouldChangeCoords = actualRotateX !== rotateCoords.x
      || actualRotateY !== rotateCoords.y
      || actualRotateZ !== rotateCoords.z

    if (isShouldChangeCoords) {
      setRotateCoords({ x: actualRotateX, y: actualRotateY, z: 0 })

      const actualGlareX = transform(actualRotateY, [10, -10], [0, 100])
      const actualGlareY = transform(actualRotateX, [-10, 10], [0, 100])

      setGlareCoords({ x: actualGlareX, y: actualGlareY })
    }

    if (!isHovered) {
      setRotateCoords({ x: 0, y: 0, z: 0 })
      setGlareCoords({ x: 0, y: 0 })
    }
  }, [isHovered, rotateCoords])

  const isShouldRotate = isHovered && !disableRotateAnimation
  const isShouldShowGlare = isHovered && !disableGlareAnimation

  const isCurrentCardChoosed = state.choosedCardUnit?.id === cardUnit.id

  const mergedProps = useMemo(() => mergeProps<ComponentPropsWithoutRef<'div'>[]>({
    onMouseMove: handleOnMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  }, restProps), [restProps, handleOnMouseMove])

  return (
    <div
      ref={cardElementRef}
      className="relative w-full h-full cursor-pointer p-1.5 perspective-normal"
      {...mergedProps}
    >
      <div
        className={cn([
          'flex w-full h-full justify-center items-center bg-dark rounded-large border-1 transition-colors',
          'data-[candidate=true]:border-green-accent data-[candidate=true]:bg-green-dark data-[candidate=true]:animate-pulse',
        ], !isHovered && 'border-dark-light transition-all', isHovered && 'data-[hovered=true]:border-gray', className)}
        data-hovered={isHovered}
        data-choosed={isCurrentCardChoosed}
        style={{
          transform: isShouldRotate ? `rotateX(${rotateCoords.x}deg) rotateY(${rotateCoords.y}deg) rotateZ(${rotateCoords.z})` : 'none',
        }}
      >
        {children}

        {/* <div
          className="absolute inset-0 rounded-large"
          style={{
            opacity: isHovered ? 0.02 : 0,
            transition: 'opacity 0.3s ease',
            background: `
                linear-gradient(
                  120deg,
                  var(--color-green-accent)
                )
              `,
            mixBlendMode: 'color-dodge',
          }}
        /> */}

        <div
          className="absolute w-[var(--game-card-width)] h-[var(--game-card-height)] p-3 overflow-clip"
        >
          <div
            className={cn('w-full h-full', isHovered && 'bg-dark-light/10')}
            style={{
              // background: isHovered
              //   ? `radial-gradient(circle at ${glareCoords.x}% ${glareCoords.y}%,rgba(255,255,255,0.8) 0%, rgba(255,255,200,0.4) 15%,rgba(255,200,0,0.2) 25%, rgba(255,200,0,0.05) 35%,transparent 60%)`
              //   : 'none',
              background: isShouldShowGlare
                ? `radial-gradient(circle at ${glareCoords.x}% ${glareCoords.y}%,var(--color-green-accent) 0%, var(--color-green) 5%,var(--color-green-light) 10%, var(--color-green-dark) 15%,transparent 50%)`
                : 'none',
              // background: isShouldShowGlare
              //   ? `radial-gradient(circle at ${glareCoords.x}% ${glareCoords.y}%,var(--color-white) 2%, var(--color-green-accent) 15%,var(--color-green) 25% ,var(--color-green-light) 35%,transparent 50%)`
              //   : 'none',
              maskImage: `url("${logoSvgUrl}")`,
              WebkitMaskImage: `url("${logoSvgUrl}")`,
              WebkitMaskRepeat: 'repeat',
              maskRepeat: 'repeat',
              maskSize: 20,
              // mixBlendMode: 'overlay',
              mixBlendMode: 'screen',
              filter: 'blur(16px)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
