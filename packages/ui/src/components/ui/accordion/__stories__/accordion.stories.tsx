import type { Meta, StoryObj } from '@storybook/react-vite'

import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from '../ui/accordion.ui'

const meta = {
  title: 'Base UI/Accordion',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    multiple: {
      control: 'boolean',
    },
  },
  render: (args) => {
    return (
      <Accordion multiple={args.multiple}>
        <AccordionItem>
          <AccordionHeader>
            <AccordionTrigger>Accordion</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <div className="py-2 px-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    )
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Multiple: Story = {
  ...Default,
  argTypes: {
    multiple: {

    },
  },
  render: () => {
    return (
      <Accordion multiple>
        <AccordionItem>
          <AccordionHeader>
            <AccordionTrigger>Accordion #1</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <div className="py-2 px-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <AccordionTrigger>Accordion #2</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <div className="py-2 px-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    )
  },
}
