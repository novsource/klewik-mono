import { memo } from 'react'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { appSelectors } from '~shared/store/slices'

import { Flex } from '~shared/ui/flex'
import { TabsContent } from '~shared/ui/tabs'
import { TimeInput } from '~shared/ui/time-input'

import { SettingsArea, SettingsAreasDivider } from '../auction-settings-area'

const ControlTimeSettingsArea = memo(() => {
  const { addedTimeValue, decreaseTimeValue } = useStoreSelector(
    appSelectors.getTimerSettings,
  )

  return (
    <SettingsArea
      title="Время таймера"
      description="Настройте подходящие вам значения"
    >
      <Flex className="w-fit gap-x-6" direction="row">
        <TimeInput />
        {/* <NumberInput
          slotClassNames={{
            base: 'max-w-[150px]',
            input: 'font-golos-f',
            label: 'text-sm font-regular',
          }}
          allowDeleteMinValue
          minValue={1}
          maxValue={120}
          label={{ id: 'initTime', value: 'Начальное время' }}
          endContent={(
            <Typography className="text-gray font-golos-f" tag="span">
              сек.
            </Typography>
          )}
        />
        <NumberInput
          slotClassNames={{
            base: 'max-w-[120px]',
            input: 'font-golos-f',
            label: 'text-sm font-regular',
          }}
          placeholder="1-120"
          allowDeleteMinValue
          minValue={1}
          defaultValue={addedTimeValue}
          maxValue={120}
          label={{ id: 'addValue', value: 'Добавлять' }}
          endContent={(
            <Typography className="text-gray font-golos-f" tag="span">
              сек.
            </Typography>
          )}
        />
        <NumberInput
          slotClassNames={{
            base: 'max-w-[120px]',
            input: 'font-golos-f',
            label: 'text-sm',
          }}
          placeholder="1-120"
          allowDeleteMinValue
          minValue={1}
          defaultValue={decreaseTimeValue}
          maxValue={120}
          label={{ id: 'decrValue', value: 'Отнимать' }}
          endContent={(
            <Typography className="text-gray font-golos-f" tag="span">
              сек.
            </Typography>
          )}
        /> */}
      </Flex>
    </SettingsArea>
  )
})

const AuctionTimerSettingsContent = () => {
  return (
    <TabsContent className="w-full h-full" value="timer">
      <Flex className="w-full gap-y-10" direction="column">
        <ControlTimeSettingsArea />
        <SettingsAreasDivider />
      </Flex>
    </TabsContent>
  )
}

export { AuctionTimerSettingsContent }
