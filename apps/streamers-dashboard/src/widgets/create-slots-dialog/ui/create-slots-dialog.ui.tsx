import { useState } from 'react'
import type {
  ErrorOption,
  FieldError,
  FieldErrors,
  MultipleFieldErrors,
} from 'react-hook-form'

import { TransformedCreateSlotsFormData } from '~features/auction-slot/create-slots/lib'
import { CreateSlotsForm } from '~features/auction-slot/create-slots/ui'

import {
  auctionSlotsSelectors,
  auctionSlotsActions as storeAuctionSlotsActions,
} from '~entities/auction-slot/store'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

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
  const [isSheetOpened, setIsSheetOpened] = useState(false)

  const auctionSlotsActions = useActionCreators(storeAuctionSlotsActions)
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`
  )

  return (
    <Sheet open={isSheetOpened} onOpenChange={setIsSheetOpened}>
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
        <CreateSlotsForm
          multiplySlots={multiplySlots}
          beforeSubmit={(formData) => {
            const errors = formData.reduce<{
              [key: number]: FieldErrors<TransformedCreateSlotsFormData[number]>
            }>(
              (acc, data, index) => {
                const alreadyExist = auctionSlots.find(
                  (slot) => slot.name === data.name
                )

                if (!!alreadyExist)
                  acc['slots'][index] = {
                    name: {
                      type: 'value',
                      message: 'Такой слот уже участвует в аукционе',
                    },
                  }

                return acc
              },
              { slots: {} }
            )

            if (Object.keys(errors).length !== 0) {
              return [true, errors]
            }

            return [false, undefined]
          }}
          onSuccess={(slots) => {
            auctionSlotsActions.addSlots(
              slots.map((slot) => ({
                ...slot,
                id: 1,
                color: '#FFF',
              }))
            )
            setIsSheetOpened(false)
          }}
        />
      </SheetContent>
    </Sheet>
  )
}

export { CreateSlotsDialog }
