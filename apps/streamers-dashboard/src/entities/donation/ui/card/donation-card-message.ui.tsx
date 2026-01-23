import type { AccordionTriggerProps } from '@radix-ui/react-accordion'

import type { ComponentProps } from 'react'
import { useRef, useState } from 'react'

import { AnimatePresence } from 'motion/react'

import { Text } from '~shared/components/typography'

import { useElementSize } from '~shared/hooks'

import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '~shared/ui/accordion'
import { MotionBox } from '~shared/ui/motion-box'

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

  const { ref: messageContainerParentRef, value: messageContainerSizes } = useElementSize<HTMLDivElement>()

  const toggleOpen = () => setIsOpen(curr => !curr)

  return (
    <div
      ref={messageContainerParentRef}
      className={cn('w-full h-full', className)}
      {...restProps}
    >
      <div
        className="bg-dark-light rounded-md transition-[width] duration-500"
        onAnimationStart={() => setAccordionAnimatinoStatus('animating')}
        onAnimationEnd={() => setAccordionAnimatinoStatus('animated')}
      >
        <Accordion
          className="w-fit"
          onValueChange={toggleOpen}
          style={{ width: isOpen ? messageContainerSizes.width : 'auto' }}
        >
          <AccordionItem>
            <AccordionTrigger
              className={cn('bg-dark-light text-sm', isOpen && 'rounded-b-none')}
            >
              {isOpen
                ? 'Скрыть текст пожертвования'
                : 'Показать текст пожертвования'}
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
