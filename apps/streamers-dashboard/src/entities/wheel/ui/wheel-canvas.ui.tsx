import type { ComponentPropsWithoutRef, CSSProperties } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { Flex } from 'klewik-ui/flex'

import { cn } from '~shared/utils'

import { useWheelCanvas } from '../hooks'

export type WheelCanvasProps = Omit<ComponentPropsWithoutRef<'canvas'>, 'children'> & {
  auctionSlots: AuctionSlot[]
}

export const WheelCanvas = (props: WheelCanvasProps) => {
  const { auctionSlots, style, ...restProps } = props

  const {
    state: { isSpinning, wheelSlots, rotateValue },
    meta: { wheelRef, innerRef },
  } = useWheelCanvas(auctionSlots)

  const wheelMask = `linear-gradient(
    #000,
    #000,
    transparent 0,
    #000 0px,
    #000 90%,
    transparent
  )`

  return (
    <Flex className="shrink h-full w-full" align="start" justify="center">
      <Flex
        className="relative w-full h-full"
        align="start"
        justify="center"
      >
        <WheelSelector className="absolute -top-3.5 landtop:-top-1.5 z-10 shadow-dark drop-shadow-md" />
        <div className="h-1/2! overflow-clip" style={{ maskImage: wheelMask }}>
          <canvas
            ref={wheelRef}
            style={{
              ...style,
              willChange: 'transform',
              transform: `rotateZ(${rotateValue}deg)`,
            }}
            {...restProps}
          />
          <canvas
            ref={innerRef}
            className={cn(
              'absolute top-0',
              !isSpinning
              && wheelSlots.length === 0 && 'animate-pulse duration-[4s] transition-opacity',
              wheelSlots.length === 0 && 'bg-dark-foreground animate-none',
            )}
            style={{ clipPath: 'circle(46%)' }}
          />
        </div>
      </Flex>
    </Flex>
  )
}

type WheelSelectorProps = {
  className?: string
  style?: CSSProperties
}

function WheelSelector(props: WheelSelectorProps) {
  return (
    <svg
      width="29"
      height="27"
      viewBox="0 0 29 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d_1349_452)">
        <path
          d="M4.88914 13.6067L13.0682 20.0793C13.4077 20.348 13.8815 20.3677 14.2422 20.1281L24.4204 13.3657C24.4762 13.3287 24.5097 13.2661 24.5097 13.1991V3.52985C24.5097 2.97756 24.062 2.52985 23.5097 2.52985H5.5097C4.95742 2.52985 4.5097 2.97756 4.5097 3.52985V12.8225C4.5097 13.1281 4.64948 13.417 4.88914 13.6067Z"
          fill="url(#paint0_linear_1349_452)"
        />
        <path
          d="M4.88914 13.6067L13.0682 20.0793C13.4077 20.348 13.8815 20.3677 14.2422 20.1281L24.4204 13.3657C24.4762 13.3287 24.5097 13.2661 24.5097 13.1991V3.52985C24.5097 2.97756 24.062 2.52985 23.5097 2.52985H5.5097C4.95742 2.52985 4.5097 2.97756 4.5097 3.52985V12.8225C4.5097 13.1281 4.64948 13.417 4.88914 13.6067Z"
          stroke="url(#paint1_linear_1349_452)"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_1349_452"
          x="0.00970459"
          y="0.0298462"
          width="29"
          height="26.7654"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1349_452"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1349_452"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1349_452"
          x1="4.5097"
          y1="11.5298"
          x2="24.5097"
          y2="11.5298"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#E0EAFC" />
          <stop offset="1" stop-color="#CFDEF3" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1349_452"
          x1="14.5097"
          y1="2.52985"
          x2="14.5097"
          y2="20.5298"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#1C274C" />
          <stop offset="1" />
        </linearGradient>
      </defs>
    </svg>
  )
}
