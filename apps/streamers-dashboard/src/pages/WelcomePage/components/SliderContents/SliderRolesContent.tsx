import SliderContent from '@ui/Slider/SliderContent'
import { Icons } from '@ui/icons'
import { Button, SliderTrigger } from '@ui/index'

const SliderRolesContent = () => {
  return (
    <SliderContent
      className="relative flex h-full w-full flex-col gap-y-6"
      value="roles"
    >
      <SliderTrigger className="absolute -top-16 left-0" value="welcome">
        <Button startContent={<Icons.ReturnArrow width={21} height={21} />}>
          Назад
        </Button>
      </SliderTrigger>

      <div className="flex flex-col gap-y-2">
        <h1 className="text-titleXL font-bold leading-5 2xl:text-[24px] 2xl:leading-7">
          Вы хотите войти в аукцион как гость или как администратор аукциона?
        </h1>
        <h4 className="text-body font-medium text-gray">
          Для продолжения выберите роль
        </h4>
      </div>
      <div className="flex w-full flex-col gap-y-3">
        <SliderTrigger className="w-full" value="guest">
          <Button
            className="w-full"
            startContent={<Icons.Face width={21} height={21} />}
            variant={'action'}
          >
            Я гость
          </Button>
        </SliderTrigger>
        <SliderTrigger className="w-full" value="admin">
          <Button
            className="w-full"
            startContent={<Icons.Crown width={21} height={21} />}
          >
            Я администратор
          </Button>
        </SliderTrigger>
      </div>
    </SliderContent>
  )
}

export default SliderRolesContent
