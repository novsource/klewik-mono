import { Input } from '@ui/Input/Input'
import SliderContent from '@ui/Slider/SliderContent'
import { Icons } from '@ui/icons'
import { Button } from '@ui/index'

const SliderSuccessContent = () => {
  return (
    <SliderContent
      className="relative flex h-full w-full flex-col gap-y-6"
      value="successCreate"
    >
      <div className="flex flex-col gap-y-2">
        <h1 className="text-titleXL font-bold leading-5 2xl:text-[24px] 2xl:leading-7">
          Аукцион успешно создан!
        </h1>
        <h4 className="text-md font-medium text-gray">
          Скопируйте и сохраните себе номер аукциона, а также запомните пароль.
          Эти данные понадобятся вам в дальнейшем для входа в аукцион в роли
          администратора
        </h4>
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-end justify-center gap-x-2">
          <Input
            disabled
            label={{ id: 'auctionId', value: 'Номер аукциона' }}
            placeholder="05ab06a2-ee4c-40d3-bebb-fad2a8d69202"
          />
          <Button startContent={<Icons.Copy width={18} height={18} />}>
            Скопировать
          </Button>
        </div>
        <div className="flex items-end justify-center gap-x-2">
          <Input
            disabled
            label={{ id: 'auctionURL', value: 'Ссылка на аукцион для гостей' }}
            placeholder="https://auction.klewik.ru/fdashfasfsafsa"
          />
          <Button startContent={<Icons.Copy width={18} height={18} />}>
            Скопировать
          </Button>
        </div>
      </div>
      <Button
        variant={'action'}
        startContent={<Icons.LinkArrow width={18} height={18} />}
      >
        Перейти в аукцион
      </Button>
    </SliderContent>
  )
}

export default SliderSuccessContent
