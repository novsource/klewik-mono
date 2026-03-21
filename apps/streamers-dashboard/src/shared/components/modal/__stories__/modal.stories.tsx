import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from 'klewik-ui/button'
import { Flex } from 'klewik-ui/flex'

import { Modal, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalHeaderTitle, ModalTrigger } from '../ui/modal.ui'

const meta: Meta = {
  title: 'UI Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  subcomponents: {
    ModalTrigger,
    ModalHeader,
    ModalHeaderTitle,
    ModalContent,
    ModalFooter,
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Example: Story = {
  render: () => {
    return (
      <Modal>
        <ModalTrigger render={<Button>Open modal</Button>} />
        <ModalContent>
          <ModalHeader>
            <ModalHeaderTitle>Modal</ModalHeaderTitle>
            <ModalCloseButton />
          </ModalHeader>

          <Flex className="grow h-full py-3 px-5">
            Some content
          </Flex>

          <ModalFooter>
            <ModalCloseButton render={<Button>Закрыть</Button>} />
            <Button variant="action" disabled>Сохранить</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  },
}
