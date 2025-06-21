import { WELCOME_PAGE_WIZARD_ITEMS_IDS } from '~pages/welcome/constants'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { Typography } from '~shared/ui/typograghy'
import { WizardItem, WizardItemProps, WizardTrigger } from '~shared/ui/wizard'

import { cn } from '~shared/utils'

const WizardLoginGuestItem = (
  props: Omit<WizardItemProps, 'value' | 'children'>
) => {
  const { className, ...restProps } = props
  return (
    <WizardItem
      value={WELCOME_PAGE_WIZARD_ITEMS_IDS.LOGIN_GUEST}
      className={cn(className)}
      {...restProps}
    >
      <WizardTrigger type="back">
        <Button startContent={<Icons.ReturnArrow size="default" />}>
          Назад
        </Button>
      </WizardTrigger>

      <Flex className="gap-y-2" direction="column">
        <Typography tag="h1">Просмотр аукциона в качестве гостя</Typography>
        <Typography tag="p" className="text-gray">
          В случае если у вас нет полной ссылки на аукцион, то здесь вы можете
          ввести номер активного аукциона и перейти на сайт с информацией о нем.
        </Typography>
        <Typography tag="p" className="text-gray">
          Введите в поле номер аукциона и нажмите кнопку "Перейти"
        </Typography>
      </Flex>
      <Flex className="w-full gap-y-3">
        <Input
          startContent={<Icons.Id className="text-gray-accent" size="sm" />}
          placeholder="Номер аукциона"
        />
        <Button variant={'action'} startContent={<Icons.LinkArrow />}>
          Перейти
        </Button>
      </Flex>
    </WizardItem>
  )
}

export { WizardLoginGuestItem }
