type AuctionSlot = {
  id: number;
  name: string;
  points: number;
  color: string;
};

type Auction = {
  id: string;
  ownerId: string;
  url: string;
  wheelMode: "classic" | "dropout";
  isBetsClosed: boolean;
  isEnded: boolean;
  createAt: number;
  endedAt: number;
};
