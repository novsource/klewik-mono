import { WheelTabs } from '~widgets/wheel-tabs/ui'
import { WheelContainer } from '~widgets/wheel/ui'

const AuctionWheelPage = () => {
  return (
    <div className="h-full desktop:max-w-[1950px] desktop-lg:max-w-[2150px] mx-auto">
      <div className="flex h-full w-full flex-shrink-1">
        <WheelContainer />
        <div className="h-full basis-[30%] tablet:basis-[50%] landtop:basis-[40%] desktop-lg:basis-[35%] max-tablet:hidden">
          <WheelTabs />
        </div>
      </div>
    </div>
  )
}

export default AuctionWheelPage
