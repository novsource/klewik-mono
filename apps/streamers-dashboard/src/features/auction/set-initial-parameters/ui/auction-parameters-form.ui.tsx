import { useCallback, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { auctionSelectors } from '~entities/auction/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { toastErrorNotification } from '~shared/ui/toaster/lib'

import { cn } from '~shared/utils'

import { useSetAuctionViewParametersMutation } from '../api'
import {
  AuctionViewParametersFormSchema,
  SetAuctionViewParametersFormData,
  auctionLinks,
} from '../model'

type AuctionInitialParametersFormProps = {
  className?: string
  onSuccess?: () => void
  onError?: () => void
}

const AuctionInitialParametersForm = ({
  className,
  ...props
}: AuctionInitialParametersFormProps) => {
  const auctionId = useStoreSelector(auctionSelectors.getAuctionUUID)

  const { control, handleSubmit } = useForm<SetAuctionViewParametersFormData>({
    defaultValues: {
      title: '',
      links: {
        twitch: undefined,
        youtube: undefined,
        donationAlerts: undefined,
      },
    },
    resolver: zodResolver(AuctionViewParametersFormSchema),
  })

  const [setAuctionViewParametersMutation, { isLoading }] =
    useSetAuctionViewParametersMutation()

  const onSubmit = useCallback(
    async (formData: SetAuctionViewParametersFormData) => {
      if (isLoading) return

      try {
        await setAuctionViewParametersMutation({
          auctionId,
          parameters: formData,
        })

        props.onSuccess && props.onSuccess()
      } catch (err) {
        props.onError && props.onError()

        toastErrorNotification(
          'Не удалось добавить параметры для страницы аукциона'
        )
      }
    },
    [isLoading]
  )

  const linksFormControllers = useMemo(
    () =>
      auctionLinks.map((link) => {
        const linkInputLogoIcon = {
          twitch: <Icons.TwitchLogo size="sm" />,
          youtube: <Icons.YoutubeLogo size="sm" />,
          donationAlerts: <Icons.DonationAlerts size="sm" />,
        }[link]

        const linkInputPlaceholder = {
          twitch: 'twitch.tv/<ваш_канал>',
          youtube: 'youtube.com/<ваш_канал>',
          donationAlerts: 'donationalerts.com/r/<ваша_страница>',
        }[link]

        const linkLabelValue = {
          twitch: 'Twitch',
          youtube: 'Youtube',
          donationAlerts: 'Donation Alerts',
        }[link]

        return (
          <Controller
            key={`links.${link}`}
            control={control}
            name={`links.${link}`}
            render={({ field }) => {
              return (
                <Input
                  label={{
                    id: link,
                    value: `Ссылка на ${linkLabelValue}`,
                  }}
                  placeholder={linkInputPlaceholder}
                  startContent={linkInputLogoIcon}
                  {...field}
                />
              )
            }}
          />
        )
      }),
    [auctionLinks]
  )

  return (
    <form
      className={cn('flex w-full h-full gap-y-6 flex-col', className)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="title"
        render={({ field }) => {
          return (
            <Input
              label={{ id: 'title', value: 'Название аукциона' }}
              placeholder="Например, Мистер Бомбастик"
              {...field}
            />
          )
        }}
      />
      <Flex className="gap-y-4" direction={'column'}>
        {linksFormControllers}
      </Flex>
      <Button
        className="w-full"
        type="submit"
        variant={'action'}
        disabled={isLoading}
      >
        Сохранить и создать аукцион
      </Button>
    </form>
  )
}

export { AuctionInitialParametersForm }
