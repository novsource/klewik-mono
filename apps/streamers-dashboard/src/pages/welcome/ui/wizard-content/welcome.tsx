import { useMemo } from 'react'

import {
  WELCOME_PAGE_WIZARD_IDS_ICONS as WIZARD_ICONS,
  WELCOME_PAGE_WIZARD_ITEMS_IDS as WIZARD_ITEMS_IDS,
} from '~pages/welcome/constants'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { Text, Title } from '~shared/components/typography'

import { useMediaQuery } from '~shared/hooks'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type { WizardItemProps } from '~shared/ui/wizard'
import { WizardItem, WizardTrigger } from '~shared/ui/wizard'
import { useWizardContext } from '~shared/ui/wizard/context'

import { cn } from '~shared/utils'

const nodesTitles: Partial<Record<typeof WIZARD_ITEMS_IDS[keyof typeof WIZARD_ITEMS_IDS], string>> = {
  login: 'Создать аукцион',
  loginAdmin: 'Войти в аукцион',
}

export const WizardWelcomeItem = (
  props: Omit<WizardItemProps, 'value' | 'children'>,
) => {
  const { className, ...restProps } = props

  const { getNodesById } = useWizardContext()

  const isMediaLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  const wizardNextTriggers = useMemo(() => {
    const welcomeNodes = getNodesById(WIZARD_ITEMS_IDS.WELCOME) as Array<
      (typeof WIZARD_ITEMS_IDS)[keyof typeof WIZARD_ITEMS_IDS]
    >

    return welcomeNodes.map((node) => {
      const triggerTitle = Reflect.has(nodesTitles, node) ? nodesTitles[node] : node

      return (
        <WizardTrigger key={node} type="next" nextStepId={node}>
          <Button
            className="w-full"
            variant={node === 'login' ? 'action' : 'default'}
            startContent={WIZARD_ICONS[node]}
          >
            {triggerTitle}
          </Button>
        </WizardTrigger>
      )
    })
  }, [getNodesById])

  return (
    <WizardItem
      value={WIZARD_ITEMS_IDS.WELCOME}
      className={cn('w-full space-y-4', className)}
      {...restProps}
    >
      <Flex className="relative gap-y-2" direction="column">
        <Icons.Logo
          className="text-green-accent"
          width={isMediaLargeThenTablet ? 42 : 36}
          height={isMediaLargeThenTablet ? 42 : 36}
        />
        <Title order={1}>
          Добро пожаловать в поинтовый аукцион!
        </Title>
        <Text className="text-gray">
          Для продолжения выберите действие
        </Text>
      </Flex>
      <Flex className="w-full gap-y-3" direction="column">
        {wizardNextTriggers}
      </Flex>
    </WizardItem>
  )
}
