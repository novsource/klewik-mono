import {
  WELCOME_PAGE_WIZARD_IDS_ICONS,
  WELCOME_PAGE_WIZARD_ITEMS_IDS,
} from '~pages/welcome/constants'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'
import { WizardItem, WizardItemProps, WizardTrigger } from '~shared/ui/wizard'
import { useWizardContext } from '~shared/ui/wizard/context'

import { cn } from '~shared/utils'

const WizardWelcomeItem = (
  props: Omit<WizardItemProps, 'value' | 'children'>
) => {
  const { className, ...restProps } = props

  const { getNodesById } = useWizardContext()

  const nodes = getNodesById(WELCOME_PAGE_WIZARD_ITEMS_IDS.WELCOME)

  const nodesTitles = {
    createAuction: 'Создать аукцион',
    chooseRoles: 'Войти в аукцион',
  }

  const renderWizardNextTriggers = () => {
    if (!nodes) return

    const welcomeNodes = nodes as Array<
      (typeof WELCOME_PAGE_WIZARD_ITEMS_IDS)[keyof typeof WELCOME_PAGE_WIZARD_ITEMS_IDS]
    >

    return welcomeNodes.map((node) => {
      //@ts-ignore
      const triggerTitle = node in nodesTitles ? nodesTitles[node] : node

      return (
        <WizardTrigger type="next" nextStepId={node}>
          <Button
            className="w-full"
            variant={node === 'createAuction' ? 'action' : 'default'}
            startContent={WELCOME_PAGE_WIZARD_IDS_ICONS[node]}
          >
            {triggerTitle}
          </Button>
        </WizardTrigger>
      )
    })
  }

  return (
    <WizardItem
      value={WELCOME_PAGE_WIZARD_ITEMS_IDS.WELCOME}
      className={cn(className)}
      {...restProps}
    >
      <>
        <Flex className="relative gap-y-2" direction="column">
          <Icons.Logo className="text-green-accent" width={42} height={42} />
          <Typography tag="h1">
            Добро пожаловать в поинтовый аукцион!
          </Typography>
          <Typography tag="p" className="text-gray">
            Для продолжения выберите действие
          </Typography>
        </Flex>
        <Flex className="w-full gap-y-3" direction="column">
          {renderWizardNextTriggers()}
        </Flex>
      </>
    </WizardItem>
  )
}

export { WizardWelcomeItem }
