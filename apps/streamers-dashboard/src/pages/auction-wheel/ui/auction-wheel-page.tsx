import { WheelTabs } from '~widgets/wheel-tabs/ui'
import { WheelContainer } from '~widgets/wheel/ui'

const AuctionWheelPage = () => {
  return (
    <div className="flex-shrink-1 flex h-full w-full pb-4">
      <WheelContainer />
      <div className="h-full w-[500px] min-w-[300px] max-tablet:hidden">
        <WheelTabs />
      </div>
    </div>
  )
}

export default AuctionWheelPage
