'use client'

import { useMemo } from 'react'

import { Toaster as Sonner } from 'sonner'

import { Icons } from '~components/ui/icons'


import {
  actionButtonSonnerVariants,
  baseSonnerVariants,
  cancelButtonSonnerVariants,
  contentToastSonnerVariants,
  descriptionSonnerVariants,
  titleToastSonnerVariants,
  toastSonnerVariants,
} from '../styles/sonner-variants'

type ToasterProps = React.ComponentProps<typeof Sonner>

const ToasterIcons: ToasterProps['icons'] = {
  success: <Icons.Check className="text-green-accent" />,
  warning: <Icons.Warning />,
  error: <Icons.CloseSquare />,
  info: <Icons.Info />,
}

const Toaster = ({ ...props }: ToasterProps) => {
  const slotsStyles = useMemo(() => {
    const base = baseSonnerVariants()
    const toast = toastSonnerVariants()
    const title = titleToastSonnerVariants()
    const content = contentToastSonnerVariants()
    const description = descriptionSonnerVariants()
    const actionButton = actionButtonSonnerVariants()
    const cancelButton = cancelButtonSonnerVariants()

    return {
      base,
      toast,
      title,
      content,
      description,
      actionButton,
      cancelButton,
    }
  }, [])

  return (
    <Sonner
      className={slotsStyles.base}
      pauseWhenPageIsHidden
      offset={16}
      gap={10}
      icons={ToasterIcons}
      closeButton={true}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: slotsStyles.toast,
          title: slotsStyles.title,
          content: slotsStyles.content,
          description: slotsStyles.description,
          actionButton: slotsStyles.actionButton,
          cancelButton: slotsStyles.cancelButton,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
