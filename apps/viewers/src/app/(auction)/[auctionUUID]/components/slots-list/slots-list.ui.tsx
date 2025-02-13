"use client";

import { memo, useEffect, useState } from "react";
import { SlotCard } from "../slot-card";

type SlotsListProps = {
  slots: Post[];
  filterTitle?: string | null;
};

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const filterSlotsByTitle = (slots: Post[], filterTitle: Post["title"]) => {
  return slots.filter((slot) =>
    slot.title.toLocaleLowerCase().includes(filterTitle.toLocaleLowerCase()),
  );
};

const SlotsList = memo(function List(props: SlotsListProps) {
  const [slots, setSlots] = useState<Post[]>(() => {
    if (props.filterTitle === undefined || props.filterTitle === null)
      return props.slots;

    return filterSlotsByTitle(props.slots, props.filterTitle);
  });

  useEffect(() => {
    if (!props.filterTitle || props.filterTitle === null) {
      return setSlots(props.slots);
    }

    const newSlots = filterSlotsByTitle(props.slots, props.filterTitle);

    setSlots([...newSlots]);
  }, [props?.filterTitle, props.slots]);

  return (
    <ul className="flex flex-col gap-y-2 pb-4">
      {slots.map((slot) => (
        <li key={slot.id}>
          <SlotCard
            id={slot.id}
            name={slot.title}
            points={1000}
            percent={10}
            color="#FFF"
          />
        </li>
      ))}
    </ul>
  );
});

export { SlotsList };
