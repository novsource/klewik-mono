import { useLayoutEffect, useRef, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~shared/ui/accordion/ui/accordion'
import { Typography } from '~shared/ui/typograghy'

type DonationCardMessageProps = {
  value: string
}

const DonationCardMessage = ({ value, ...props }: DonationCardMessageProps) => {
  const [width, setWidth] = useState(0)
  const [isMessageOpen, setIsMessageOpen] = useState(false)

  const messageContainerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!messageContainerRef.current) return

    let containerWrapper = messageContainerRef.current.parentElement

    if (!containerWrapper) containerWrapper = document.body

    setWidth(containerWrapper.clientWidth)
  }, [messageContainerRef.current])

  return (
    <div
      ref={messageContainerRef}
      className="w-fit transition-[width] duration-500"
      style={{ width: isMessageOpen ? width : 220 }}
    >
      <Accordion
        className="w-full bg-dark-accent px-2 rounded-md"
        type="single"
        collapsible
      >
        <AccordionItem value="message" {...props}>
          <AccordionTrigger
            className="py-1.5 text-gray-accent flex-row-reverse justify-end gap-x-1.5"
            onClick={() => setIsMessageOpen((curr) => !curr)}
          >
            {isMessageOpen
              ? 'Скрыть текст пожертвования'
              : 'Показать текст пожертвования'}
          </AccordionTrigger>
          <AccordionContent className="text-md font-medium pb-2">
            <Typography tag="p">{value}</Typography>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export { DonationCardMessage }
