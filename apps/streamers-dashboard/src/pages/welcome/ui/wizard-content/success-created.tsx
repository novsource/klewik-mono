import { useRef } from 'react'

import { Link } from 'react-router-dom'

import { WELCOME_PAGE_WIZARD_ITEMS_IDS } from '~pages/welcome/constants'

import { auctionSelectors } from '~entities/auction/store'

import { useCopyToClipboard } from '~shared/hooks/use-copy-to-clipboard'

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

const WizardSuccessCreatedItem = (
  props: Omit<WizardItemProps, 'value' | 'children'>,
) => {
  const { className, ...restProps } = props

  const auctionInfo = useStoreSelector(auctionSelectors.getAuctionInfo)

  const inputNumberRef = useRef<HTMLInputElement>(null)
  const inputURLRef = useRef<HTMLInputElement>(null)

  const { copyToClipboard } = useCopyToClipboard()

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
            value={auctionInfo.auctionUUID}
            slotClassNames={{ base: 'w-full', wrapper: 'pr-0' }}
            label={{ id: 'auctionUUID', value: 'Номер аукциона' }}
            endContent={(
              <Button
                className="text-gray-light hover:text-gray-accent"
                variant="ghost"
                isIconOnly
                icon={<Icons.Copy size="sm" />}
                onClick={() => {
                  copyToClipboard(inputNumberRef.current?.value || '')
                  toastSuccessNotification('Номер аукциона скопирован в буфер')
                }}
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
            value={auctionInfo.url}
            endContent={(
              <Button
                className="text-gray-light hover:text-gray-accent"
                variant="ghost"
                isIconOnly
                icon={<Icons.Copy size="sm" />}
                onClick={() => {
                  copyToClipboard(inputURLRef.current?.value || '')
                  toastSuccessNotification(
                    'Ссылка на аукцион скопирована в буфер',
                  )
                }}
              />
            )}
          />
        </Flex>
      </Flex>
      <Link to={`/dashboard/${auctionInfo.url?.split('/').at(-1)}`}>
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

export { WizardSuccessCreatedItem }
