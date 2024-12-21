import { useMemo } from 'react'

import { useTheme } from 'next-themes'
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
  const { theme = 'dark' } = useTheme()

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
      theme={theme as ToasterProps['theme']}
      className={slotsStyles.base}
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
