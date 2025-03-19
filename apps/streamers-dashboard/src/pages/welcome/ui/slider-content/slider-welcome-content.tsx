import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { SliderContent, SliderTrigger } from '~shared/ui/slider'
import { Typography } from '~shared/ui/typograghy'

const SliderWelcomeContent = () => {
  return (
    <SliderContent className="slider-content" value="welcome">
      <div className="relative flex flex-col gap-y-2">
        <Icons.Logo className="text-green-accent" width={42} height={42} />
        <Typography tag="h1">Добро пожаловать в поинтовый аукцион!</Typography>
        <Typography tag="p" className="text-gray">
          Для продолжения выберите действие
        </Typography>
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
