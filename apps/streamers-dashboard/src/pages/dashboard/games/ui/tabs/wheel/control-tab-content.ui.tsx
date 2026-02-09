import { useMemo } from 'react'

import { controlWheelTabStyles } from '~pages/dashboard/games/styles'

import { Flex } from '~shared/ui/flex'

import { twSlotsStyles } from '~shared/utils'

import { SpinWheelButton } from '../../buttons/wheel/spin-wheel.ui'
import { SpinTimeInput } from '../../inputs/wheel/spin-time-input.ui'

export const WheelGameControllers = () => {
  const tabsContentStyles = useMemo(() => twSlotsStyles(controlWheelTabStyles), [])

  return (
    <Flex className={tabsContentStyles.controlsWrapper}>
      <SpinWheelButton className={tabsContentStyles.spinWheelButton} />
      <SpinTimeInput />
    </Flex>
  )
}
