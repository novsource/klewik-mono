import { WheelTabs } from '~widgets/wheel-tabs/ui'
import { WheelContainer } from '~widgets/wheel/ui'

const AuctionWheelPage = () => {
  return (
    <div className="h-full pb-4 max-w-[1500px] desktop:max-w-[1800px] desktopLg:max-w-[2100px] mx-auto">
      <div className="flex h-full w-full flex-shrink-1">
        <WheelContainer />
        <div className="h-full w-[500px] min-w-[300px] max-tablet:hidden">
          <WheelTabs />
        </div>
      </div>
    </div>
  )
}

export default AuctionWheelPage
