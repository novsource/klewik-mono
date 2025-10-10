import type { AccordionTriggerProps } from '@radix-ui/react-accordion'

import type { ComponentProps } from 'react'
import { useRef, useState } from 'react'

import { AnimatePresence } from 'motion/react'

import { useElementSize } from '~shared/hooks'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~shared/ui/accordion/ui/accordion'
import { MotionBox } from '~shared/ui/motion-box'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

export type DonationCardMessageProps = ComponentProps<'div'> & {
  value: string
  triggerProps?: AccordionTriggerProps
}

export const DonationCardMessage = (props: DonationCardMessageProps) => {
  const { value, triggerProps, className, ...restProps } = props

  const [isOpen, setIsOpen] = useState(false)
  const [accordionAnimationStatus, setAccordionAnimatinoStatus] = useState<
    'animating' | 'animated'
  >('animated')

  const textRef = useRef<HTMLSpanElement>(null)

  const { ref: messageContainerParentRef, value: messageContainerSizes } = useElementSize<HTMLDivElement>()

  return (
    <div
      ref={messageContainerParentRef}
      className={cn('w-full h-full', className)}
      {...restProps}
    >
      <div
        className="rounded-md bg-dark-light px-2 transition-[width] duration-500"
        style={{ width: isOpen ? messageContainerSizes.width : 300 }}
        onAnimationStart={() => setAccordionAnimatinoStatus('animating')}
        onAnimationEnd={() => setAccordionAnimatinoStatus('animated')}
      >
        <Accordion type="single" collapsible>
          <AccordionItem value="message">
            <AccordionTrigger
              className="flex-row-reverse justify-end text-sm tablet:text-sm gap-x-1 py-1 tablet:gap-x-1.5 tablet:py-1.5 text-gray-light hover:text-gray-accent"
              onClick={() => setIsOpen(curr => !curr)}
              {...triggerProps}
            >
              {isOpen
                ? 'Скрыть текст пожертвования'
                : 'Показать текст пожертвования'}
            </AccordionTrigger>
            <AccordionContent className="relative pb-2 px-1 font-golos-f text-md font-medium tracking-normal">
              {accordionAnimationStatus === 'animating' && (
                <span
                  ref={textRef}
                  className="invisible absolute inline text-wrap"
                >
                  {value}
                </span>
              )}
              <AnimatePresence>
                <MotionBox
                  className={cn(`text-nowrap`)}
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
                  <Typography className="max-mobile:text-sm max-mobile:font-normal text-white/80" tag="p">
                    {value}
                  </Typography>
                </MotionBox>
              </AnimatePresence>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>

  )
}
