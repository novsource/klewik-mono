import { WELCOME_PAGE_WIZARD_ITEMS_IDS } from '~pages/welcome/constants'

import { AuctionInitialParametersForm } from '~features/auction/set-initial-parameters/ui'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Typography } from '~shared/ui/typograghy'
import type { WizardItemProps } from '~shared/ui/wizard'
import { WizardItem, WizardTrigger } from '~shared/ui/wizard'
import { useWizardContext } from '~shared/ui/wizard/context'

import { cn } from '~shared/utils'

const WizardAuctionParametersItem = (
  props: Omit<WizardItemProps, 'value' | 'children'>,
) => {
  const { className, ...restProps } = props

  const { next, getNodesById } = useWizardContext()

  const nextIds = getNodesById(WELCOME_PAGE_WIZARD_ITEMS_IDS.AUCTION_PARAMETERS)

  return (
    <WizardItem
      value={WELCOME_PAGE_WIZARD_ITEMS_IDS.AUCTION_PARAMETERS}
      className={cn('w-full h-full', className)}
      {...restProps}
    >
      <Flex className="h-full w-full gap-y-4" direction="column">
        <WizardTrigger type="next" nextStepId={nextIds ? nextIds[0] : ''}>
          <Button size="sm">Пропустить этот шаг</Button>
        </WizardTrigger>
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
          onSuccess={() => next(nextIds ? nextIds[0] : '')}
        />
      </Flex>

    </WizardItem>
  )
}

export { WizardAuctionParametersItem }
