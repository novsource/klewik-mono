import { ExternalToast, toast } from 'sonner'

import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

export const toastBaseNotification = (
  description: string,
  toastOptions?: ExternalToast
) => {
  return toast('Уведомление', { description, ...toastOptions })
}

export const toastSuccessNotification = (
  operationName: string,
  toastOptions?: ExternalToast
) => {
  const successDescription = (
    <div className="w-full flex items-center gap-x-1">
      <div className="flex items-center justify-center h-5 w-5 bg-green/30 rounded-md">
        <Icons.Success className="text-green" size="xs" />
      </div>
      <Typography className="text-sm text-green font-medium" tag="p">
        Успешно
      </Typography>
    </div>
  )
  return toast(operationName, {
    description: successDescription,
    classNames: { content: 'gap-y-2' },
    ...toastOptions,
  })
}

export const toastErrorNotification = (
  operationName: string,
  reason: string,
  toastOptions?: ExternalToast
) => {
  const errorDescription = (
    <div className="w-full flex flex-col gap-y-2">
      <Typography className="text-sm" tag="p">
        Причина: {reason}
      </Typography>
      <div className="w-full flex items-center gap-x-1">
        <div className="flex items-center justify-center h-5 w-5 bg-red/30 rounded-md">
          <Icons.Close className="text-red" size="default" />
        </div>
        <Typography className="text-sm text-red font-medium" tag="p">
          Ошибка
        </Typography>
      </div>
    </div>
  )

  return toast(operationName, {
    description: errorDescription,
    duration: 10000,
    ...toastOptions,
  })
}
