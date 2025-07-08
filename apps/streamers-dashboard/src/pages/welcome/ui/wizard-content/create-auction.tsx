import { WELCOME_PAGE_WIZARD_ITEMS_IDS } from '~pages/welcome/constants'

import { CreateAuctionForm } from '~features/auction/create-auction/ui'

import { auctionActions } from '~entities/auction/store'

import { loginInAuction } from '~shared/api/http/auth'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { toastErrorNotification, toastSuccessNotification } from '~shared/ui/toaster/lib'
import { Typography } from '~shared/ui/typograghy'
import type { WizardItemProps } from '~shared/ui/wizard'
import { WizardItem, WizardTrigger } from '~shared/ui/wizard'
import { useWizardContext } from '~shared/ui/wizard/context'

import { cn } from '~shared/utils'

const WizardCreateAuctionItem = (
  props: Omit<WizardItemProps, 'value' | 'children'>,
) => {
  const { className, ...restProps } = props

  const { next } = useWizardContext()

  const { setAuction } = useActionCreators(auctionActions)

  return (
    <WizardItem
      value={WELCOME_PAGE_WIZARD_ITEMS_IDS.CREATE_AUCTION}
      className={cn('flex flex-col gap-y-6')}
      {...restProps}
    >
      <WizardTrigger type="back">
        <Button startContent={<Icons.Undo size="sm" />} size="sm">Назад</Button>
      </WizardTrigger>

      <Flex className="gap-y-2" direction="column">
        <Typography tag="h1">Создание нового аукциона</Typography>
        <Typography tag="p" className="text-gray">
          Для продолжения введите выданный вам мастер-ключ. Позже он также будет
          использоваться вами для входа в аукцион в роли администратора. После
          ввода нажмите кнопку "Создать"
        </Typography>
        <CreateAuctionForm
          onSuccess={({ auctionUUID, auctionOwnerId, url }) => {
            loginInAuction(auctionUUID, '3cac8f81-128b-4e5c-aa6d-a3fd25e3c50b').then(() => {
              setAuction({
                ownerId: auctionOwnerId,
                auctionUUID,
                url,
              })

              toastSuccessNotification('Аукцион успешно создан!')
              next(WELCOME_PAGE_WIZARD_ITEMS_IDS.AUCTION_PARAMETERS)
            }).catch((_) => {
              toastErrorNotification('Аукцион был создан, однако произошла ошибка входа в аукцион. Попробуйте еще раз')
            })
          }}
        />
      </Flex>
    </WizardItem>
  )
}

export { WizardCreateAuctionItem }
