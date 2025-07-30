import { CloverAnimation } from '~widgets/big-clover-animation/ui'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'
import { Wizard } from '~shared/ui/wizard'

import { cn } from '~shared/utils'

import {
  WELCOME_PAGE_WIZARD_ITEMS_IDS,
  welcomePageWizardMap,
} from '../constants'
import {
  WizardAuctionParametersItem,
  WizardCreateAuctionItem,
  WizardLoginAdminItem,
  WizardSuccessCreatedItem,
  WizardWelcomeItem,
} from './wizard-content'

const IS_CLOVER_CAN_BE_SAFEFULLY_RENDERED
  = !!HTMLCanvasElement.prototype.transferControlToOffscreen
    && !navigator.userAgent.includes('Firefox')

const WelcomePage = () => {
  return (
    <main className="h-full w-full">
      <Flex className="h-full w-full" direction="row">
        <div
          className={cn(
            'container mx-auto h-full grow landtop:min-w-[450px]',
            IS_CLOVER_CAN_BE_SAFEFULLY_RENDERED
            && 'max-w-[650px] basis-1/4 landtop:basis-1/5',
            !IS_CLOVER_CAN_BE_SAFEFULLY_RENDERED && 'max-w-[1200px]',
          )}
        >
          <div className="h-full w-full px-4 desktop:px-8 desktop-lg:px-10">
            <div className="relative grid h-full w-full grid-cols-1 grid-rows-slider justify-between overflow-scroll">
              <div className="pt-5">
                <Button
                  className="w-full bg-yellow/40 text-yellow hover:bg-yellow/30 tablet:text-nowrap"
                  startContent={<Icons.Warning size="sm" />}
                  size="sm"
                >
                  Прочитать перед использованием!
                </Button>
              </div>

              <Wizard
                className="relative flex flex-col items-center w-full h-full"
                wizardMap={welcomePageWizardMap}
                initialStepId={WELCOME_PAGE_WIZARD_ITEMS_IDS.WELCOME}
              >
                <div className="welcome-wizard__spacer" />
                <div className="my-8 w-full px-0.25">
                  <WizardWelcomeItem />
                  <WizardCreateAuctionItem />
                  <WizardLoginAdminItem />
                  <WizardAuctionParametersItem />
                  <WizardSuccessCreatedItem />
                </div>
                <div className="welcome-wizard__spacer" />
              </Wizard>

              <div className="py-4">
                <Flex
                  className="w-fit items-center gap-x-2 text-gray-accent transition-all hover:text-white"
                  component="a"
                  href="https://www.github.com"
                  target="_blank"
                >
                  <Icons.Github
                    size="sm"
                    className="text-gray-light transition-colors hover:text-gray-accent"
                  />
                  <Typography
                    tag="span"
                    className="hidden font-golos-f desktop-lg:inline-block desktop-lg:text-md desktop-lg:font-medium"
                  >
                    Github
                  </Typography>
                </Flex>
              </div>
            </div>
          </div>
        </div>
        {IS_CLOVER_CAN_BE_SAFEFULLY_RENDERED && (
          <Flex className="hidden h-full w-full shrink-[2] grow basis-2/3 landtop:block">
            <div className="w-full h-full p-5 overflow-clip">
              <CloverAnimation />
            </div>
          </Flex>
        )}
      </Flex>
    </main>
  )
}

export default WelcomePage
