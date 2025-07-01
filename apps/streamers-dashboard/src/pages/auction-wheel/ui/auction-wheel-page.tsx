import { WheelContainer } from '~entities/wheel/ui'

import { Flex } from '~shared/ui/flex'

import { WheelTabs } from './wheel-tabs'

const AuctionWheelPage = () => {
  return (
    <div className="h-full desktop:max-w-[1950px] desktop-lg:max-w-[2150px] mx-auto pt-5">
      <Flex className="shrink w-full h-full">
        <WheelContainer />
        <div className="h-full basis-[30%] tablet:basis-[50%] landtop:basis-[40%] desktop-lg:basis-[35%] max-tablet:hidden">
          <WheelTabs />
        </div>
      </Flex>
    </div>
  )
}

export default AuctionWheelPage
