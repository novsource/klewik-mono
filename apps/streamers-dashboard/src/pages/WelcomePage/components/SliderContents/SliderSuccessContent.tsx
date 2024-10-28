import SliderContent from '@ui/Slider/SliderContent'
import { Icons } from '@ui/icons'
import { SliderTrigger } from '@ui/index'

const SliderSuccessContent = () => {
  return (
    <SliderContent
      className="relative flex h-full w-full flex-col gap-y-6"
      value="roles"
    >
      <SliderTrigger className="absolute -top-16 left-0" value="welcome">
        <button className="flex items-center justify-center gap-x-1 rounded-medium bg-dark px-5 py-2.5 text-body font-medium leading-4 text-gray-accent transition-all hover:bg-opacity-70 xl:py-2.5 xl:text-body xl:leading-3">
          <Icons.ReturnArrow width={21} height={21} />
          Назад
        </button>
      </SliderTrigger>

      <div className="flex flex-col gap-y-2">
        <h1 className="text-titleXL font-bold leading-5 2xl:text-[24px] 2xl:leading-7">
          Аукцион успешно создан!
        </h1>
        <h4 className="text-body font-medium text-gray">
          Скопируйте и сохраните себе номер аукциона, а также запомните пароль.
          Эти данные понадобятся для входа в аукцион в роли администратора
        </h4>
      </div>
      <button className="flex w-full items-center justify-center gap-x-1 rounded-medium bg-green py-2.5 text-body font-medium leading-4 transition-all hover:bg-opacity-70 xl:py-2.5 xl:text-body xl:leading-3">
        <Icons.Face width={21} height={21} />
        Перейти в аукцион
      </button>
    </SliderContent>
  )
}

export default SliderSuccessContent
