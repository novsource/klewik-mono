import type { NumberFormatValues, SourceInfo } from 'react-number-format'

import { auctionGamesActions, auctionGamesSelectors } from '~entities/games/store'

import { useAuctionWheelGame } from '~pages/dashboard/games/hooks/use-auction-wheel-game'

import { Text } from '~shared/components/typography'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Icons } from 'klewik-ui/icons'
import type { NumberInputProps } from 'klewik-ui/number-input'
import { NumberInput } from 'klewik-ui/number-input'

export type SpinTimeInputProps = NumberInputProps

export const SpinTimeInput = (props: SpinTimeInputProps) => {
  const { onValueChange, ...restProps } = props

  const { spinTime } = useStoreSelector(auctionGamesSelectors.getWheelGameSettings)
  const { setWheelGameSettings } = useActionCreators(auctionGamesActions)

  const { state: { isSpinning } } = useAuctionWheelGame()

  const handleOnValueChange = (values: NumberFormatValues, sourceInfo: SourceInfo) => {
    if (isSpinning)
      return

    const { floatValue } = values

    setWheelGameSettings({ spinTime: floatValue ?? 0 })
    onValueChange?.(values, sourceInfo)
  }

  return (
    <NumberInput
      slotClassNames={{
        base: 'max-w-[140px]',
        input: 'font-golos-f text-title placeholder:text-md',
      }}
      disabled={isSpinning}
      startContent={
        <Icons.Timer size="sm" className="text-gray-light shrink-0" />
      }
      endContent={(
        <Text className="text-gray-light" asSpan>
          сек.
        </Text>
      )}
      value={spinTime}
      placeholder="Время"
      onValueChange={handleOnValueChange}
      {...restProps}
    />
  )
}
