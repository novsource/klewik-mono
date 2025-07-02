import { WheelContainer } from '~entities/wheel/ui'

import { Flex } from '~shared/ui/flex'
import { cn } from '~shared/utils'

import { auctionWheelPageStyles } from '../styles'
import { WheelTabs } from './wheel-tabs'

const AuctionWheelPage = () => {
  return (
    <div className={cn(auctionWheelPageStyles.pageWrapper)}>
      <Flex className={cn(auctionWheelPageStyles.wheelWrapper)}>
        <WheelContainer />
        <div className={cn(auctionWheelPageStyles.wheelTabsWrapper)}>
          <WheelTabs />
        </div>
      </Flex>
    </div>
  )
}

export default AuctionWheelPage
