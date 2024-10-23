import AnimatedTruncText from './AnimatedTruncText';

const LotCard = (props: AuctionSlot) => {
  const {_id, auctionColor, name, tag, value, ownerId, sponsorsIds} = props;

  return (
    <div className="h-10 py-2 px-3 flex w-full items-center justify-between bg-dark-accent rounded-small gap-x-3">
      <div
        style={{backgroundColor: `${auctionColor}`}}
        className="w-4 h-4 rounded-pill"
      />
      <AnimatedTruncText>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab deleniti
        repellat, commodi aliquid,
      </AnimatedTruncText>
    </div>
  );
};

export default LotCard;
