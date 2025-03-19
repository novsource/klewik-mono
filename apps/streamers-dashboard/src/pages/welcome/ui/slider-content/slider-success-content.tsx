import { useRef } from 'react'
import { Link } from 'react-router-dom'

import { auctionSelectors } from '~entities/auction/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { useCopyToClipboard } from '~shared/hooks/use-copy-to-clipboard'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
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
    <SliderContent className="slider-content" value="successCreate">
      <Flex className="gap-y-2" direction="column">
        <Typography tag="h1">Аукцион успешно создан!</Typography>
        <Typography tag="p" className="text-gray">
          Скопируйте и сохраните себе номер аукциона, а также запомните пароль.
          Эти данные понадобятся вам в дальнейшем для входа в аукцион в роли
          администратора
        </Typography>
      </Flex>
      <Flex className="gap-y-4" direction="column">
        <Flex className="gap-x-2" align="end" justify="center">
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
        </Flex>
        <Flex className="gap-x-2" align="end" justify="end">
          <Input
            ref={inputURLRef}
            disabled
            slotClassNames={{ base: 'w-full' }}
            label={{
              id: 'auctionURL',
              value: 'Ссылка на аукцион для участников',
            }}
            value={auctionInfo.url}
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
        </Flex>
      </Flex>
      <Link to={`/dashboard/${auctionInfo.url?.split('/').at(-1)}`}>
        <Button
          className="w-full"
          variant={'action'}
          startContent={<Icons.LinkArrow size="default" />}
        >
          Перейти в панель управления
        </Button>
      </Link>
    </SliderContent>
  )
}

export default SliderSuccessContent
