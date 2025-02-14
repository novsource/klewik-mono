import { forwardRef } from "react";
import { cn } from "~/app/_shared/utils";
import { buttonVariants, ButtonVariantsProps } from "../styles/button-variants";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps
  extends React.ComponentProps<"button">,
    Omit<ButtonVariantsProps, "startContent" | "endContent"> {
  asChild?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, isIconOnly, variant, size, asChild = false, ...props },
    ref,
  ) => {
    const { children, startContent, endContent, ...otherProps } = props;

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            isIconOnly,
            startContent: !!startContent,
            endContent: !!endContent,
          }),
          className,
        )}
        ref={ref}
        {...otherProps}
      >
        {startContent}
        {!isIconOnly && children}
        {endContent}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
