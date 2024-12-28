import { useMemo } from 'react'

import { Toaster as Sonner } from 'sonner'

import { descriptionVariants } from '~shared/ui/input/styles/input-variants'

import {
  actionButtonSonnerVariants,
  baseSonnerVariants,
  cancelButtonSonnerVariants,
  toastSonnerVariants,
} from '../styles/sonner-variants'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const slotsStyles = useMemo(() => {
    const base = baseSonnerVariants()
    const toast = toastSonnerVariants()
    const descripiton = descriptionVariants()
    const actionButton = actionButtonSonnerVariants()
    const cancelButton = cancelButtonSonnerVariants()

    return {
      base,
      toast,
      descripiton,
      actionButton,
      cancelButton,
    }
  }, [])

  return (
    <Sonner
      className={slotsStyles.base}
      pauseWhenPageIsHidden
      offset={16}
      style={{}}
      toastOptions={{
        classNames: {
          toast: slotsStyles.toast,
          description: slotsStyles.descripiton,
          actionButton: slotsStyles.actionButton,
          cancelButton: slotsStyles.cancelButton,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
