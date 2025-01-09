import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { SliderContent, SliderTrigger } from '~shared/ui/slider'
import { Typography } from '~shared/ui/typograghy'

export const SliderGuestContent = () => {
  return (
    <SliderContent
      className="relative flex h-full w-full flex-col gap-y-6"
      value="guest"
    >
      <SliderTrigger className="absolute -top-16 left-0" value="roles">
        <Button startContent={<Icons.ReturnArrow size="default" />}>
          Назад
        </Button>
      </SliderTrigger>

      <div className="flex flex-col gap-y-2">
        <Typography tag="h1">Просмотр аукциона в качестве гостя</Typography>
        <Typography tag="p" className="text-gray">
          Введите в поле номер аукциона и нажмите кнопку "Войти"
        </Typography>
      </div>
      <div className="flex w-full flex-col gap-y-3">
        <Input
          startContent={<Icons.Id className="text-gray-accent" size="sm" />}
          placeholder="Номер аукциона"
        />
        <Button variant={'action'}>Войти</Button>
      </div>
    </SliderContent>
  )
}
