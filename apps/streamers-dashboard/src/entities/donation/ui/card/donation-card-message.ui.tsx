import type { ComponentProps } from 'react'
import { useRef, useState } from 'react'

import { AnimatePresence } from 'motion/react'

import { Text } from '~shared/components/typography'

import type { AccordionTriggerProps } from 'klewik-ui/accordion'
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from 'klewik-ui/accordion'
import { MotionBox } from 'klewik-ui/motion-box'

import { cn } from '~shared/utils'

export type DonationCardMessageProps = ComponentProps<'div'> & {
  value: string
  triggerProps?: AccordionTriggerProps
}

export const DonationCardMessage = (props: DonationCardMessageProps) => {
  const { value, triggerProps, className, ...restProps } = props

  const [isOpen, setIsOpen] = useState(false)
  const [accordionAnimationStatus, setAccordionAnimatinoStatus] = useState<'animating' | 'animated'>('animated')

  const textRef = useRef<HTMLSpanElement>(null)

  const toggleOpen = () => setIsOpen(curr => !curr)

  return (
    <div
      className={cn('w-full h-full', className)}
      {...restProps}
    >
      <div
        className="bg-dark-light rounded-md duration-500"
        onAnimationStart={() => setAccordionAnimatinoStatus('animating')}
        onAnimationEnd={() => setAccordionAnimatinoStatus('animated')}
      >
        <Accordion
          className="w-full max-w-full"
          onValueChange={toggleOpen}
        >
          <AccordionItem>
            <AccordionTrigger
              className={cn('bg-dark-light text-sm', isOpen && 'rounded-b-none')}
            >
              {isOpen
                ? 'Скрыть сообщение'
                : 'Показать сообщение'}
            </AccordionTrigger>
            <AccordionPanel className="bg-dark-light">
              <div className="relative pb-2 px-3 font-golos-f text-md font-medium tracking-normal">
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
                    <Text className="max-mobile:text-sm max-mobile:font-normal text-white/80">
                      {value}
                    </Text>
                  </MotionBox>
                </AnimatePresence>
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>

  )
}
