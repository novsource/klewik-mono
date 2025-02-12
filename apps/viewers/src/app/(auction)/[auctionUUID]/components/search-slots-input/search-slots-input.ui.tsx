"use client";

import { MagnifierIcon } from "~/app/_shared/ui/icons";
import { Input } from "~/app/_shared/ui/input";
import { InputProps } from "~/app/_shared/ui/input/ui/input.ui";

type SearchSlotsInputProps = InputProps;

export const SearchSlotsInput = (props: SearchSlotsInputProps) => {
  return (
    <Input
      slotClassNames={{ base: "min-w-[300px] max-w-[400px] grow" }}
      placeholder="Поиск по названию слота..."
      startContent={<MagnifierIcon className="text-gray" size="sm" />}
      {...props}
    />
  );
};
