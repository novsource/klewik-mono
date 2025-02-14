"use client";

import { useAppContext } from "~/app/_shared/context/app-context";
import { Header } from "~/app/_shared/ui/header";

import { Typography } from "~/app/_shared/ui/typography";
import { cn } from "~/app/_shared/utils";
import { Button } from "~/app/_shared/ui/button";
import { MagnifierIcon } from "~/app/_shared/ui/icons";

const AuctionHeader = () => {
  const {
    state: { searchBar, title },
  } = useAppContext();

  return (
    <Header
      className={cn("tablet:px-0 border-b-1")}
      style={{
        borderColor: `rgba(52,55,60, ${1 - (title.entry?.intersectionRatio ?? 1)})`,
      }}
    >
      <div className="h-full w-full">
        <div className="grid grid-cols-3 h-full w-full items-center tablet:px-2">
          <div
            className={cn("flex flex-col")}
            style={{
              opacity: 1 - (title.entry?.intersectionRatio ?? 1),
            }}
          >
            <Typography
              className="text-md font-semibold leading-4 text-nowrap"
              tag="span"
            >
              Тестовый аукцион
            </Typography>
            <Typography
              className="text-[10px] text-gray text-nowrap"
              tag="span"
            >
              Cоздан: {new Intl.DateTimeFormat().format(Date.now())}
            </Typography>
          </div>
          <Button
            className={cn(
              "hidden bg-dark text-gray rounded-pill w-full font-medium gap-x-2 h-7 [&_svg]:size-3 hover:text-gray-light hover:bg-dark-accent/60",
              !searchBar.inView &&
                "inline-flex transition-all justify-self-center",
            )}
            startContent={<MagnifierIcon className="text-gray" />}
            size="sm"
            style={{ opacity: 1 - (searchBar.entry?.intersectionRatio ?? 1) }}
          >
            Перейти к строке поиска{" "}
          </Button>
        </div>
      </div>
    </Header>
  );
};

export { AuctionHeader };
