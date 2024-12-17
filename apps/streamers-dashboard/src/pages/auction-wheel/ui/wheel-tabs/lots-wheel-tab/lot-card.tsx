import { AnimatedTruncText } from '~shared/ui/animated-trunc-text'

const LotCard = (props: AuctionSlot) => {
  const { _id, slotHSVColor: auctionColor, name, points, sponsorsIds } = props

  return (
    <div className="flex h-10 w-full items-center justify-between gap-x-2 rounded-small bg-dark px-3 py-2">
      <div
        style={{ backgroundColor: `${auctionColor}` }}
        className="h-3 w-3 rounded-pill"
      />
      <AnimatedTruncText classNames="text-[15px] font-medium">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab deleniti
        repellat, commodi aliquid,
      </AnimatedTruncText>
    </div>
  )
}

export default LotCard
