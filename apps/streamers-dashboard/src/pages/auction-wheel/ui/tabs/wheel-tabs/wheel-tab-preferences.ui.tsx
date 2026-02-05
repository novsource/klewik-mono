import { useMemo } from 'react'

import { TABS_CONTENT_NAMES } from '~pages/auction-wheel/constants'
import { preferencesWheelTabStyles } from '~pages/auction-wheel/styles'
import type { PreferencesWheelTabSlots } from '~pages/auction-wheel/styles'

import { auctionSlotsActions, auctionSlotsSelectors } from '~entities/auction-slot/store'

import { wheelActions, wheelSelectors } from '~entities/wheel/store'
import type { WheelSlicesSizeMode } from '~entities/wheel/store/wheel-slice'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { RadioCard, RadioCardDescription, RadioCardTitle, RadioGroup } from '~shared/ui/radio'
import { TabsContent } from '~shared/ui/tabs'
import type { TabsContentProps } from '~shared/ui/tabs'
import { Typography } from '~shared/ui/typograghy'

import { cn, getHEXColor, twSlotsStyles } from '~shared/utils'

type SlotsWheelTabProps = Omit<TabsContentProps, 'value'> & {
  slotsClassnames?: Partial<Record<PreferencesWheelTabSlots, string>>
}

export const GamePreferencesTabContent = (props: SlotsWheelTabProps) => {
  const { slotsClassnames, ...tabsContentProps } = props

  const tabsContentStyles = useMemo(() =>
    twSlotsStyles(preferencesWheelTabStyles, slotsClassnames), [slotsClassnames])

  return (
    <TabsContent
      className={cn(tabsContentStyles.content)}
      value={TABS_CONTENT_NAMES.PREFERENCES}
      {...tabsContentProps}
    >
      <SlicesResizerSection />
      <Divider className="mt-2.5 mb-3 border-gray/20" />
      <RecolorWheelSlotsSection />
    </TabsContent>
  )
}

function RecolorWheelSlotsSection() {
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
      <Typography className="text-white/80 font-medium font-golos-f mb-2.5" tag="h3">Цветовая палитра</Typography>
      <Button onClick={changeSlotsColors}>Изменить цвета слотов</Button>
    </Flex>
  )
}

function SlicesResizerSection() {
  const { sizeMode } = useStoreSelector(wheelSelectors.getSettings)
  const isWheelSpinning = useStoreSelector(wheelSelectors.getIsWheelSpinning)

  const { setSliceMode } = useActionCreators(wheelActions)

  return (
    <Flex direction="column">
      <Typography className="text-white/80 font-medium font-golos-f mb-2.5" tag="h3">Размер слотов</Typography>
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
