import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { useDeleteAuctionMutation } from '~widgets/dashboard-settings-dialog/api/delete-auction.api'

import { auctionSelectors } from '~entities/auction/store'

import { Text, Title } from '~shared/components/typography'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~shared/ui/dialog'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { toastErrorNotification, toastSuccessNotification } from '~shared/ui/toaster/lib'

export const DeleteAuctionDialog = () => {
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const [deleteAuctionMutation, { isLoading }] = useDeleteAuctionMutation()

  const handleOnConfirmDelete = async () => {
    if (isLoading)
      return

    const response = await deleteAuctionMutation({ auctionUUID })

    if (response.error) {
      toastErrorNotification('Не удалось удалить аукциона', response.error.message)
    }
    else {
      toastSuccessNotification('Аукцион успешно удален!')
      navigate('/')
    }
  }

  const closeDialog = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} disablePointerDismissal={isLoading}>
      <DialogTrigger render={(
        <Button
          variant="error"
          startContent={<Icons.Bin />}
        >
          Удалить аукцион
        </Button>
      )}
      />
      <DialogContent className="w-full tablet:max-w-[400px] border-dark-light bg-dark-foreground" backdropProps={{ forceRender: true }}>
        <Flex className="sticky top-0 bg-dark-foreground w-full h-fit py-2 z-20" direction="column">
          <DialogHeader className="flex flex-row w-full justify-between h-fit items-center p-0">
            <DialogTitle className="font-semibold leading-4">
              <Title order={2}>
                Удаление аукциона
              </Title>
            </DialogTitle>
          </DialogHeader>
        </Flex>

        <Text className="text-gray-accent">
          Вы уверены что хотите удалить аукцион?
          Если да, то нажмите кнопку "Подтвердить"
        </Text>
        <DialogFooter className="w-full flex-row justify-end gap-x-2 mt-4">
          <Button disabled={isLoading} onClick={closeDialog}>Отмена</Button>
          <Button
            className="text-red hover:text-red hover:border-red/60"
            disabled={isLoading}
            onClick={handleOnConfirmDelete}
          >
            Подтвердить
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
