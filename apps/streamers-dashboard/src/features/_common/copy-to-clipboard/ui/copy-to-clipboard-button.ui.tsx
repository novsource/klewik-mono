import { useCopyToClipboard } from '~shared/hooks/use-copy-to-clipboard'

import { Button } from '~shared/ui/button'
import type { ButtonProps } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'

import { cn, mergeProps } from '~shared/utils'

export type CopyToClipboardButtonProps = ButtonProps & {
  value: string
}

export const CopyToClipboardButton = (props: CopyToClipboardButtonProps) => {
  const { value, className, ...restProps } = props

  const { copyToClipboard } = useCopyToClipboard()

  const handleOnClick = () => {
    copyToClipboard(value)
  }

  const mergedProps = mergeProps(restProps, {
    onClick: handleOnClick,
  })

  return (
    <Button
      className={cn('text-gray-light hover:text-gray-accent', className)}
      variant="ghost"
      isIconOnly
      icon={<Icons.Copy size="sm" />}
      {...mergedProps}
    />
  )
}
