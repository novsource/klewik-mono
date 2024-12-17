import { WheelContainer } from './wheel'
import WheelTab from './wheel-tabs/wheel-tab'

const AuctionWheelPage = () => {
  return (
    <div className="flex-shrink-1 flex h-full w-full py-4">
      <WheelContainer />
      <div className="h-full w-[500px] min-w-[300px] max-tablet:hidden">
        <WheelTab />
      </div>
    </div>
  )
}

export default AuctionWheelPage
