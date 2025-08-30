import { Flex } from '~shared/ui/flex'

import { cn } from '~shared/utils'

import { auctionWheelPageStyles } from '../styles'
import { Wheel } from './wheel'
import { WheelTabs } from './wheel-tabs'

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
