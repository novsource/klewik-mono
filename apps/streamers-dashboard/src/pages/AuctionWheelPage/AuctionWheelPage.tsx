import { WheelContainer } from './components/Wheel'
import WheelTab from './components/WheelTabs/WheelTab'

const AuctionWheelPage = () => {
  return (
    <div className="flex-shrink-1 flex h-full w-full px-2 py-4">
      <WheelContainer />
      <div className="h-full w-[500px] min-w-[300px]">
        <WheelTab />
      </div>
    </div>
  )
}

export default AuctionWheelPage
