import { VariantProps, cva } from "class-variance-authority";
import { CvaClassValue } from "~/app/_shared/lib/cva";

type ButtonVariant =
  | "default"
  | "action"
  | "outline"
  | "destructive"
  | "secondary"
  | "ghost"
  | "link";

type ButtonSize = "sm" | "default" | "lg";

type ButtonVariants = {
  variant: {
    [Variant in ButtonVariant]: CvaClassValue;
  };
  size: {
    [Size in ButtonSize]: CvaClassValue;
  };
  isIconOnly: {
    [Bool in "true" | "false"]: CvaClassValue;
  };
  startContent: {
    [Bool in "true" | "false"]: CvaClassValue;
  };
  endContent: {
    [Bool in "true" | "false"]: CvaClassValue;
  };
};

export const buttonVariants = cva<ButtonVariants>(
  [
    "inline-flex items-center justify-center gap-2",
    "ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:shrink-0 [&_svg]:pointer-events-none",
    "whitespace-nowrap rounded-medium transition-colors select-none cursor-pointer",
  ],
  {
    variants: {
      variant: {
        default: "bg-dark text-gray-accent hover:bg-dark/80",
        action: "bg-green text-white hover:bg-green/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "bg-transparent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      isIconOnly: {
        true: "",
        false: "",
      },
      size: {
        default:
          "h-10 px-3 py-1 text-md leading-6 rounded-md font-medium [&_svg]:size-4.5",
        sm: "h-9 rounded-md px-2 text-sm leading-6 font-regular [&_svg]:size-4",
        lg: "h-11 rounded-md px-3 font-medium [&_svg]:size-5",
      },
      startContent: {
        true: "flex items-center justify-center gap-x-1",
        false: "",
      },
      endContent: {
        true: "flex items-center justify-center gap-x-1",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      isIconOnly: false,
    },
    compoundVariants: [
      { isIconOnly: true, size: "default", className: "px-3" },
      { isIconOnly: true, size: "sm", className: "px-2.5 h-8" },
    ],
  },
);

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>;
