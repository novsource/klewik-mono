import { Link } from 'react-router-dom'

import { HeroCloverAnimation } from '~widgets/hero-clover-animation/ui/hero-clover.ui'

import { Text } from '~shared/components/typography'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Wizard } from '~shared/ui/wizard'

import { cn } from '~shared/utils'

import {
  WELCOME_PAGE_WIZARD_ITEMS_IDS,
  welcomePageWizardMap,
} from '../constants'
import {
  WizardAuctionParametersItem,
  WizardCreateNewAuctionItem,
  WizardLoginAdminItem,
  WizardLoginItem,
  WizardSuccessCreatedItem,
  WizardWelcomeItem,
} from './wizard-content'

// Firefox don't support animation
// const IS_HERO_CLOVER_ANIMATION_CAN_BE_SAFEFULLY_RENDERED
//   = !!HTMLCanvasElement.prototype.transferControlToOffscreen
//     && !navigator.userAgent.includes('Firefox')

export const WelcomePage = () => {
  return (
    <main className="h-screen w-full">
      <Flex className="h-full w-full" direction="row">
        <div
          className={cn(
            'container mx-auto h-full grow landtop:min-w-[450px]',
            'max-w-[650px] basis-1/4 landtop:basis-1/5',
          )}
        >
          <div className="h-full w-full px-4 desktop:px-8 desktop-lg:px-10">
            <div className="relative h-full w-full flex flex-col justify-between overflow-scroll">

              <a className="pt-5" href="#" target="_blank">
                <Button
                  className="w-full text-yellow hover:text-yellow hover:border-yellow/20 tablet:text-nowrap"
                  startContent={<Icons.Warning size="sm" />}
                  size="sm"
                >
                  Прочитайте перед использованием!
                </Button>
              </a>

              <Wizard
                className="relative flex flex-col items-center w-full h-full grow"
                wizardMap={welcomePageWizardMap}
                initialStepId={WELCOME_PAGE_WIZARD_ITEMS_IDS.WELCOME}
              >
                <div className="welcome-wizard__spacer" />
                <div className="my-8 w-full px-0.25">
                  <WizardWelcomeItem />
                  <WizardCreateNewAuctionItem />
                  <WizardLoginAdminItem />
                  <WizardAuctionParametersItem />
                  <WizardSuccessCreatedItem />
                  <WizardLoginItem />
                </div>
                <div className="welcome-wizard__spacer" />
              </Wizard>

              <div className="flex justify-between py-4">
                <Link
                  className="flex w-fit items-center gap-x-2 text-gray transition-all hover:text-gray-accent"
                  to="https://www.github.com"
                  target="_blank"
                >
                  <Icons.LinkArrow size="xs" />
                  <Text className="text-sm" asSpan>
                    Документация
                  </Text>
                </Link>

                <Link
                  className="flex w-fit items-center gap-x-2 text-gray transition-all hover:text-gray-accent"
                  to="https://www.github.com"
                  target="_blank"
                >
                  <Icons.Github size="sm" />
                  <Text
                    className="hidden font-golos-f desktop-lg:inline-block desktop-lg:text-md desktop-lg:font-medium"
                    asSpan
                  >
                    Github
                  </Text>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Flex className="hidden h-full w-full shrink-[2] grow basis-2/3 landtop:block">
          <div className="w-full h-full p-5 overflow-clip">
            <HeroCloverAnimation />
          </div>
        </Flex>
      </Flex>
    </main>
  )
}
