"use client";

import { memo, useState } from "react";
import { Post, SlotsList } from "../../components/slots-list/";
import { SearchSlotsInput } from "../../components/search-slots-input";

type ControlledSlotsProps = {
  slots: Post[];
};

export const ControlledSlotsMemo = memo(function ControlledSlots(
  props: ControlledSlotsProps,
) {
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <div className="flex h-full flex-col gap-y-4 px-0.5 mb-4">
      <div className="flex w-full justify-between max-tablet:flex-col max-tablet:gap-y-1">
        <SearchSlotsInput onChange={(e) => setSearchValue(e.target.value)} />
      </div>
      <SlotsList slots={props.slots} filterTitle={searchValue} />
    </div>
  );
});
