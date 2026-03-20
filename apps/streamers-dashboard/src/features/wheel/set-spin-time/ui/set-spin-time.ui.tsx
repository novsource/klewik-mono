import type { NumberFormatValues, SourceInfo } from 'react-number-format'

import { wheelActions, wheelSelectors } from '~entities/wheel/store'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Icons } from '~shared/ui/icons'
import type { NumberInputProps } from '~shared/ui/number-input'
import { NumberInput } from '~shared/ui/number-input'
import { Typography } from '~shared/ui/typograghy'

type SpinTimeInputProps = NumberInputProps

const SpinTimeInput = (props: SpinTimeInputProps) => {
  const { onValueChange, ...restProps } = props

  const isWheelSpinning = useStoreSelector(wheelSelectors.getIsWheelSpinning)
  const { spinTime } = useStoreSelector(wheelSelectors.getSettings)

  const { setSettings } = useActionCreators(wheelActions)

  const handleOnValueChange = (values: NumberFormatValues, sourceInfo: SourceInfo) => {
    if (isWheelSpinning)
      return

    const { floatValue } = values

    setSettings({ spinTime: floatValue ?? 0 })
    onValueChange?.(values, sourceInfo)
  }

  return (
    <NumberInput
      slotClassNames={{
        base: 'max-w-[140px]',
        input: 'font-golos-f text-title placeholder:text-md',
      }}
      disabled={isWheelSpinning}
      startContent={
        <Icons.Timer size="sm" className="text-gray-light shrink-0" />
      }
      endContent={(
        <Typography className="text-gray-light" tag="span">
          сек.
        </Typography>
      )}
      value={spinTime}
      placeholder="Время"
      onValueChange={handleOnValueChange}
      {...restProps}
    />
  )
}

export { SpinTimeInput }
