"use client";

import { useAppContext } from "~/app/_shared/context/app-context";
import { Header } from "~/app/_shared/ui/header";

import { Typography } from "~/app/_shared/ui/typography";
import { cn } from "~/app/_shared/utils";

const AuctionHeader = () => {
  const {
    state: { integrations },
  } = useAppContext();

  return (
    <Header
      className={cn("tablet:px-0 border-b-1")}
      style={{ borderColor: `rgba(90,93,97, ${1 - integrations.ratio})` }}
    >
      <div className="h-full w-full">
        <div className="flex h-full w-full items-center tablet:px-4">
          <Typography
            className="text-md font-semibold"
            tag="span"
            style={{ opacity: 1 - integrations.ratio }}
          >
            Аукцион №1000
          </Typography>
        </div>
      </div>
    </Header>
  );
};

export { AuctionHeader };
