import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../button'

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from '../ui/drawer.ui'

const meta: Meta = {
  title: 'Base UI/Drawer',
  parameters: {
    layout: 'centered',
  },
  component: Drawer,
  subcomponents: {
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
    DrawerContent,
    DrawerClose,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['full', 'default'],
    },
    side: {
      control: 'select',
      options: ['right', 'bottom'],
    },
  },
  args: {
    side: 'right',
    size: 'default',
  },
}

export default meta

type DefaultStory = StoryObj<typeof meta>

export const Example: DefaultStory = {
  render: (args) => {
    return (
      <Drawer size={args.size} side={args.side}>
        <DrawerTrigger render={<Button>Open drawer</Button>} />
        <DrawerContent slotClassnames={{ content: 'flex flex-col' }}>
          Drawer content
          Drawer content
          Drawer content
          Drawer content
          Drawer content
          Drawer content
          Drawer content
          Drawer content
          Drawer content
          <Drawer side={args.side} swipeDirection="down">
            <DrawerTrigger render={<Button>Open drawer</Button>} />
            <DrawerContent slotClassnames={{ content: 'flex flex-col' }}>
              Drawer content
              Drawer content
              Drawer content
              Drawer content
              Drawer content
              Drawer content
              Drawer content
              Drawer content
              Drawer content
              <Button>Закрыть</Button>
            </DrawerContent>
          </Drawer>
          <Button>Закрыть</Button>
        </DrawerContent>
      </Drawer>
    )
  },
}
