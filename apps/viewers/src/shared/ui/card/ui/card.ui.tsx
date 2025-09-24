import * as React from "react";

import { CardContextProps } from "../context/card-context";
import {
  CardStyleProps,
  cardBaseVariants,
  cardContentVariants,
  cardDescriptionVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardTitleVariants,
} from "../styles/card-variants";
import { cn } from "~/_shared/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & CardStyleProps
>(({ className, size, variant, ...htmlProps }, ref) => {
  const style = React.useMemo(
    () => cn(cardBaseVariants({ size, variant }), className),
    [className, size, variant],
  );

  return <div ref={ref} className={style} {...htmlProps} />;
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CardContextProps
>(({ className, ...props }, ref) => {
  const { size, variant } = props;

  const style = React.useMemo(
    () => cn(cardHeaderVariants({ size, variant }), className),
    [className, size, variant],
  );

  return <div ref={ref} className={style} {...props} />;
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CardContextProps
>(({ className, ...props }, ref) => {
  const { size, variant } = props;

  const style = React.useMemo(
    () => cn(cardTitleVariants({ size, variant }), className),
    [className, size, variant],
  );

  return <div ref={ref} className={style} {...props} />;
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CardContextProps
>(({ className, ...props }, ref) => {
  const { size, variant } = props;

  const style = React.useMemo(
    () => cn(cardDescriptionVariants({ size, variant }), className),
    [className, size, variant],
  );

  return <div ref={ref} className={style} {...props} />;
});
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CardContextProps
>(({ className, ...props }, ref) => {
  const { size, variant } = props;

  const style = React.useMemo(
    () => cn(cardContentVariants({ size, variant }), className),
    [className, size, variant],
  );

  return <div ref={ref} className={style} {...props} />;
});
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CardContextProps
>(({ className, ...props }, ref) => {
  const { size, variant } = props;

  const style = React.useMemo(
    () => cn(cardFooterVariants({ size, variant }), className),
    [className, size, variant],
  );

  return <div ref={ref} className={style} {...props} />;
});
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
