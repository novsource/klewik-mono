import { useCurrentEditor } from '@tiptap/react'
import { AuctionTextRulesWysiwygEditorDialog } from '~features/settings/set-text-rules/ui'

import { WELCOME_PAGE_WIZARD_ITEMS_IDS } from '~pages/welcome/constants'

import { AuctionInitialParametersForm } from '~features/auction/set-initial-parameters/ui'

import { Text, Title } from '~shared/components/typography'

import { Button } from 'klewik-ui/button'
import { Flex } from 'klewik-ui/flex'
import { Skeleton } from 'klewik-ui/skeleton'
import { toastErrorNotification, toastSuccessNotification } from 'klewik-ui/toaster/lib'
import type { WizardItemProps } from 'klewik-ui/wizard'
import { useWizardContext, WizardItem, WizardTrigger } from 'klewik-ui/wizard'

import { cn } from '~shared/utils'

export const WizardAuctionParametersItem = (
  props: Omit<WizardItemProps, 'value' | 'children'>,
) => {
  const { className, ...restProps } = props

  const { editor } = useCurrentEditor()

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
          <Title>
            Настройки деталей аукциона
          </Title>
          <Text className="text-gray">
            Здесь вы можете настроить название аукциона, которое будет
            отображаться на сайте для гостей (участников) аукциона
          </Text>
          <Text className="text-gray">
            Также, по желанию, вы можете добавить ссылки на стриминговые платформы где будет
            проводиться трансляция аукциона (на данный момент доступен Twitch и
            Youtube)
          </Text>
        </Flex>

        {editor
          ? <AuctionTextRulesWysiwygEditorDialog editor={editor} />
          : <Skeleton className="w-full h-10" />}

        <AuctionInitialParametersForm
          onError={() => {
            toastErrorNotification('Не удалось сохранить параметры. Попробуйте еще раз')
          }}
          onSuccess={() => {
            toastSuccessNotification('Параметры успешно сохранены!')
            next(nextIds ? nextIds[0] : '')
          }}
        />
      </Flex>

    </WizardItem>
  )
}
