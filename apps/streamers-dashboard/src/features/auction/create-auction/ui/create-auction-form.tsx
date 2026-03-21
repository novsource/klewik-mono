import type { UseCreateAuctionFormListeners } from '../hooks'

import type { ComponentPropsWithRef } from 'react'
import { useState } from 'react'

import { Controller } from 'react-hook-form'

import { Button } from 'klewik-ui/button'
import { Icons } from 'klewik-ui/icons'
import { Input } from 'klewik-ui/input'

import { cn } from '~shared/utils'

import { useCreateAuctionForm } from '../hooks'

export type CreateAuctionFormProps = ComponentPropsWithRef<'form'> & UseCreateAuctionFormListeners

export const CreateAuctionForm = (props: CreateAuctionFormProps) => {
  const { onSuccess, onError, className, ...formProps } = props

  const [isPasswordHidden, setIsPasswordHidden] = useState(true)

  const {
    form: { control, handleSubmit },
    state: { errors, isDirty, isValid },
    submitForm,
    queryState: { isLoading },
  }
    = useCreateAuctionForm({ onSuccess, onError })

  const isSubmitButtonShouldBeBlocked = isLoading || !isDirty || !isValid

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
            slotClassNames={{ wrapper: 'pr-0.5' }}
            label={{
              id: 'password',
              value: 'Мастер-ключ',
            }}
            errorMessage={errors.key?.message}
            placeholder="••••••••"
            startContent={<Icons.Key className="text-gray-accent" />}
            endContent={(
              <Button
                className="pointer-events-auto"
                variant="ghost"
                isIconOnly
                type="button"
                icon={(
                  isPasswordHidden
                    ? (
                        <Icons.EyeClosed
                          className="cursor-pointer select-none text-gray transition-colors hover:text-gray-light"
                          size="default"
                        />
                      )
                    : (
                        <Icons.EyeOpen
                          className="cursor-pointer select-none text-gray transition-colors hover:text-gray-light"
                          size="default"
                        />
                      )
                )}
                onClick={() => setIsPasswordHidden(curr => !curr)}
              />
            )}
            {...field}
          />
        )}
      />

      <Button
        className={cn(isLoading && 'opacity-70 hover:bg-opacity-100')}
        variant="action"
        type={isLoading ? 'button' : 'submit'}
        disabled={isSubmitButtonShouldBeBlocked}
      >
        {isLoading ? 'Создаем аукцион...' : 'Создать'}
      </Button>
    </form>
  )
}
