"use client";

import { Input } from "~/app/_shared/ui/input";
import { InputProps } from "~/app/_shared/ui/input/ui/input.ui";

type SearchSlotsInputProps = InputProps;

export const SearchSlotsInput = (props: SearchSlotsInputProps) => {
  return (
    <Input
      slotClassNames={{ base: "max-w-[400px]" }}
      placeholder="Поиск по названию слота..."
      {...props}
    />
  );
};
