import { useRef } from 'react'

import { auctionSlotsActions, auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import type { ButtonProps } from 'klewik-ui/button'
import { Button } from 'klewik-ui/button'
import { Icons } from 'klewik-ui/icons'
import { closeToast, toastSuccessNotification } from 'klewik-ui/toaster'

type DeleteLocalSlotButtonProps = ButtonProps & {
  slotId: number
}

export const DeleteSlotButton = (props: DeleteLocalSlotButtonProps) => {
  const { slotId, ...restProps } = props

  const targetSlot = useStoreSelector(state => auctionSlotsSelectors.getSlotById(state, slotId))

  const deletedSlotTempRef = useRef(targetSlot)

  if (targetSlot)
    deletedSlotTempRef.current = targetSlot

  const { addSlots, deleteSlot } = useActionCreators(auctionSlotsActions)

  const returnDeletedSlot = (toastId: string | number) => {
    if (!deletedSlotTempRef.current)
      return

    addSlots([deletedSlotTempRef.current])
    closeToast(toastId)
  }

  const handleOnClick = () => {
    deleteSlot({ id: slotId })

    const toastId = toastSuccessNotification('Слот успешно удален', {
      duration: 10000,
      action: (
        <Button
          startContent={<Icons.ReturnArrow />}
          size="xs"
          onClick={() => returnDeletedSlot(toastId)}
        >
          Отменить
        </Button>
      ),
    })
  }

  return (
    <Button
      variant="borderless"
      className="text-red/80 hover:text-red hover:bg-red/5"
      isIconOnly
      icon={<Icons.Bin />}
      onClick={handleOnClick}
      {...restProps}
    />
  )
}
