import { Input } from '@ui/Input/input'
import SliderContent from '@ui/Slider/SliderContent'
import { Icons } from '@ui/icons'

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
        <h4 className="text-body font-medium text-gray">
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
          <button className="flex h-11 items-center justify-center gap-x-1 rounded-medium bg-dark px-5 py-2.5 text-body font-medium leading-4 text-gray-accent transition-all hover:bg-opacity-70 xl:py-2.5 xl:text-body xl:leading-3">
            <Icons.Copy width={18} height={18} />
            Скопировать
          </button>
        </div>
        <div className="flex items-end justify-center gap-x-2">
          <Input
            disabled
            label={{ id: 'auctionURL', value: 'Ссылка на аукцион для гостей' }}
            placeholder="https://auction.klewik.ru/fdashfasfsafsa"
          />
          <button className="flex h-11 items-center justify-center gap-x-1 rounded-medium bg-dark px-5 py-2.5 text-body font-medium leading-4 text-gray-accent transition-all hover:bg-opacity-70 xl:py-2.5 xl:text-body xl:leading-3">
            <Icons.Copy width={18} height={18} />
            Скопировать
          </button>
        </div>
      </div>
      <button className="flex w-full items-center justify-center gap-x-1 rounded-medium bg-green py-2.5 text-body font-medium leading-4 transition-all hover:bg-opacity-70 xl:py-2.5 xl:text-body xl:leading-3">
        <Icons.LinkArrow width={21} height={21} />
        Перейти в аукцион
      </button>
    </SliderContent>
  )
}

export default SliderSuccessContent
