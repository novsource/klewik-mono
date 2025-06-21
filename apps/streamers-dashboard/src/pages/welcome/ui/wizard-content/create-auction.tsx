import { WELCOME_PAGE_WIZARD_ITEMS_IDS } from '~pages/welcome/constants'

import { CreateAuctionForm } from '~features/auction/create-auction/ui/create-auction-form'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'
import { WizardItem, WizardItemProps, WizardTrigger } from '~shared/ui/wizard'
import { useWizardContext } from '~shared/ui/wizard/context'

import { cn } from '~shared/utils'

const WizardCreateAuctionItem = (
  props: Omit<WizardItemProps, 'value' | 'children'>
) => {
  const { className, ...restProps } = props

  const { next } = useWizardContext()

  return (
    <WizardItem
      value={WELCOME_PAGE_WIZARD_ITEMS_IDS.CREATE_AUCTION}
      className={cn(className)}
      {...restProps}
    >
      <WizardTrigger type="back">
        <Button startContent={<Icons.ReturnArrow />}>Назад</Button>
      </WizardTrigger>

      <Flex className="gap-y-2" direction="column">
        <Typography tag="h1">Создание нового аукциона</Typography>
        <Typography tag="p" className="text-gray">
          Для продолжения введите выданный вам мастер-ключ. Позже он также будет
          использоваться вами для входа в аукцион в роли администратора. После
          ввода нажмите кнопку "Создать"
        </Typography>
        <CreateAuctionForm
          onSuccess={() =>
            next(WELCOME_PAGE_WIZARD_ITEMS_IDS.AUCTION_PARAMETERS)
          }
        />
      </Flex>
    </WizardItem>
  )
}

export { WizardCreateAuctionItem }
