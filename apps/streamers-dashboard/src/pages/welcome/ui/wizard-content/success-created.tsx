import { useRef } from 'react'

import { Link } from 'react-router-dom'

import { CopyToClipboardButton } from '~features/_common/copy-to-clipboard'

import { WELCOME_PAGE_WIZARD_ITEMS_IDS } from '~pages/welcome/constants'

import { auctionSelectors } from '~entities/auction/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { toastSuccessNotification } from '~shared/ui/toaster/lib'
import { Typography } from '~shared/ui/typograghy'
import type { WizardItemProps } from '~shared/ui/wizard'
import { WizardItem } from '~shared/ui/wizard'

import { cn } from '~shared/utils'

type WizardSuccessCreatedItemProps = Omit<WizardItemProps, 'value' | 'children'>

export const WizardSuccessCreatedItem = (props: WizardSuccessCreatedItemProps) => {
  const { className, ...restProps } = props

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const inputNumberRef = useRef<HTMLInputElement>(null)
  const inputURLRef = useRef<HTMLInputElement>(null)

  return (
    <WizardItem
      value={WELCOME_PAGE_WIZARD_ITEMS_IDS.SUCCESS_CREATE}
      className={cn('flex flex-col gap-y-4', className)}
      {...restProps}
    >
      <Flex className="gap-y-2" direction="column">
        <Typography tag="h1">Аукцион успешно создан!</Typography>
        <Typography tag="p" className="text-gray">
          Скопируйте и сохраните себе номер аукциона, а также запомните пароль.
          Эти данные понадобятся вам в дальнейшем для входа в аукцион в роли
          администратора
        </Typography>
      </Flex>
      <Flex className="gap-y-4" direction="column">
        <Flex className="gap-x-2" align="end" justify="center">
          <Input
            ref={inputNumberRef}
            disabled
            value={auctionUUID}
            slotClassNames={{ base: 'w-full', wrapper: 'pr-0' }}
            label={{ id: 'auctionUUID', value: 'Номер аукциона' }}
            endContent={(
              <CopyToClipboardButton
                className="pointer-events-auto"
                value={inputNumberRef.current?.value || ''}
                onClick={() => toastSuccessNotification('Номер аукциона успешно скопирован!')}
              />
            )}
          />
        </Flex>
        <Flex className="gap-x-2" align="end" justify="end">
          <Input
            ref={inputURLRef}
            disabled
            slotClassNames={{ base: 'w-full', wrapper: 'pr-0' }}
            label={{
              id: 'auctionURL',
              value: 'Ссылка на аукцион для участников',
            }}
            value={`${import.meta.env.VITE_AUCTIONS_VIEWER_URL}/${auctionUUID}`}
            endContent={(
              <CopyToClipboardButton
                className="pointer-events-auto"
                value={inputURLRef.current?.value || ''}
                onClick={() => toastSuccessNotification('Ссылка на аукцион успешна скопирована')}
              />
            )}
          />
        </Flex>
      </Flex>
      <Link to={`/dashboard/${auctionUUID}`}>
        <Button
          className="w-full"
          variant="action"
          startContent={<Icons.LinkArrow size="sm" />}
        >
          Перейти в панель управления
        </Button>
      </Link>
    </WizardItem>
  )
}
