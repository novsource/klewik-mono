import { VariantProps, cva } from "class-variance-authority";

import { CvaClassValue } from "../../../lib/cva/cva.types";

export type InputSlots =
  | "base"
  | "input"
  | "wrapper"
  | "content"
  | "description"
  | "label";

type ErrorCvaVariants = {
  isError: {
    [Bool in "true" | "false"]: CvaClassValue;
  };
};

type SizesCvaVariants = {
  size: {
    default: CvaClassValue;
    sm: CvaClassValue;
    lg: CvaClassValue;
  };
};

type LabelVariants = SizesCvaVariants & ErrorCvaVariants;
type DescriptionVariants = SizesCvaVariants & ErrorCvaVariants;

type ContentBaseVariants = CvaClassValue;
type ContentWrapperVariants = SizesCvaVariants &
  ErrorCvaVariants & {
    startContent: {
      true: CvaClassValue;
    };
    endContent: {
      true: CvaClassValue;
    };
  };

type InputVariants = SizesCvaVariants &
  ErrorCvaVariants & {
    withLabel: {
      true: CvaClassValue;
    };
    startContent: {
      true: CvaClassValue;
    };
    endContent: {
      true: CvaClassValue;
    };
  };

export const labelVariants = cva<LabelVariants>("select-none", {
  variants: {
    size: {
      default: "text-md font-semibold",
      lg: "text-md font-semibold",
      sm: "text-sm font-medium",
    },
    isError: {
      true: "text-red",
      false: "text-white",
    },
  },
  defaultVariants: {
    size: "default",
    isError: false,
  },
});

export const descriptionVariants = cva<DescriptionVariants>(
  "text-gray-accent font-medium",
  {
    variants: {
      size: {
        default: "text-sm",
        lg: "text-sm",
        sm: "text-sm",
      },
      isError: {
        true: "text-red",
        false: "text-white",
      },
    },
    defaultVariants: {
      size: "default",
      isError: false,
    },
  },
);

export const contentVariants = cva<ContentBaseVariants>([
  "group flex flex-col gap-y-2",
]);

export const contentWrapperVariants = cva<ContentWrapperVariants>(
  [
    "relative",
    "border border-1 border-dark-accent focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-offset-1",
    "flex w-full items-center bg-dark transition-all ring-gray-light rounded-medium",
    "data-[focus=true]:ring-1 data-[hover=true]:ring-1 data-[focus=true]:bg-dark/70 data-[hover=true]:bg-dark/70",
  ],
  {
    variants: {
      size: {
        default: "h-10 gap-x-2 [&>svg]:size-4",
        sm: "h-9 py-2 gap-x-1.5 [&>svg]:size-3.5",
        lg: "h-11 py-2 gap-x-3 [&>svg]:size-4.5",
      },
      isError: { true: "ring-red/80 ring-1", false: "ring-gray-light" },
      startContent: {
        true: "pl-3",
      },
      endContent: {
        true: "pr-3",
      },
    },
    defaultVariants: {
      size: "default",
      isError: false,
    },
  },
);

export const inputVariants = cva<InputVariants>(
  [
    "inline-block flex w-full h-full items-center",
    "dark bg-transparent",
    "font-medium text-white",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-hidden",
    "ring-offset-background",
    "placeholder:text-gray",
  ],
  {
    variants: {
      size: {
        default: "py-3 px-4 text-md",
        lg: "text-md px-4",
        sm: "text-sm px-3 leading-3",
      },
      isError: {
        true: "focus-visible:ring-red",
        false: "focus-visible:ring-gray",
      },
      withLabel: {
        true: "",
      },
      startContent: {
        true: "px-0",
      },
      endContent: {
        true: "px-0",
      },
    },
    defaultVariants: {
      size: "default",
      isError: false,
      startContent: false,
      endContent: false,
      withLabel: false,
    },
  },
);

export type InputVariantsProps = VariantProps<typeof inputVariants>;
