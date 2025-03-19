import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { SliderContent, SliderTrigger } from '~shared/ui/slider'
import { Typography } from '~shared/ui/typograghy'

const SliderWelcomeContent = () => {
  return (
    <SliderContent className="slider-content" value="welcome">
      <Flex className="relative gap-y-2" direction="column">
        <Icons.Logo className="text-green-accent" width={42} height={42} />
        <Typography tag="h1">Добро пожаловать в поинтовый аукцион!</Typography>
        <Typography tag="p" className="text-gray">
          Для продолжения выберите действие
        </Typography>
      </Flex>
      <Flex className="w-full gap-y-3" direction="column">
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
      </Flex>
    </SliderContent>
  )
}

export default SliderWelcomeContent
