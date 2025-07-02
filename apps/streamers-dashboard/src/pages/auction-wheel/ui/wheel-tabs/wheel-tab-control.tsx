import type { TabsContentProps } from '@radix-ui/react-tabs'

import { useMemo } from 'react'

import { TABS_CONTENT_NAMES } from '~pages/auction-wheel/constants'
import type { ControlWheelTabSlots } from '~pages/auction-wheel/styles'
import { controlWheelTabStyles } from '~pages/auction-wheel/styles'

import { SpinTimeInput } from '~features/wheel/set-spin-time/ui'
import { SpinWheelButton } from '~features/wheel/spin-wheel/ui'

import { Flex } from '~shared/ui/flex'
import { TabsContent } from '~shared/ui/tabs'
import { twSlotsStyles } from '~shared/utils'

type ControlWheelTabProps = Omit<TabsContentProps, 'value'> & {
  slotsClassnames?: Partial<Record<ControlWheelTabSlots, string>>
}

const ControlWheelTab = (props: ControlWheelTabProps) => {
  const { slotsClassnames, ...tabsContentProps } = props

  const tabsContentStyles = useMemo(() => twSlotsStyles(controlWheelTabStyles, slotsClassnames), [slotsClassnames])

  return (
    <TabsContent
      className={tabsContentStyles.content}
      value={TABS_CONTENT_NAMES.CONTROL}
      {...tabsContentProps}
    >
      <Flex className={tabsContentStyles.controlsWrapper}>
        <SpinWheelButton className={tabsContentStyles.spinWheelButton} />
        <SpinTimeInput />
      </Flex>
    </TabsContent>
  )
}

export { ControlWheelTab }
