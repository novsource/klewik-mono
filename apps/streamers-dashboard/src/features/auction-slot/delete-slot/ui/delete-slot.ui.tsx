import { ComponentPropsWithoutRef } from 'react'

import { Auction } from '~entities/auction/model'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions } from '~entities/auction-slot/store'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { ButtonProps } from '~shared/ui/button/ui/Button'
import { Icons } from '~shared/ui/icons'
import { toastPromiseNotification } from '~shared/ui/toaster/lib'

import { useDeleteSlotMutation } from '../api'

type DeleteSlotButtonProps = ComponentPropsWithoutRef<'button'> &
  ButtonProps & {
    slotId: AuctionSlot['id']
    auctionUUID: Auction['auctionUUID']
  }

const DeleteSlotButton = (props: DeleteSlotButtonProps) => {
  const { slotId, auctionUUID, ...buttonProps } = props

  const { deleteSlot } = useActionCreators(auctionSlotsActions)

  const [deleteSlotMutation, { isLoading }] = useDeleteSlotMutation()

  const handleOnClick = async () => {
    const toastPromise = new Promise((resolve, reject) => {
      deleteSlotMutation({ auctionUUID, slotId }).then((response) => {
        if (response.error) {
          reject(response.error)
        } else {
          resolve(response.data)
        }
      })
    }).then(() => {
      deleteSlot({ id: slotId })
    })

    toastPromiseNotification(toastPromise, 'Удаляем слот...', {
      errorText: 'Не удалось удалить слот',
      successText: 'Слот успешно удален',
    })
  }

  return (
    <Button
      variant={'ghost'}
      isIconOnly
      icon={<Icons.Bin />}
      className="h-full px-1 py-1 text-gray-accent transition-colors hover:text-red"
      disabled={isLoading}
      onClick={handleOnClick}
      {...buttonProps}
    >
      Удалить
    </Button>
  )
}

export { DeleteSlotButton }
