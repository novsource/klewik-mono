import { HTMLAttributes, ReactNode } from "react";

import { ClassValue } from "clsx";
import { Typography } from "~/app/_shared/ui/typography";
import { cn } from "~/app/_shared/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_shared/ui/card";
import Image from "next/image";

type AuctionCardChipProps = {
  children?: ReactNode;
  style?: HTMLAttributes<HTMLDivElement>["style"];
  startContent?: ReactNode;
  endContent?: ReactNode;
  classNames?: {
    base?: ClassValue;
    text?: ClassValue;
  };
};

const AuctionCardChip = (props: AuctionCardChipProps) => {
  const { children, startContent, endContent, classNames } = props;

  return (
    <div
      className={cn(
        "px-2 py-1 bg-gray/30 flex gap-x-1.5 items-center justify-center rounded-md",
        classNames?.base,
      )}
    >
      {startContent}
      <Typography
        className={cn(
          "text-sm max-tablet:leading-4.5 tablet:text-md font-medium text-gray-accent",
          classNames?.text,
        )}
        tag="span"
      >
        {children}
      </Typography>
      {endContent}
    </div>
  );
};

type AuctionSlotCardProps = AuctionSlot & {
  percent: string | number;
};

export default function SlotCard(props: AuctionSlotCardProps) {
  const { id, name, points, percent } = props;
  return (
    <Card className="flex flex-col justify-between border-1 border-dark gap-y-3 py-2">
      <CardHeader className="flex items-start justify-between pt-0">
        <CardTitle className="w-full">
          <Typography
            tag="span"
            className="inline-block font-semibold font-golos-f leading-5 tablet:text-title"
          >
            {name}
          </Typography>
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex flex-col gap-y-2 pt-0">
        <div className="w-full flex gap-x-1.5 mobile:gap-x-2 items-center">
          <AuctionCardChip
            startContent={
              <Image
                src="/id.svg"
                className="text-gray-light"
                width={14}
                height={14}
                alt="id logo"
              />
            }
          >
            {id}
          </AuctionCardChip>
          <AuctionCardChip
            startContent={
              <Image
                src="/coin.svg"
                className="text-gray-light"
                width={14}
                height={14}
                alt="coin logo"
              />
            }
          >
            {Intl.NumberFormat("ru-Ru").format(points).toString()}
          </AuctionCardChip>
          <AuctionCardChip
            classNames={{ base: "bg-green/20", text: "text-green" }}
          >
            {percent}%
          </AuctionCardChip>
        </div>
      </CardContent>
    </Card>
  );
}
