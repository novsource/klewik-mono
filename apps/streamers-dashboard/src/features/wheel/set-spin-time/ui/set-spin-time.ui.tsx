import { useCallback } from 'react'

import { wheelActions, wheelSelectors } from '~entities/wheel/store'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Icons } from '~shared/ui/icons'
import { NumberInput, NumberInputProps } from '~shared/ui/number-input'
import { Typography } from '~shared/ui/typograghy'

type SpinTimeInputProps = NumberInputProps

const SpinTimeInput = ({ onNumberChanges, ...props }: SpinTimeInputProps) => {
  const { spinTime } = useStoreSelector(wheelSelectors.getSettings)
  const isWheelSpinning = useStoreSelector(wheelSelectors.getIsWheelSpinning)

  const { setSettings } = useActionCreators(wheelActions)

  const onNumberChangesHandler = useCallback(
    (num: number | undefined) => {
      setSettings({ spinTime: num ?? 0 })

      onNumberChanges && onNumberChanges(num)
    },
    [onNumberChanges]
  )

  console.log(spinTime)

  return (
    <NumberInput
      slotClassNames={{
        base: 'max-w-[200px]',
        input: 'font-golos-f text-title',
      }}
      disabled={isWheelSpinning}
      minValue={2}
      maxValue={120}
      startContent={
        <Icons.Timer width={28} height={28} className="text-gray-light" />
      }
      endContent={
        <Typography className="text-gray-light" tag="span">
          сек.
        </Typography>
      }
      placeholder="Время"
      onNumberChanges={onNumberChangesHandler}
      {...props}
    />
  )
}

export { SpinTimeInput }
