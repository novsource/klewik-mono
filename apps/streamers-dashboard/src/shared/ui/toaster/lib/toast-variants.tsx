import { ExternalToast, toast } from 'sonner'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

export const toastBaseNotification = (
  description: string,
  toastOptions?: ExternalToast
) => {
  return toast('Уведомление', { description, ...toastOptions })
}

export const toastPromiseNotification = <T extends unknown = unknown>(
  promise: Promise<T>,
  operationName: string,
  toastOptions?: ExternalToast & {
    successText: string
    errorText: string
    onSuccess?: (value: T) => void
    onError?: () => void
  }
) => {
  const successDescription = (
    <div className="w-full flex flex-col items-start gap-y-2">
      <Typography className="text-sm" tag="span">
        {toastOptions?.successText}
      </Typography>
      <div className="flex w-full items-center gap-x-1">
        <div className="flex items-center justify-center h-5 w-5 bg-green/30 rounded-md">
          <Icons.Success className="text-green" size="xs" />
        </div>
        <Typography className="text-sm text-green font-medium" tag="p">
          Успешно
        </Typography>
      </div>
    </div>
  )

  const errorDescription = (
    <Flex className="w-full">
      <Flex className="w-full gap-y-2" direction="column">
        <Typography className="text-sm" tag="span">
          {toastOptions?.errorText}
        </Typography>
        <div className="flex w-full items-center gap-x-1">
          <div className="flex items-center justify-center h-5 w-5 bg-red/30 rounded-md">
            <Icons.Close className="text-red" size="xs" />
          </div>
          <Typography className="text-sm text-red font-medium" tag="p">
            Ошибка
          </Typography>
        </div>
      </Flex>
    </Flex>
  )

  return toast.promise<T>(promise, {
    loading: operationName,
    success: (value) => {
      if (toastOptions?.onSuccess) {
        toastOptions.onSuccess(value)
      }
      return successDescription
    },
    error: () => {
      if (toastOptions?.onError) {
        toastOptions.onError()
      }
      return errorDescription
    },
    classNames: {
      toast: 'flex flex-row rounded-sm gap-x-1 group-[.toaster]:rounded-medium',
    },
    ...toastOptions,
  })
}

export const toastSuccessNotification = (
  operationName: string,
  toastOptions?: ExternalToast
) => {
  const successDescription = (
    <Flex className="w-full gap-x-1" align="center">
      <div className="flex items-center justify-center h-5 w-5 bg-green/30 rounded-md">
        <Icons.Success className="text-green" size="xs" />
      </div>
      <Flex align="center" justify="center">
        <Typography className="text-sm text-green font-medium" tag="p">
          Успешно
        </Typography>
      </Flex>
    </Flex>
  )
  return toast(operationName, {
    description: successDescription,
    classNames: { content: 'gap-y-3' },
    ...toastOptions,
  })
}

export const toastErrorNotification = (
  operationName: string,
  reason?: string,
  toastOptions?: ExternalToast
) => {
  const errorDescription = (
    <div className="w-full flex flex-col gap-y-2">
      {reason && (
        <Typography className="text-sm" tag="p">
          Причина: {reason}
        </Typography>
      )}
      <div className="w-full flex items-center gap-x-1">
        <div className="flex items-center justify-center h-4 w-4 bg-red/30 rounded-md">
          <Icons.Close className="text-red" size="sm" />
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
