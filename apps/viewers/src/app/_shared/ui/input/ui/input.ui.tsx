import {
  ComponentProps,
  forwardRef,
  ReactNode,
  useMemo,
  useState,
} from "react";

import {
  InputSlots,
  InputVariantsProps,
  contentVariants,
  contentWrapperVariants,
  descriptionVariants,
  inputVariants,
  labelVariants,
} from "../styles/input-variants";
import { CvaClassValue } from "~/app/_shared/lib/cva/cva.types";
import { cn } from "~/app/_shared/utils";

export type InputProps = Omit<ComponentProps<"input">, "size" | "className"> &
  Omit<
    InputVariantsProps,
    "withLabel" | "startContent" | "endContent" | "isError"
  > & {
    label?: {
      id: string;
      value: string;
    };
    startContent?: ReactNode;
    endContent?: ReactNode;
    description?: string;
    errorMessage?: string;
    slotClassNames?: {
      [Slot in InputSlots]?: CvaClassValue;
    };
  };

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    description,
    size,
    errorMessage,
    startContent,
    endContent,
    type,
    slotClassNames: classNames,
    label,
    onFocus,
    onBlur,
    ...otherProps
  } = props;

  const [isHovered, setIsHover] = useState(false);
  const [isFocused, setIsFocus] = useState(false);

  const labelStyle = useMemo(
    () =>
      cn(labelVariants({ size, isError: !!errorMessage }), classNames?.label),
    [size, errorMessage, classNames?.label],
  );

  const descriptionStyle = useMemo(
    () =>
      cn(
        descriptionVariants({ size, isError: !!errorMessage }),
        classNames?.description,
      ),
    [size, errorMessage, classNames?.description],
  );

  const baseInputStyle = useMemo(
    () =>
      cn(
        inputVariants({
          size,
          startContent: Boolean(startContent),
          endContent: Boolean(endContent),
          withLabel: Boolean(label),
          isError: Boolean(errorMessage),
        }),
        classNames?.input,
      ),
    [size, startContent, endContent, label, errorMessage, classNames?.input],
  );

  const baseInput = (
    <input
      type={type}
      className={baseInputStyle}
      ref={ref}
      data-slot="input"
      onFocus={(e) => {
        if (onFocus) onFocus(e);
        setIsFocus(true);
      }}
      onBlur={(e) => {
        if (onBlur) onBlur(e);
        setIsFocus(false);
      }}
      {...otherProps}
    />
  );

  const contentBaseStyle = useMemo(
    () => cn(contentVariants(), classNames?.base),
    [classNames?.base],
  );
  const contentWrapperStyle = useMemo(
    () =>
      cn(
        contentWrapperVariants({
          size,
          isError: !!errorMessage,
          startContent: !!startContent,
          endContent: !!endContent,
        }),
        classNames?.wrapper,
      ),
    [classNames?.wrapper, size, errorMessage, startContent, endContent],
  );

  return (
    <div className={contentBaseStyle} data-slot="base">
      {label && (
        <label
          htmlFor={label.id.toLocaleLowerCase()}
          className={labelStyle}
          data-slot="label"
        >
          {label.value}
        </label>
      )}
      <div
        className={contentWrapperStyle}
        data-slot="wrapper"
        data-hover={isHovered}
        data-focus={isFocused}
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
      >
        {startContent}
        {baseInput}
        {endContent}
      </div>
      {(errorMessage || description) && (
        <span className={descriptionStyle} data-slot="description">
          {errorMessage || description}
        </span>
      )}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
