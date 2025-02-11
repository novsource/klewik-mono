import { VariantProps, cva } from "class-variance-authority";

import { TypographyTags } from "../ui/typography.ui";
import { CvaClassValue } from "~/app/_shared/lib/cva/cva.types";

type TypographyVariants = {
  tag: {
    [Tag in TypographyTags]: CvaClassValue;
  };
};

export const typographyVariants = cva<TypographyVariants>("", {
  variants: {
    tag: {
      h1: "text-title-lg font-bold leading-5 landtop:leading-7 landtop:text-title-xl desktop-xl:text-[24px]",
      h2: "text-title-lg font-bold",
      h3: "text-title font-semibold",
      h4: "text-md font-semibold",
      span: "text-md font-medium",
      p: "text-md font-regular",
    },
  },
});

export type TypographyVariantsProps = VariantProps<typeof typographyVariants>;
