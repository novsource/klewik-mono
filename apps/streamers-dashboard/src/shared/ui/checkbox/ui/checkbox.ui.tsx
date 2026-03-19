import type { ComponentPropsWithoutRef } from 'react'
import { useMemo } from 'react'

import { Checkbox as PrimitiveCheckbox } from '@base-ui/react/checkbox'
import { CheckIcon } from 'lucide-react'

import { cn } from '~shared/utils/react'

import { checkboxIndicatorVariants, checkboxRootVariants } from '../styles/checkbox.variants'

export type CheckboxProps
  = ExtractComponentClassnameToSlot<PrimitiveCheckbox.Indicator.Props, 'indicator'>
    & ExtractComponentClassnameToSlot<Omit<PrimitiveCheckbox.Root.Props, 'children'>, 'root', 'rootProps'>
    & ExtractComponentClassnameToSlot<Omit<ComponentPropsWithoutRef<'label'>, 'children'>, 'label', 'labelProps'>
    & {
      labelText?: string
    }

export const Checkbox = (props: CheckboxProps) => {
  const { rootProps, slotClassnames, labelText, ...indicatorProps } = props

  const classes = useMemo(() => ({
    root: checkboxRootVariants({ className: slotClassnames?.root }),
    indicator: checkboxIndicatorVariants({ className: slotClassnames?.indicator }),
    label: cn('flex items-center gap-2 text-md', slotClassnames?.label),
  }), [slotClassnames])

  return (
    <label className={classes.label}>
      <PrimitiveCheckbox.Root className={classes.root} {...rootProps}>
        <PrimitiveCheckbox.Indicator className={classes.indicator} {...indicatorProps}>
          <CheckIcon className="size-3" />
        </PrimitiveCheckbox.Indicator>
      </PrimitiveCheckbox.Root>
      {labelText}
    </label>
  )
}
