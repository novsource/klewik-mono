import { ReactNode, useState } from 'react'

import { ProcessedDonation } from '~entities/donation/model'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~shared/ui/sheet/ui'
import { Typography } from '~shared/ui/typograghy'

import { tailwindScreens } from '~shared/constants/tailwindcss'

import { ProcessDonationDialogIcon } from './dialog-icon'
import { ProcessDonationDialogTabs } from './dialog-tabs'

type ProcessDonationSheetProps = {
  donation: ProcessedDonation
  trigger: ReactNode
}

const ProcessDonationSheet = (props: ProcessDonationSheetProps) => {
  const { donation, trigger } = props

  const [isSheetOpened, setIsSheetOpened] = useState(false)

  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`
  )

  return (
    <Sheet open={isSheetOpened} onOpenChange={setIsSheetOpened}>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent side={isMediaLargeThenTablet ? 'right' : 'bottom'}>
        <Flex
          className="w-full h-full gap-y-4"
          direction="column"
          align="start"
        >
          <SheetHeader className="flex flex-col gap-y-4 w-full">
            <Flex className="gap-x-4 w-full">
              <ProcessDonationDialogIcon />
              <Flex direction="column" align="start">
                <SheetTitle>Управление пожертвованием</SheetTitle>
                <SheetDescription asChild>
                  <Typography
                    className="text-gray-accent font-normal leading-4"
                    tag="p"
                  >
                    Измените статус пожертвования
                  </Typography>
                </SheetDescription>
              </Flex>
            </Flex>
            <Divider />
          </SheetHeader>
          <Flex className="w-full h-full" direction="column">
            <ProcessDonationDialogTabs donation={donation} />
          </Flex>
        </Flex>
      </SheetContent>
    </Sheet>
  )
}

export { ProcessDonationSheet }
