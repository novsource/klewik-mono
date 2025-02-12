"use client";

import { memo, useLayoutEffect, useRef, useState } from "react";
import { Post, SlotsList } from "../../components/slots-list/";
import { SearchSlotsInput } from "../../components/search-slots-input";

type ControlledSlotsProps = {
  slots: Post[];
};

export const ControlledSlotsMemo = memo(function ControlledSlots(
  props: ControlledSlotsProps,
) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [listHeight, setListHeight] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;

    const height = element.getBoundingClientRect().height;

    setListHeight(height);
  }, [containerRef]);

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-y-4 px-0.5">
      <div className="flex w-full justify-between max-tablet:flex-col max-tablet:gap-y-1">
        <SearchSlotsInput onChange={(e) => setSearchValue(e.target.value)} />
      </div>
      <SlotsList
        slots={props.slots}
        filterTitle={searchValue}
        listHeight={listHeight}
      />
    </div>
  );
});
