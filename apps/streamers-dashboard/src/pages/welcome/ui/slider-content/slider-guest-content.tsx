import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { SliderContent, SliderTrigger } from '~shared/ui/slider'
import { Typography } from '~shared/ui/typograghy'

export const SliderGuestContent = () => {
  return (
    <SliderContent className="slider-content" value="guest">
      <SliderTrigger value="roles">
        <Button startContent={<Icons.ReturnArrow size="default" />}>
          Назад
        </Button>
      </SliderTrigger>

      <Flex className="gap-y-2" direction="column">
        <Typography tag="h1">Просмотр аукциона в качестве гостя</Typography>
        <Typography tag="p" className="text-gray">
          Введите в поле номер аукциона и нажмите кнопку "Войти"
        </Typography>
      </Flex>
      <Flex className="w-full gap-y-3">
        <Input
          startContent={<Icons.Id className="text-gray-accent" size="sm" />}
          placeholder="Номер аукциона"
        />
        <Button variant={'action'}>Войти</Button>
      </Flex>
    </SliderContent>
  )
}
