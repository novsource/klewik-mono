import { Flex } from '~shared/ui/flex'

import { cn } from '~shared/utils'

import { auctionWheelPageStyles } from '../styles'
import { WheelTabs } from './wheel-tabs'
import { Wheel } from './wheel.ui'

const AuctionWheelPage = () => {
  return (
    <div className={cn(auctionWheelPageStyles.pageWrapper)}>
      <Flex className={cn(auctionWheelPageStyles.wheelWrapper)}>
        <Wheel />
        <div className={cn(auctionWheelPageStyles.wheelTabsWrapper)}>
          <WheelTabs />
        </div>
      </Flex>
    </div>
  )
}

export default AuctionWheelPage
