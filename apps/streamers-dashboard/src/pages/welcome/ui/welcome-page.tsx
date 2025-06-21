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
  WizardChooseRolesItem,
  WizardCreateAuctionItem,
  WizardLoginAdminItem,
  WizardLoginGuestItem,
  WizardSuccessCreatedItem,
  WizardWelcomeItem,
} from './wizard-content'

const IS_CLOVER_CAN_BE_SAFEFULLY_RENDERED =
  !!HTMLCanvasElement.prototype.transferControlToOffscreen &&
  !navigator.userAgent.includes('Firefox')

const WelcomePage = () => {
  return (
    <main className="h-full w-full">
      <Flex className="h-full w-full" direction="row">
        <div
          className={cn(
            'container mx-auto h-full grow landtop:min-w-[450px]',
            IS_CLOVER_CAN_BE_SAFEFULLY_RENDERED &&
              'max-w-[650px] basis-1/4 landtop:basis-1/5',
            !IS_CLOVER_CAN_BE_SAFEFULLY_RENDERED && 'max-w-[1200px]'
          )}
        >
          <div className="h-full w-full px-5 desktop:px-8 desktop-lg:px-10">
            <div className="relative grid h-full w-full grid-cols-1 grid-rows-slider justify-between">
              <div className="mt-5">
                <Button
                  className="w-full bg-yellow/40 text-yellow hover:bg-yellow/30 tablet:text-nowrap"
                  startContent={<Icons.Warning size="default" />}
                >
                  Прочитать перед использованием!
                </Button>
              </div>

              <div className="relative h-full w-full overflow-scroll">
                <Wizard
                  className="flex h-full w-full items-center justify-center px-0.5"
                  wizardMap={welcomePageWizardMap}
                  initialStepId={WELCOME_PAGE_WIZARD_ITEMS_IDS.WELCOME}
                >
                  <WizardWelcomeItem />
                  <WizardCreateAuctionItem />
                  <WizardLoginAdminItem />
                  <WizardLoginGuestItem />
                  <WizardChooseRolesItem />
                  <WizardAuctionParametersItem />
                  <WizardSuccessCreatedItem />
                </Wizard>
              </div>

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
          <Flex className="hidden h-full w-full shrink-[2] grow basis-2/3 border-l-[1px] border-dark bg-[#111] landtop:block">
            <CloverAnimation />
          </Flex>
        )}
      </Flex>
    </main>
  )
}

export default WelcomePage
