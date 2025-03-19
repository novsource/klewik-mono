import { CreateAuctionForm } from '~features/auction/create-auction/ui/create-auction-form'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import {
  SliderContent,
  SliderTrigger,
  useSliderContext,
} from '~shared/ui/slider'
import { Typography } from '~shared/ui/typograghy'

const SliderCreateContent = () => {
  const {
    func: { setSelectedKey },
  } = useSliderContext()

  return (
    <SliderContent className="slider-content" value="create">
      <SliderTrigger className="" value="welcome">
        <Button startContent={<Icons.ReturnArrow />}>Назад</Button>
      </SliderTrigger>

      <div className="flex flex-col gap-y-2">
        <Typography tag="h1">Создание нового аукциона</Typography>
        <Typography tag="p" className="text-gray font-golosF">
          Для продолжения введите выданный вам мастер-ключ. Позже он также будет
          использоваться вами для входа в аукцион в роли администратора. После
          ввода нажмите кнопку "Создать"
        </Typography>
        <CreateAuctionForm onSuccess={() => setSelectedKey('parameters')} />
      </div>
    </SliderContent>
  )
}

export default SliderCreateContent
