import SliderContent from '@ui/Slider/SliderContent'
import { Icons } from '@ui/icons'
import { SliderTrigger } from '@ui/index'

const SliderWelcomeContent = () => {
  return (
    <SliderContent className="flex flex-col gap-y-6" value="welcome">
      <div className="flex flex-col gap-y-2">
        <Icons.Logo width={46} height={46} />
        <h1 className="text-titleXL font-bold leading-6 2xl:text-[24px] 2xl:leading-7">
          Добро пожаловать в поинтовый аукцион!
        </h1>
        <h4 className="text-body font-medium text-gray">
          Для продолжения выберите действие
        </h4>
      </div>
      <div className="flex w-full flex-col gap-y-3">
        <SliderTrigger className="w-full" value="roles">
          <button className="flex w-full items-center justify-center gap-x-1 rounded-medium bg-green py-2.5 text-body font-medium leading-4 transition-all hover:bg-opacity-70 xl:py-2.5 xl:text-body xl:leading-3">
            <Icons.Login width={21} height={21} />
            Войти в аукцион
          </button>
        </SliderTrigger>
        <SliderTrigger className="w-full" value="create">
          <button className="flex w-full items-center justify-center gap-x-1 rounded-medium bg-dark py-2.5 text-body font-medium leading-4 text-gray-accent transition-all hover:bg-opacity-70 xl:py-2.5 xl:text-body xl:leading-3">
            <Icons.Plus width={21} height={21} />
            Создать аукцион
          </button>
        </SliderTrigger>
      </div>
    </SliderContent>
  )
}

export default SliderWelcomeContent
