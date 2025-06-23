import type { UseCreateAuctionFormListeners } from '../hooks'

import type { ComponentPropsWithRef } from 'react'
import { useState } from 'react'

import { Controller } from 'react-hook-form'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { cn } from '~shared/utils'

import { useCreateAuctionForm } from '../hooks'

type CreateAuctionFormProps = ComponentPropsWithRef<'form'> & UseCreateAuctionFormListeners

export const CreateAuctionForm = (props: CreateAuctionFormProps) => {
  const { onSuccess, onError, className, ...formProps } = props

  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true)

  const { form: { control, handleSubmit }, state: { errors }, submitForm, queryState: { isLoading } } = useCreateAuctionForm()

  return (
    <form
      className={cn('flex w-full flex-col gap-y-3', className)}
      onSubmit={handleSubmit(submitForm)}
      {...formProps}
    >
      <Controller
        control={control}
        name="key"
        render={({ field }) => (
          <Input
            type={isPasswordHidden ? 'password' : 'text'}
            label={{
              id: 'password',
              value: 'Мастер-ключ',
            }}
            errorMessage={errors.key?.message}
            placeholder="••••••••"
            endContent={
              isPasswordHidden
                ? (
                    <Icons.EyeClosed
                      className="cursor-pointer select-none text-gray transition-colors hover:text-gray-light"
                      size="default"
                      onClick={() => setIsPasswordHidden(false)}
                    />
                  )
                : (
                    <Icons.EyeOpen
                      className="cursor-pointer select-none text-gray transition-colors hover:text-gray-light"
                      size="default"
                      onClick={() => setIsPasswordHidden(true)}
                    />
                  )
            }
            {...field}
          />
        )}
      />

      <Button
        className={cn(isLoading && 'opacity-70 hover:bg-opacity-100')}
        variant="action"
        type={isLoading ? 'button' : 'submit'}
        disabled={isLoading}
      >
        {isLoading ? 'Создаем аукцион...' : 'Создать'}
      </Button>
    </form>
  )
}
