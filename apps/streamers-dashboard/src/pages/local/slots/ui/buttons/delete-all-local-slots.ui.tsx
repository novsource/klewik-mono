import { useState } from 'react'

import { auctionSlotsActions } from '~entities/auction-slot/store'

import { Modal, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalHeaderTitle, ModalTrigger } from '~shared/components/modal'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import type { ButtonProps } from 'klewik-ui/button'
import { Button } from 'klewik-ui/button'
import { Icons } from 'klewik-ui/icons'
import { Text } from 'klewik-ui/typography'

import { cn } from '~shared/utils/react'

export const DeleteAllLocalSlotsButton = (props: ButtonProps) => {
  const { setSlots } = useActionCreators(auctionSlotsActions)

  const [isOpen, setIsOpen] = useState(false)

  const deleteAll = () => {
    setSlots([])
  }

  const closeDialog = () => {
    setIsOpen(false)
  }

  return (
    <Modal open={isOpen} onOpenChange={open => setIsOpen(open)}>
      <ModalTrigger render={(
        <Button
          variant="error"
          startContent={<Icons.Bin />}
          {...props}
        >
          Удалить все
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
          <ModalHeaderTitle>Удаление слотов</ModalHeaderTitle>
          <ModalCloseButton />
        </ModalHeader>

        <Text className="px-4 text-gray-accent" asSpan>
          Вы уверены что хотите удалить все слоты?
          Слоты будут удалены и их будет невозможно восстановить.
        </Text>
        <Text className="px-4 text-gray-accent mb-4" asSpan>
          Если да, то нажмите кнопку "Подтвердить"
        </Text>

        <ModalFooter>
          <Button onClick={closeDialog}>Отмена</Button>
          <Button
            className="text-red hover:text-red hover:border-red/60"
            onClick={deleteAll}
          >
            Подтвердить
          </Button>
        </ModalFooter>

      </ModalContent>
    </Modal>

  )
}
