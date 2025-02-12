"use client";

import { memo, useState } from "react";
import { Post, SlotsList } from "../../components/slots-list/";
import { SearchSlotsInput } from "../../components/search-slots-input";
import { Typography } from "~/app/_shared/ui/typography";
import { RefreshTimer } from "../../components/refresh-timer";

type ControlledSlotsProps = {
  slots: Post[];
};

export const ControlledSlotsMemo = memo(function ControlledSlots(
  props: ControlledSlotsProps,
) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex w-full justify-between">
        <SearchSlotsInput onChange={(e) => setSearchValue(e.target.value)} />
        <Typography className="text-sm" tag="span">
          Сайт обновится через:{" "}
          {<RefreshTimer startTime={Date.now()} value={120} />} секунд
        </Typography>
      </div>
      <SlotsList slots={props.slots} filterTitle={searchValue} />
    </div>
  );
});
