import { useLayoutEffect, useRef, useState } from 'react'

import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~shared/ui/accordion/ui/accordion'

import { cn } from '~shared/utils'

type DonationCardMessageProps = {
  value: string
}

const DonationCardMessage = ({ value, ...props }: DonationCardMessageProps) => {
  const [width, setWidth] = useState(0)
  const [messageTextLinesCount, setMessageTextLinesCount] = useState(1)

  const [accordionAnimationStatus, setAccordionAnimatinoStatus] = useState<
    'animating' | 'animated'
  >('animated')
  const [isMessageOpened, setIsMessageOpened] = useState(false)

  const messageContainerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!messageContainerRef.current) return

    let containerWrapper = messageContainerRef.current.parentElement

    if (!containerWrapper) containerWrapper = document.body

    setWidth(containerWrapper.clientWidth)
  }, [messageContainerRef.current])

  const textRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (!textRef.current || !messageContainerRef.current) return

    const textWidth = textRef.current.getBoundingClientRect().width

    let containerWrapper = messageContainerRef.current.parentElement

    if (!containerWrapper) containerWrapper = document.body

    const containerWidth = containerWrapper.getBoundingClientRect().width

    setMessageTextLinesCount(Math.ceil(textWidth / containerWidth))
  }, [accordionAnimationStatus, textRef.current, messageContainerRef.current])

  return (
    <div
      ref={messageContainerRef}
      className="rounded-md bg-dark-accent/70 px-2 transition-[width] duration-500"
      style={{ width: isMessageOpened ? width : 300 }}
      onAnimationStart={() => setAccordionAnimatinoStatus('animating')}
      onAnimationEnd={() => setAccordionAnimatinoStatus('animated')}
    >
      <Accordion type="single" collapsible>
        <AccordionItem value="message" {...props}>
          <AccordionTrigger
            className="flex-row-reverse justify-end gap-x-1.5 py-1.5 text-gray-accent"
            onClick={() => setIsMessageOpened((curr) => !curr)}
          >
            {isMessageOpened
              ? 'Скрыть текст пожертвования'
              : 'Показать текст пожертвования'}
          </AccordionTrigger>
          <AccordionContent className="relative pb-2 pl-1 font-golos-f text-md font-medium tracking-normal text-white/85">
            {accordionAnimationStatus === 'animating' && (
              <span
                ref={textRef}
                className="invisible absolute inline text-nowrap"
              >
                {value}
              </span>
            )}
            <AnimatePresence>
              <m.span
                className={cn(`line-clamp-${messageTextLinesCount}`)}
                initial={{
                  opacity: 0,
                  translate: [0, 3, 0],
                }}
                animate={accordionAnimationStatus}
                exit={{ opacity: 0, display: 'hidden' }}
                variants={{
                  animated: {
                    opacity: 1,
                    translate: [0, 0, 0],
                    textWrap: 'wrap',
                  },
                  animating: { opacity: 0 },
                }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {value}
              </m.span>
            </AnimatePresence>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export { DonationCardMessage }
