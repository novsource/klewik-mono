import type { WheelSlicesSizeMode } from '~entities/games/store'

import { auctionGamesActions, auctionGamesSelectors } from '~entities/games/store'

import { useAuctionWheelGame } from '~pages/dashboard/games/hooks/use-auction-wheel-game'

import { Title } from '~shared/components/typography'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { RadioCard, RadioCardDescription, RadioCardTitle, RadioGroup } from 'klewik-ui/radio'

export const RecolorWheelSlotsSection = () => {
  const { state: { isSpinning }, actions } = useAuctionWheelGame()

  return (
    <Flex direction="column">
      <Title className="text-white/80 font-medium font-golos-f mb-2.5" order={3}>Цветовая палитра</Title>
      <Button disabled={isSpinning} onClick={actions.updateWheelSlotsColors}>Изменить цвета слотов</Button>
    </Flex>
  )
}

export const WheelSlicesResizerSection = () => {
  const { slicesDisplayMode } = useStoreSelector(auctionGamesSelectors.getWheelGameSettings)
  const { setWheelGameSettings } = useActionCreators(auctionGamesActions)

  const wheelGame = useAuctionWheelGame()

  return (
    <Flex direction="column">
      <Title className="text-white/80 font-medium font-golos-f mb-2.5" order={3}>Размер слотов</Title>
      <RadioGroup
        className="w-full flex flex-col gap-y-2"
        defaultValue={slicesDisplayMode}
        value={slicesDisplayMode}
        disabled={wheelGame.state.isSpinning}
        onValueChange={value => setWheelGameSettings({ slicesDisplayMode: value as WheelSlicesSizeMode })}
      >
        <RadioCard
          slotsClassnames={{ label: 'w-full grow p-0' }}
          value="auto"
          icon={<Icons.MagicStick className="text-gray-accent" />}
        >
          <RadioCardTitle>Авто (рекомендуется)</RadioCardTitle>
          <RadioCardDescription>Автоматически определяется оптимальный режим (по очкам или соразмерные)</RadioCardDescription>
        </RadioCard>
        <RadioCard
          slotsClassnames={{ label: 'w-full grow p-0' }}
          value="points"
          icon={<Icons.Coin className="text-gray-accent" size="lg" />}
        >
          <RadioCardTitle>По очкам (не рекомендуется)</RadioCardTitle>
          <RadioCardDescription>Чем больше очков у слота, тем больше он занимает места на колесе и наоборот</RadioCardDescription>
        </RadioCard>
        <RadioCard
          slotsClassnames={{ label: 'w-full grow p-0' }}
          value="equals"
          icon={<Icons.Size className="text-gray-accent rotate-90" size="lg" />}
        >
          <RadioCardTitle>Соразмерные</RadioCardTitle>
          <RadioCardDescription>Слоты имеют одинаковый размер в независимости от количества очков (не влияет на шансы победы)</RadioCardDescription>
        </RadioCard>
      </RadioGroup>
    </Flex>
  )
}
