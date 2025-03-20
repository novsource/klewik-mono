import {
  CSSProperties,
  ComponentPropsWithoutRef,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'

import { useWheelControl, useWheelInit } from '~widgets/wheel/utils'
import {
  getItemsWithAngles,
  updateSlotsAnglesByRotateValue,
} from '~widgets/wheel/utils/wheel-canvas'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { WheelEventsBus } from '~entities/wheel/events'
import { WheelSlot } from '~entities/wheel/model'
import {
  wheelActions as storeWheelActions,
  wheelSelectors,
} from '~entities/wheel/store'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex } from '~shared/ui/flex'

type WheelCanvasProps = Omit<ComponentPropsWithoutRef<'canvas'>, 'children'>

const WheelCanvas = (props: WheelCanvasProps) => {
  const { spinTime } = useStoreSelector(wheelSelectors.getSettings)
  const storedSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const wheelActions = useActionCreators(storeWheelActions)

  const wheelWrapperRef = useRef<HTMLDivElement>(null)

  const {
    refs: { wheelRef, innerRef },
    functions: { drawWheel, drawInner, resizeInnerBackground, resizeWheel },
  } = useWheelInit(storedSlots, { isFullScreen: false })

  const {
    state: { wheelRotateCSSValue, selectorTargetTitle, isWheelSpinning },
    functions: { spinWheel },
  } = useWheelControl(getItemsWithAngles(storedSlots), {
    wheelRef,
  })

  useLayoutEffect(() => {
    drawWheel()

    const resizeWheelCb = resizeWheel()

    return () => {
      resizeWheelCb()
    }
  }, [drawWheel, resizeWheel])

  useLayoutEffect(() => {
    drawInner()
    resizeInnerBackground()
  }, [drawInner, resizeInnerBackground])

  useEffect(() => {
    wheelActions.setSelectorTitleName(
      selectorTargetTitle || 'Ожидание прокрутки колеса...'
    )
  }, [selectorTargetTitle])

  useEffect(() => {
    const slotsWithActualAngles = updateSlotsAnglesByRotateValue(
      getItemsWithAngles(storedSlots),
      wheelRotateCSSValue
    )

    wheelActions.setSlots(slotsWithActualAngles)
  }, [wheelRotateCSSValue])

  useEffect(() => {
    const callback = (winner: WheelSlot) => {
      spinWheel(winner, spinTime)
    }

    const spinEventUnsubcribe = WheelEventsBus.getInstance().subscribe(
      'spin',
      callback
    )

    return () => {
      spinEventUnsubcribe()
    }
  }, [spinWheel])

  useEffect(() => {
    wheelActions.setIsWheelSpinning(isWheelSpinning)
  }, [isWheelSpinning])

  return (
    <Flex className="shrink h-full w-full" align="center" justify="center">
      <Flex
        className="relative w-full h-full"
        ref={wheelWrapperRef}
        align="start"
        justify="center"
      >
        <WheelSelector className="absolute -top-3.5 landtop:-top-1.5 z-10 shadow-dark drop-shadow-md" />
        <canvas ref={wheelRef} {...props} />
        <canvas
          ref={innerRef}
          className="absolute top-0"
          style={{ clipPath: 'circle(46%)' }}
        />
      </Flex>
    </Flex>
  )
}

export { WheelCanvas }

type WheelSelectorProps = {
  className?: string
  style?: CSSProperties
}

const WheelSelector = (props: WheelSelectorProps) => {
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
