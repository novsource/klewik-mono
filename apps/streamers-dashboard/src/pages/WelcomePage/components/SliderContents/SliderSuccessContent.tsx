import { useStoreSelector } from '@store/hooks'
import { auctionSelectors } from '@store/slices/auction.slice'

import SliderContent from '@ui/Slider/SliderContent'
import { Icons } from '@ui/icons'
import { Button, Input, Typography } from '@ui/index'

const SliderSuccessContent = () => {
  const auctionInfo = useStoreSelector(auctionSelectors.getAuctionInfo)

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
            disabled
            label={{ id: 'auctionId', value: 'Номер аукциона' }}
            value={auctionInfo._id}
          />
          <Button startContent={<Icons.Copy width={18} height={18} />}>
            Скопировать
          </Button>
        </div>
        <div className="flex items-end justify-center gap-x-2">
          <Input
            disabled
            label={{
              id: 'auctionURL',
              value: 'Ссылка на аукцион для участников',
            }}
            value={`https://auction.klewik.ru/${auctionInfo.url}`}
          />
          <Button startContent={<Icons.Copy width={18} height={18} />}>
            Скопировать
          </Button>
        </div>
      </div>
      <a href={`/dashboard/${auctionInfo.url}`}>
        <Button
          className="w-full"
          variant={'action'}
          startContent={<Icons.LinkArrow width={18} height={18} />}
        >
          Перейти в панель управления
        </Button>
      </a>
    </SliderContent>
  )
}

export default SliderSuccessContent
