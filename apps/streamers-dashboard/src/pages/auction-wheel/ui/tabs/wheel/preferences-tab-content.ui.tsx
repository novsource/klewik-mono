import type { WheelSlicesSizeMode } from '~entities/games/store'

import { auctionSlotsActions, auctionSlotsSelectors } from '~entities/auction-slot/store'

import { wheelActions, wheelSelectors } from '~entities/wheel/store'

import { Title } from '~shared/components/typography'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { RadioCard, RadioCardDescription, RadioCardTitle, RadioGroup } from '~shared/ui/radio'

import { getHEXColor } from '~shared/utils'

export const RecolorWheelSlotsSection = () => {
  const storedSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  const changeSlotsColors = () => {
    storedSlots.forEach((slot) => {
      const randomHexColor = getHEXColor()
      updateSlot({ id: slot.id, data: { color: randomHexColor } })
    })
  }

  return (
    <Flex direction="column">
      <Title className="text-white/80 font-medium font-golos-f mb-2.5" order={3}>Цветовая палитра</Title>
      <Button onClick={changeSlotsColors}>Изменить цвета слотов</Button>
    </Flex>
  )
}

export const WheelSlicesResizerSection = () => {
  const { sizeMode } = useStoreSelector(wheelSelectors.getSettings)
  const isWheelSpinning = useStoreSelector(wheelSelectors.getIsWheelSpinning)

  const { setSliceMode } = useActionCreators(wheelActions)

  return (
    <Flex direction="column">
      <Title className="text-white/80 font-medium font-golos-f mb-2.5" order={3}>Размер слотов</Title>
      <RadioGroup
        className="w-full flex flex-col gap-y-2"
        defaultValue={sizeMode}
        value={sizeMode}
        disabled={isWheelSpinning}
        onValueChange={value => setSliceMode(value as WheelSlicesSizeMode)}
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
