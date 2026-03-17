import { useWheelGameContext } from '~entities/wheel/context'

import { useAuctionGameContext } from '../context/auction-game-context'

export const useAuctionWheelGame = () => {
  const auctionGameContext = useAuctionGameContext()
  const wheel = useWheelGameContext()

  const confirmSpin = async (slotId: number) => auctionGameContext.actions.play(slotId)

  return { state: wheel.state, actions: { ...wheel.actions, confirmSpin }, meta: wheel.meta }
}
