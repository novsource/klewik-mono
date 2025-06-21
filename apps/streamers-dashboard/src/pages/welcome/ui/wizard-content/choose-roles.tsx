import { WELCOME_PAGE_WIZARD_ITEMS_IDS } from '~pages/welcome/constants'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'
import { WizardItem, WizardItemProps, WizardTrigger } from '~shared/ui/wizard'

import { cn } from '~shared/utils'

const WizardChooseRolesItem = (
  props: Omit<WizardItemProps, 'value' | 'children'>
) => {
  const { className, ...restProps } = props

  return (
    <WizardItem
      value={WELCOME_PAGE_WIZARD_ITEMS_IDS.CHOOSE_ROLES}
      className={cn(className)}
      {...restProps}
    >
      {(nodes) => {
        return (
          <>
            <WizardTrigger type="back">
              <Button startContent={<Icons.ReturnArrow size="default" />}>
                Назад
              </Button>
            </WizardTrigger>

            <Flex className="gap-y-2" direction="column">
              <Typography tag="h1">
                Вы хотите войти в аукцион как гость или как администратор
                аукциона?
              </Typography>
              <Typography tag="p" className="text-gray">
                Для продолжения выберите роль
              </Typography>
            </Flex>
            <Flex className="w-full gap-y-3" direction="column">
              {nodes.map((node) => (
                <WizardTrigger type="next" nextStepId={node}>
                  <Button
                    className="w-full"
                    startContent={<Icons.Face size="default" />}
                  >
                    {node}
                  </Button>
                </WizardTrigger>
              ))}
            </Flex>
          </>
        )
      }}
    </WizardItem>
  )
}

export { WizardChooseRolesItem }
