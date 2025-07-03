import type { UseLoginAdminFormOptions } from '../hooks/use-form'
import type { LoginAdmin } from '../model'
import type { LoginAdminStyles } from '../styles'

import type { ComponentPropsWithRef } from 'react'
import { useMemo, useState } from 'react'

import type { Control, UseFormReturn } from 'react-hook-form'
import { useController } from 'react-hook-form'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { twSlotsStyles } from '~shared/utils'

import { useLoginAdminForm } from '../hooks/use-form'
import { loginAdminStyles } from '../styles'

type ControlledLoginAdminFormProps = Omit<ComponentPropsWithRef<'form'>, 'onSubmit'> & {
  form: UseFormReturn<LoginAdmin>
  slotsClassnames?: Pick<LoginAdminStyles, 'base'>
}

export const ControlledLoginAdminForm = (props: ControlledLoginAdminFormProps) => {
  const { form, slotsClassnames, ...formProps } = props

  const styles = useMemo(() => twSlotsStyles(loginAdminStyles, slotsClassnames), [slotsClassnames])

  return (
    <form
      className={styles.base}
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

  const styles = useMemo(() => twSlotsStyles(loginAdminStyles, slotsClassnames), [slotsClassnames])

  const isSubmitButtonDisabled = Object.values(state.dirtyFields).length !== 2 || !Object.values(state.dirtyFields).every(Boolean)

  return (
    <form
      className={styles.base}
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

  const auctionUUIDController = useController({ control, name: 'auctionId' })
  const passwordController = useController({ control, name: 'password' })

  const styles = useMemo(() => twSlotsStyles(loginAdminStyles, slotsClassnames), [slotsClassnames])

  return (
    <Flex className={styles.inputsWrapper} direction="column">
      <Input
        slotClassNames={{ input: 'font-semibold tracking-wide' }}
        type="text"
        label={{ id: 'auctionUUID', value: 'Номер аукциона' }}
        placeholder="xxxxxxxx&mdash;xxxx&mdash;xxxx&mdash;xxxx&mdash;xxxxxxxxxxxx"
        startContent={
          <Icons.Id size="default" className={styles.idIcon} />
        }
        {...auctionUUIDController.field}
      />
      <Input
        type={isPasswordHidden ? 'password' : 'text'}
        label={{ id: 'password', value: 'Пароль от аукциона' }}
        placeholder="••••••••"
        startContent={
          <Icons.Key size="default" className={styles.keyIcon} />
        }
        endContent={
          isPasswordHidden
            ? (
                <Icons.EyeClosed
                  size="default"
                  className={styles.closedEyeIcon}
                  onClick={() => setIsPasswordHidden(false)}
                />
              )
            : (
                <Icons.EyeOpen
                  size="default"
                  className={styles.openEyeIcon}
                  onClick={() => setIsPasswordHidden(true)}
                />
              )
        }
        {...passwordController.field}
      />
    </Flex>
  )
}
