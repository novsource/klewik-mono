import type { SetAuctionViewParametersFormData } from '../model'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import type { UseFormReturn } from 'react-hook-form'
import { FormProvider, useController, useFormContext } from 'react-hook-form'

import type { ButtonProps } from 'klewik-ui/button'
import { Button } from 'klewik-ui/button'
import { Icons } from 'klewik-ui/icons'
import type { InputProps } from 'klewik-ui/input'
import { Input } from 'klewik-ui/input'

type AuctionInitialParametersFormProps = ComponentPropsWithoutRef<'form'> & {
  form: UseFormReturn<SetAuctionViewParametersFormData>
  children: ReactNode
}

export const AuctionInitialParametersFormComposer = (props: AuctionInitialParametersFormProps) => {
  const { form, children, ...restProps } = props

  return (
    <FormProvider {...form}>
      <form {...restProps}>{ children }</form>
    </FormProvider>
  )
}

AuctionInitialParametersFormComposer.AuctionTitleField = AuctionTitleFormField
AuctionInitialParametersFormComposer.SubmitButton = AuctionInitialParametersFormSubmitButton

function AuctionTitleFormField(props: InputProps) {
  const { control } = useFormContext<SetAuctionViewParametersFormData>()

  const { field } = useController<SetAuctionViewParametersFormData, 'title'>({ control, name: 'title' })

  return (
    <Input
      label={{
        id: 'titleInputField',
        value: 'Название аукциона',
      }}
      placeholder="Например: Мистер Бомбастик"
      {...field}
      {...props}
    />
  )
}

// type BaseFormLinkInputFieldProps = InputProps & {
//   platform: typeof auctionInitialDetailsFormLinks[number]
// }

// const platformLinkInputLogoIcon = {
//   twitch: <Icons.TwitchLogo size="sm" />,
//   youtube: <Icons.YoutubeLogo size="sm" />,
//   donationAlerts: <Icons.DonationAlerts size="sm" />,
// } as const

// const platformLinkInputPlaceholder = {
//   twitch: 'twitch.tv/<ваш_канал>',
//   youtube: 'youtube.com/<ваш_канал>',
//   donationAlerts: 'donationalerts.com/r/<ваша_страница>',
// } as const

// const platformLinkLabelValue = {
//   twitch: 'Twitch',
//   youtube: 'Youtube',
//   donationAlerts: 'Donation Alerts',
// } as const

// function BaseFormLinkInputField(props: BaseFormLinkInputFieldProps) {
//   const { platform, ...inputProps } = props

//   const { control } = useFormContext<SetAuctionViewParametersFormData>()

//   const { field } = useController<SetAuctionViewParametersFormData, `links.${typeof auctionInitialDetailsFormLinks[number]}`>({ control, name: `links.${platform}` })

//   return (
//     <Input
//       key={platform}
//       label={{
//         id: `${platform}InputField`,
//         value: platformLinkLabelValue[platform],
//       }}
//       placeholder={platformLinkInputPlaceholder[platform]}
//       startContent={platformLinkInputLogoIcon[platform]}
//       {...inputProps}
//       {...field}
//     />
//   )
// }

function AuctionInitialParametersFormSubmitButton(props: ButtonProps) {
  const { formState } = useFormContext<SetAuctionViewParametersFormData>()

  const isButtonDisabled = !formState.isDirty || !formState.isValid || formState.isLoading
  const isShouldShowLoader = formState.isLoading

  return (
    <Button
      type="submit"
      variant="action"
      disabled={isButtonDisabled}
      startContent={isShouldShowLoader && <Icons.Loading />}
      {...props}
    />
  )
}
