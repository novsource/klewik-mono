import { useRef } from 'react'

import { auctionSelectors } from '~entities/auction/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { useCopyToClipboard } from '~shared/hooks/use-copy-to-clipboard'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { SliderContent } from '~shared/ui/slider'
import { toastSuccessNotification } from '~shared/ui/toaster/lib'
import { Typography } from '~shared/ui/typograghy'

const SliderSuccessContent = () => {
  const auctionInfo = useStoreSelector(auctionSelectors.getAuctionInfo)

  const inputNumberRef = useRef<HTMLInputElement>(null)
  const inputURLRef = useRef<HTMLInputElement>(null)

  const { copyToClipboard } = useCopyToClipboard()

  return (
    <SliderContent
      className="relative flex h-full w-full flex-col gap-y-6"
      value="successCreate"
    >
      <div className="flex flex-col gap-y-2">
        <Typography tag="h1">Аукцион успешно создан!</Typography>
        <Typography tag="p" className="text-gray">
          Скопируйте и сохраните себе номер аукциона, а также запомните пароль.
          Эти данные понадобятся вам в дальнейшем для входа в аукцион в роли
          администратора
        </Typography>
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-end justify-center gap-x-2">
          <Input
            ref={inputNumberRef}
            disabled
            slotClassNames={{ base: 'w-full' }}
            label={{ id: 'auctionId', value: 'Номер аукциона' }}
            value={auctionInfo.id}
          />
          <Button
            onClick={() => {
              copyToClipboard(inputNumberRef.current?.value || '')
              toastSuccessNotification('Номер аукциона скопирован в буфер')
            }}
            startContent={<Icons.Copy size="default" />}
          >
            Скопировать
          </Button>
        </div>
        <div className="flex items-end justify-center gap-x-2">
          <Input
            ref={inputURLRef}
            disabled
            slotClassNames={{ base: 'w-full' }}
            label={{
              id: 'auctionURL',
              value: 'Ссылка на аукцион для участников',
            }}
            value={`https://auction.klewik.ru/${auctionInfo.url}`}
          />
          <Button
            onClick={() => {
              copyToClipboard(inputURLRef.current?.value || '')
              toastSuccessNotification('Ссылка на аукцион скопирована в буфер')
            }}
            startContent={<Icons.Copy size="default" />}
          >
            Скопировать
          </Button>
        </div>
      </div>
      <a href={`/dashboard/${auctionInfo.url}`}>
        <Button
          className="w-full"
          variant={'action'}
          startContent={<Icons.LinkArrow size="default" />}
        >
          Перейти в панель управления
        </Button>
      </a>
    </SliderContent>
  )
}

export default SliderSuccessContent
