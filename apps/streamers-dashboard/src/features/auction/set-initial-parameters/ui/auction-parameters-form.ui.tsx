import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { appSelectors } from '~shared/store/slices'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { toastErrorNotification } from '~shared/ui/toaster/lib'

import { setAuctionViewParameters } from '../api'
import {
  AuctionViewParametersFormSchema,
  SetAuctionViewParametersFormData,
  auctionLinks,
} from '../model'

type AuctionInitialParametersFormProps = {
  onSuccess?: () => void
  onError?: () => void
}

const AuctionInitialParametersForm = (
  props: AuctionInitialParametersFormProps
) => {
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

  const auctionId = useStoreSelector(appSelectors.getAuctionId)
  const [isPending, setIsPending] = useState(false)

  const requestCtrlRef = useRef(new AbortController())

  useEffect(() => {
    return () => {
      if (isPending) requestCtrlRef.current.abort()
    }
  }, [])

  const onSubmit = useCallback(
    async (formData: SetAuctionViewParametersFormData) => {
      if (isPending) return

      try {
        setIsPending(true)

        const request = await setAuctionViewParameters(
          auctionId,
          formData,
          requestCtrlRef.current.signal
        )

        if (request.status === 200) {
          setIsPending(false)

          props.onSuccess && props.onSuccess()
        }

        if (request.status !== 200) {
          setIsPending(false)

          props.onError && props.onError()

          toastErrorNotification(
            'Не удалось добавить параметры для страницы аукциона'
          )
        }
      } catch (err) {}
    },
    [isPending]
  )

  const linksFormControllers = auctionLinks.map((link) => {
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
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col w-full h-full gap-y-6">
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
        <div className="flex flex-col gap-y-4">{linksFormControllers}</div>
        <Button
          className="w-full"
          type="submit"
          variant={'action'}
          disabled={isPending}
        >
          Сохранить и создать аукцион
        </Button>
      </div>
    </form>
  )
}

export { AuctionInitialParametersForm }
