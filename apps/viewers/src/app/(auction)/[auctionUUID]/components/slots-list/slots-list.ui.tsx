"use client";

import { memo, useEffect, useRef, useState } from "react";
import { SlotCard } from "../slot-card";
import { cn } from "~/app/_shared/utils";

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

const SlotsList = memo(function List(props: SlotsListProps) {
  const [slots, setSlots] = useState<Post[]>(() => {
    if (!props.filterTitle || props.filterTitle === null) return props.slots;

    return props.slots.filter((slot) =>
      slot.title.includes(props?.filterTitle),
    );
  });

  const renderCounts = useRef(-1);

  renderCounts.current++;

  useEffect(() => {
    if (!props.filterTitle || props.filterTitle === null) {
      return setSlots(props.slots);
    }

    const newSlots = props.slots.filter((slot) =>
      slot.title.includes(props?.filterTitle),
    );

    setSlots([...newSlots]);
  }, [props?.filterTitle, props.slots]);

  return (
    <ul className="flex flex-col gap-y-2 my-2 overflow-y-scroll">
      {slots.map((slot, index) => (
        <li
          className={cn("animate-fade-in")}
          key={slot.id}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <SlotCard
            id={slot.id}
            color="#F0F0F0"
            name={slot.title}
            points={1000}
            percent={10}
          />
        </li>
      ))}
    </ul>
  );
});

export { SlotsList };
