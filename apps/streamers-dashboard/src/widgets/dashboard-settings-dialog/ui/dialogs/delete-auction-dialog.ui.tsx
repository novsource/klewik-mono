import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { useDeleteAuctionMutation } from '~widgets/dashboard-settings-dialog/api/delete-auction.api'

import { auctionSelectors } from '~entities/auction/store'

import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalHeaderTitle,
  ModalTrigger,
} from '~shared/components/modal'
import { Text } from '~shared/components/typography'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { toastErrorNotification, toastSuccessNotification } from '~shared/ui/toaster/lib'

import { cn } from '~shared/utils'

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
    <Modal open={isOpen} onOpenChange={setIsOpen} disablePointerDismissal={isLoading}>
      <ModalTrigger render={(
        <Button
          variant="error"
          startContent={<Icons.Bin />}
        >
          Удалить аукцион
        </Button>
      )}
      />

      <ModalContent
        className={cn([
          'p-0 w-full h-full max-w-[300px] max-h-[200px] min-h-[150px]',
          'landtop:min-w-[450px] landtop:w-full landtop:max-w-[300px]',
          'desktop:min-w-[450px] desktop:w-full desktop:max-w-[300px]',
          'desktop-lg:min-w-[450px] desktop-lg:w-full desktop-lg:max-w-[300px]',
        ])}
        backdropProps={{ forceRender: true }}
      >
        <ModalHeader>
          <ModalHeaderTitle>Удаление аукциона</ModalHeaderTitle>
          <ModalCloseButton />
        </ModalHeader>

        <Flex className="grow h-full px-5 pt-2">
          <Text className="text-gray-accent">
            Вы уверены что хотите удалить аукцион?
            Если да, то нажмите кнопку "Подтвердить"
          </Text>
        </Flex>

        <ModalFooter>
          <Button disabled={isLoading} onClick={closeDialog}>Отмена</Button>
          <Button
            className="text-red hover:text-red hover:border-red/60"
            disabled={isLoading}
            onClick={handleOnConfirmDelete}
          >
            Подтвердить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
