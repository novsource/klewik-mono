import { CreateSlotsForm } from '~features/auction-slot/create-slots/ui'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~shared/ui/sheet/ui/sheet'

import { tailwindScreens } from '~shared/constants/tailwindcss'

type CreateSlotsDialogProps = {
  multiplySlots?: boolean
}

const CreateSlotsDialog = ({
  multiplySlots = true,
}: CreateSlotsDialogProps) => {
  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`
  )

  return (
    <Sheet>
      <SheetTrigger>
        <Button
          size={!isMediaLargeThenTablet ? 'lg' : 'default'}
          variant={'action'}
          startContent={<Icons.Plus size="xs" />}
        >
          {isMediaLargeThenTablet && 'Добавить слот'}
        </Button>
      </SheetTrigger>
      <SheetContent side={isMediaLargeThenTablet ? 'right' : 'bottom'}>
        <SheetHeader>
          <SheetTitle>Добавление слота</SheetTitle>
        </SheetHeader>
        <SheetDescription className="mb-6 text-sm">
          Здесь вы можете самостоятельно добавить слоты в аукцион. Очки, которые
          будут указаны в добавленных слотах будут суммированны и вычтены из
          "очки стримера"
        </SheetDescription>
        <CreateSlotsForm multiplySlots={multiplySlots} />
      </SheetContent>
    </Sheet>
  )
}

export { CreateSlotsDialog }
