import { useEffect } from 'react'

import { useWheelGameContext } from '~entities/wheel/context'
import { CanvasWheelOfFortune } from '~entities/wheel/ui/canvas-wheel-of-fortune.ui'

import { usePrevious } from '~shared/hooks'

import { useAuctionGameContext } from '../../context/auction-game-context'

// export const LocalWheelOfFortuneGame = () => {
//   const auctionGameContext = useAuctionGameContext()
//   const wheelGame = useWheelGameContext()

//   const previousWheelSpinStatus = usePrevious(wheelGame.state.isSpinning)

//   useEffect(() => {
//     if (previousWheelSpinStatus && !wheelGame.state.isSpinning) {
//       auctionGameContext.actions.applyResults()
//     }
//   }, [previousWheelSpinStatus, auctionGameContext.actions, wheelGame.state.isSpinning])

//   return <WheelFortune wheelGame={wheelGame} />
// }
export const LocalWheelOfFortuneGame = () => {
  const auctionGameContext = useAuctionGameContext()
  const wheelGame = useWheelGameContext()

  const previousWheelSpinStatus = usePrevious(wheelGame.state.isSpinning)

  useEffect(() => {
    if (previousWheelSpinStatus && !wheelGame.state.isSpinning) {
      auctionGameContext.actions.applyResults()
    }
  }, [previousWheelSpinStatus, auctionGameContext.actions, wheelGame.state.isSpinning])

  return <CanvasWheelOfFortune wheel={wheelGame} />
}
