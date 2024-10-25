import AnimatedTruncText from './AnimatedTruncText'

const LotCard = (props: AuctionSlot) => {
  const { _id, auctionColor, name, tag, value, ownerId, sponsorsIds } = props

  return (
    <div className="flex h-10 w-full items-center justify-between gap-x-3 rounded-small bg-dark-accent px-3 py-2">
      <div
        style={{ backgroundColor: `${auctionColor}` }}
        className="h-4 w-4 rounded-pill"
      />
      <AnimatedTruncText>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab deleniti
        repellat, commodi aliquid,
      </AnimatedTruncText>
    </div>
  )
}

export default LotCard
