"use client";

import { HTMLAttributes, useEffect, useRef } from "react";
import { useAppContext } from "~/app/_shared/context";
import { useIntersection } from "~/app/_shared/hooks/use-intersection";
import { Typography } from "~/app/_shared/ui/typography";

type AuctionTitleProps = {
  title: string;
  styles?: HTMLAttributes<HTMLDivElement>["style"];
};

const AuctionTitle = ({ title }: AuctionTitleProps) => {
  const {
    state: { title: titleView },
    dispatchers,
  } = useAppContext();

  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersection(titleWrapperRef, { threshold: 0 });

  useEffect(() => {
    if (titleView.entry !== intersection.entry) {
      dispatchers?.title(intersection);
    }
  }, [dispatchers, intersection, titleView]);

  return (
    <div
      ref={titleWrapperRef}
      className="flex flex-col gap-y-0.5"
      style={{ opacity: titleView.entry?.intersectionRatio ?? 1 }}
    >
      <Typography tag="h1">{title}</Typography>
      <Typography className="text-xs tablet:text-sm text-gray" tag="span">
        Cоздан: {new Intl.DateTimeFormat().format(Date.now())}
      </Typography>
    </div>
  );
};

export { AuctionTitle };
