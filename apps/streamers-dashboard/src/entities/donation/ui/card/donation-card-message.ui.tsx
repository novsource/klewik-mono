import { useLayoutEffect, useRef, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

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
    console.log(textRef.current)

    if (!textRef.current || !messageContainerRef.current) return

    const textWidth = textRef.current.getBoundingClientRect().width

    let containerWrapper = messageContainerRef.current.parentElement

    if (!containerWrapper) containerWrapper = document.body

    const containerWidth = containerWrapper.getBoundingClientRect().width

    console.log(Math.ceil(textWidth / containerWidth))

    setMessageTextLinesCount(Math.ceil(textWidth / containerWidth))
  }, [accordionAnimationStatus, textRef.current, messageContainerRef.current])

  return (
    <div
      ref={messageContainerRef}
      className="transition-[width] duration-500 bg-dark-accent/70 px-2 rounded-md"
      style={{ width: isMessageOpened ? width : 300 }}
      onAnimationStart={() => setAccordionAnimatinoStatus('animating')}
      onAnimationEnd={() => setAccordionAnimatinoStatus('animated')}
    >
      <Accordion type="single" collapsible>
        <AccordionItem value="message" {...props}>
          <AccordionTrigger
            className="py-1.5 text-gray-accent flex-row-reverse justify-end gap-x-1.5"
            onClick={() => setIsMessageOpened((curr) => !curr)}
          >
            {isMessageOpened
              ? 'Скрыть текст пожертвования'
              : 'Показать текст пожертвования'}
          </AccordionTrigger>
          <AccordionContent className="relative text-md font-medium pb-2 text-white/85 font-golos-f pl-1 tracking-normal">
            {accordionAnimationStatus === 'animating' && (
              <span
                ref={textRef}
                className="absolute invisible text-nowrap inline"
              >
                {value}
              </span>
            )}
            <AnimatePresence>
              <motion.span
                className={cn(`line-clamp-${messageTextLinesCount}`)}
                initial={{
                  opacity: 0,
                  translateY: 3,
                  // lineClamp: 0.05,
                }}
                animate={accordionAnimationStatus}
                exit={{ opacity: 0, display: 'hidden' }}
                variants={{
                  animated: { opacity: 1, translateY: 0, textWrap: 'wrap' },
                  animating: { opacity: 0 },
                }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {value}
              </motion.span>
            </AnimatePresence>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export { DonationCardMessage }
