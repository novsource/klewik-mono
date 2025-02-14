"use client";

import { memo, useEffect, useMemo } from "react";
import { Post, SlotsList } from "../../components/slots-list/";
import { SearchSlotsInput } from "../../components/search-slots-input";
import { useAppContext } from "~/app/_shared/context";
import { useIntersection } from "~/app/_shared/hooks/use-intersection";
import { useSearchContext } from "~/app/_shared/context/search-bar-context/search-bar-context";

type ControlledSlotsProps = {
  slots: Post[];
};

export const ControlledSlotsMemo = memo(function ControlledSlots(
  props: ControlledSlotsProps,
) {
  const {
    state: { searchBar },
    dispatchers,
  } = useAppContext();
  const { inputRef, setSearchText, searchText } = useSearchContext();

  const intersection = useIntersection(inputRef, { threshold: 0 });

  useEffect(() => {
    if (searchBar.entry !== intersection.entry) {
      dispatchers?.searchBar(intersection);
    }
  }, [intersection, dispatchers, searchBar]);

  const searchInput = useMemo(() => {
    return (
      <SearchSlotsInput
        ref={inputRef}
        onChange={(e) => setSearchText(e.target.value)}
      />
    );
  }, [inputRef, setSearchText]);

  return (
    <div className="flex h-full flex-col gap-y-4 px-0.5 mb-4">
      <div className="flex w-full justify-between max-tablet:flex-col max-tablet:gap-y-1">
        {searchInput}
      </div>
      <SlotsList slots={props.slots} filterTitle={searchText} />
    </div>
  );
});
