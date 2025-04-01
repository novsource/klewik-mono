import { memo } from 'react'

import { appSelectors } from '~shared/store/slices'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Combobox } from '~shared/ui/combobox'
import { Flex } from '~shared/ui/flex'
import { NumberInput } from '~shared/ui/number-input'
import { TabsContent } from '~shared/ui/tabs'
import { Typography } from '~shared/ui/typograghy'

import { SettingsArea, SettingsAreasDivider } from '../auction-settings-area'

const AuctionTimerSettingsContent = () => {
  return (
    <TabsContent className="w-full h-full" value="timer">
      <Flex className="w-full gap-y-10" direction="column">
        <ControlTimeSettingsArea />
        <SettingsAreasDivider />
        <TimerActionsSettingsArea />
        <SettingsAreasDivider />
      </Flex>
    </TabsContent>
  )
}

const TimerActionsSettingsArea = memo(() => {
  return (
    <SettingsArea
      title="События таймера"
      description="Выберите действия, происходящие вместе с таймером"
    >
      <Flex className="h-full gap-x-4" direction="row">
        <Flex className="gap-y-2" direction="column">
          <Typography className="text-sm font-medium" tag="span">
            На старте
          </Typography>
          <Combobox
            defaultValue={'empty'}
            placeholder="Действие"
            data={[
              { label: 'Ничего', value: 'empty' },
              { label: 'Открыть ставки', value: 'openBets' },
            ]}
          />
        </Flex>
        <Flex className="gap-y-2" direction="column">
          <Typography className="text-sm font-medium" tag="span">
            По окончанию
          </Typography>
          <Combobox
            defaultValue={'empty'}
            placeholder="Действие"
            data={[
              { label: 'Ничего', value: 'empty' },
              { label: 'Закрыть ставки', value: 'closeBets' },
            ]}
          />
        </Flex>
      </Flex>
    </SettingsArea>
  )
})

const ControlTimeSettingsArea = memo(() => {
  const { addedTimeValue, decreaseTimeValue } = useStoreSelector(
    appSelectors.getTimerSettings
  )

  return (
    <SettingsArea
      title="Время таймера"
      description="Настройте подходящие вам значения"
    >
      <Flex className="w-fit gap-x-6" direction="row">
        <NumberInput
          slotClassNames={{
            base: 'max-w-[150px]',
            input: 'font-golos-f',
            label: 'text-sm font-regular',
          }}
          allowDeleteMinValue
          minValue={1}
          maxValue={120}
          label={{ id: 'initTime', value: 'Начальное время' }}
          endContent={
            <Typography className="text-gray font-golos-f" tag="span">
              сек.
            </Typography>
          }
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
          endContent={
            <Typography className="text-gray font-golos-f" tag="span">
              сек.
            </Typography>
          }
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
          endContent={
            <Typography className="text-gray font-golos-f" tag="span">
              сек.
            </Typography>
          }
        />
      </Flex>
    </SettingsArea>
  )
})

export { AuctionTimerSettingsContent }
