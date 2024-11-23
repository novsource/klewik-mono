import SliderContent from '@ui/Slider/SliderContent'
import { Icons } from '@ui/icons'
import { Button, SliderTrigger } from '@ui/index'

const SliderWelcomeContent = () => {
  return (
    <SliderContent className="relative flex flex-col gap-y-6" value="welcome">
      <div className="flex flex-col gap-y-2">
        <Icons.Logo
          className="absolute -top-16 left-0"
          width={46}
          height={46}
        />
        <h1 className="text-titleXL font-bold leading-6 2xl:text-[24px] 2xl:leading-7">
          Добро пожаловать в поинтовый аукцион!
        </h1>
        <h4 className="text-body font-medium text-gray">
          Для продолжения выберите действие
        </h4>
      </div>
      <div className="flex w-full flex-col gap-y-3">
        <SliderTrigger className="w-full" value="roles">
          <Button
            className="w-full"
            variant="action"
            startContent={<Icons.Login width={21} height={21} />}
          >
            Войти в аукцион
          </Button>
        </SliderTrigger>
        <SliderTrigger className="w-full" value="create">
          <Button
            className="w-full"
            startContent={<Icons.Plus width={21} height={21} />}
          >
            Создать аукцион
          </Button>
        </SliderTrigger>
      </div>
    </SliderContent>
  )
}

export default SliderWelcomeContent
