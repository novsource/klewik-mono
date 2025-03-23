import { useCallback } from 'react'

import { wheelActions, wheelSelectors } from '~entities/wheel/store'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Icons } from '~shared/ui/icons'
import { NumberInput, NumberInputProps } from '~shared/ui/number-input'
import { Typography } from '~shared/ui/typograghy'

type SpinTimeInputProps = NumberInputProps

const SpinTimeInput = ({ onNumberChanges, ...props }: SpinTimeInputProps) => {
  const isWheelSpinning = useStoreSelector(wheelSelectors.getIsWheelSpinning)

  const { setSettings } = useActionCreators(wheelActions)

  const onNumberChangesHandler = useCallback(
    (num: number | undefined) => {
      setSettings({ spinTime: num ?? 0 })

      onNumberChanges && onNumberChanges(num)
    },
    [onNumberChanges]
  )

  return (
    <NumberInput
      slotClassNames={{
        base: 'max-w-[140px]',
        input: 'font-golos-f text-title placeholder:text-md',
      }}
      disabled={isWheelSpinning}
      minValue={2}
      maxValue={120}
      startContent={
        <Icons.Timer size="sm" className="text-gray-light shrink-0" />
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
