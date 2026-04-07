import { useMemo } from 'react'

import { controlWheelTabStyles } from '~pages/dashboard/games/styles'

import { SpinTimeInput } from '~features/wheel/set-spin-time/ui'

import { Flex } from 'klewik-ui/flex'

import { twSlotsStyles } from '~shared/utils'

import { SpinWheelButton } from '../../buttons/spin-wheel-button.ui'

export const WheelGameControllers = () => {
  const tabsContentStyles = useMemo(() => twSlotsStyles(controlWheelTabStyles), [])

  return (
    <Flex className={tabsContentStyles.controlsWrapper}>
      <SpinWheelButton className={tabsContentStyles.spinWheelButton} />
      <SpinTimeInput />
    </Flex>
  )
}
