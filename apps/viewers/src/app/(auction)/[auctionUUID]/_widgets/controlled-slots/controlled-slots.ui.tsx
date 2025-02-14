"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Post, SlotsList } from "../../components/slots-list/";
import { SearchSlotsInput } from "../../components/search-slots-input";
import { useAppContext } from "~/app/_shared/context";
import { useIntersection } from "~/app/_shared/hooks/use-intersection";

type ControlledSlotsProps = {
  slots: Post[];
};

export const ControlledSlotsMemo = memo(function ControlledSlots(
  props: ControlledSlotsProps,
) {
  const [searchValue, setSearchValue] = useState<string>("");
  const {
    state: { searchBar },
    dispatchers,
  } = useAppContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const intersection = useIntersection(inputRef, { threshold: 0 });

  useEffect(() => {
    if (searchBar.entry !== intersection.entry) {
      dispatchers?.searchBar(intersection);
    }
  }, [intersection, dispatchers, searchBar]);

  return (
    <div className="flex h-full flex-col gap-y-4 px-0.5 mb-4">
      <div className="flex w-full justify-between max-tablet:flex-col max-tablet:gap-y-1">
        <SearchSlotsInput
          ref={inputRef}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <SlotsList slots={props.slots} filterTitle={searchValue} />
    </div>
  );
});
