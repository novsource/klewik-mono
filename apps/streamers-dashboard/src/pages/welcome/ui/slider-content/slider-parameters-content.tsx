import { AuctionInitialParametersForm } from '~features/auction/set-initial-parameters/ui'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import {
  SliderContent,
  SliderTrigger,
  useSliderContext,
} from '~shared/ui/slider'
import { Typography } from '~shared/ui/typograghy'

export const SliderAuctionParametersContent = () => {
  const {
    func: { setSelectedKey },
  } = useSliderContext()

  return (
    <SliderContent className="slider-content" value="parameters">
      <SliderTrigger value="successCreate">
        <Button>Пропустить этот шаг</Button>
      </SliderTrigger>
      <Flex className="gap-y-2" direction="column">
        <Typography tag="h1">
          Настройки данных страницы аукциона для гостей
        </Typography>
        <Typography tag="p" className="text-gray">
          Здесь вы можете настроить название аукциона, которое будет
          отображаться на сайте для гостей (участников) аукциона
        </Typography>
        <Typography tag="p" className="text-gray">
          Также вы можете добавить ссылки на стриминговые платформы где будет
          проводиться трансляция аукциона (на данный момент доступен Twitch и
          Youtube)
        </Typography>
      </Flex>

      <AuctionInitialParametersForm
        onSuccess={() => setSelectedKey('successCreate')}
      />
    </SliderContent>
  )
}
