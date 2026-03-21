import type { UseLoginAdminFormOptions } from '../hooks/use-form'
import type { LoginAdmin } from '../model'
import type { LoginAdminStyles } from '../styles'

import type { ComponentPropsWithRef } from 'react'
import { useMemo, useState } from 'react'

import type { Control, UseFormReturn } from 'react-hook-form'
import { useController } from 'react-hook-form'

import { Button } from 'klewik-ui/button'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { Input } from 'klewik-ui/input'

import { twSlotsStyles } from '~shared/utils'

import { useLoginAdminForm } from '../hooks/use-form'
import { loginAdminStyles } from '../styles'

type ControlledLoginAdminFormProps = Omit<ComponentPropsWithRef<'form'>, 'onSubmit'> & {
  form: UseFormReturn<LoginAdmin>
  slotsClassnames?: Pick<LoginAdminStyles, 'base'>
}

export const ControlledLoginAdminForm = (props: ControlledLoginAdminFormProps) => {
  const { form, slotsClassnames, ...formProps } = props

  const classesSlots = useMemo(() => twSlotsStyles(loginAdminStyles, slotsClassnames), [slotsClassnames])

  return (
    <form
      className={classesSlots.base}
      {...formProps}
    >
      <LoginAdminFormFields control={form.control} />
    </form>
  )
}

type LoginAdminFormProps = Omit<ComponentPropsWithRef<'form'>, 'onSubmit' | 'className' | 'onError'> & UseLoginAdminFormOptions & {
  slotsClassnames?: Pick<LoginAdminStyles, 'base'>
}

export const LoginAdminForm = (props: LoginAdminFormProps) => {
  const { slotsClassnames, onSuccess, onError, ...formProps } = props

  const { form, state, submitForm } = useLoginAdminForm({ onSuccess, onError })

  const classesSlots = useMemo(() => twSlotsStyles(loginAdminStyles, slotsClassnames), [slotsClassnames])

  const isSubmitButtonDisabled = Object.values(state.dirtyFields).length !== 2 || !Object.values(state.dirtyFields).every(Boolean)

  return (
    <form
      className={classesSlots.base}
      onSubmit={form.handleSubmit(submitForm)}
      {...formProps}
    >
      <LoginAdminFormFields control={form.control} />
      <Button variant="action" type="submit" disabled={isSubmitButtonDisabled}>
        Войти
      </Button>
    </form>
  )
}

type LoginAdminFormFieldsProps = {
  control: Control<LoginAdmin>
  slotsClassnames?: LoginAdminStyles
}

function LoginAdminFormFields({ control, slotsClassnames }: LoginAdminFormFieldsProps) {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)

  const auctionUUIDController = useController({ control, name: 'auctionUUID' })
  const passwordController = useController({ control, name: 'password' })

  const classesSlots = useMemo(() => twSlotsStyles(loginAdminStyles, slotsClassnames), [slotsClassnames])

  return (
    <Flex className={classesSlots.inputsWrapper} direction="column">
      <Input
        label={{ id: 'auctionUUID', value: 'Номер аукциона' }}
        placeholder="xxxxxxxx&mdash;xxxx&mdash;xxxx&mdash;xxxx&mdash;xxxxxxxxxxxx"
        startContent={
          <Icons.Id size="default" className={classesSlots.idIcon} />
        }
        {...auctionUUIDController.field}
      />
      <Input
        type={isPasswordHidden ? 'password' : 'text'}
        slotClassNames={{
          endContent: 'pointer-events-auto',
        }}
        label={{ id: 'password', value: 'Пароль от аукциона' }}
        placeholder="••••••••"
        startContent={
          <Icons.Key className={classesSlots.keyIcon} />
        }
        endContent={
          isPasswordHidden
            ? (
              <Icons.EyeClosed
                size="default"
                className={classesSlots.closedEyeIcon}
                onClick={() => setIsPasswordHidden(false)}
              />
            )
            : (
              <Icons.EyeOpen
                size="default"
                className={classesSlots.openEyeIcon}
                onClick={() => setIsPasswordHidden(true)}
              />
            )
        }
        {...passwordController.field}
      />
    </Flex>
  )
}
