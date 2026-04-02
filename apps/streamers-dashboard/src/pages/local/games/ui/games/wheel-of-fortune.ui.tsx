import { useWheelGameContext } from '~entities/wheel/context'
import { WheelFortune } from '~entities/wheel/ui'

export const LocalWheelOfFortuneGame = () => {
  const wheelGame = useWheelGameContext()

  return <WheelFortune wheelGame={wheelGame} />
}
