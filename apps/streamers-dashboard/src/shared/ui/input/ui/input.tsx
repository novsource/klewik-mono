import { InputHTMLAttributes, forwardRef, useMemo, useState } from 'react'

import { Typography } from '~shared/ui/typograghy'
import { cn } from '~shared/utils'
import { CvaClassValue } from '~shared/utils/types'

import {
  InputSlots,
  InputVariantsProps,
  contentVariants,
  contentWrapperVariants,
  descriptionVariants,
  inputVariants,
  labelVariants,
} from '../styles/input-variants'

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'className'
> &
  Omit<
    InputVariantsProps,
    'withLabel' | 'startContent' | 'endContent' | 'isError'
  > & {
    label?: {
      id: string
      value: string
    }
    startContent?: JSX.Element
    endContent?: JSX.Element
    description?: string
    errorMessage?: string
    classNames?: Record<InputSlots, NullablePossible<CvaClassValue>>
  }

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    description,
    size,
    errorMessage,
    startContent,
    endContent,
    type,
    classNames,
    label,
    onFocus,
    onBlur,
    ...otherProps
  } = props

  const [isHovered, setIsHover] = useState(false)
  const [isFocused, setIsFocus] = useState(false)

  const labelStyle = useMemo(
    () =>
      cn(labelVariants({ size, isError: !!errorMessage }), classNames?.label),
    [size, label, errorMessage, classNames?.label]
  )

  const descriptionStyle = useMemo(
    () =>
      cn(
        descriptionVariants({ size, isError: !!errorMessage }),
        classNames?.description
      ),
    [size, label, errorMessage, classNames?.description]
  )

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
        classNames?.input
      ),
    [size, startContent, endContent, label, errorMessage, classNames?.input]
  )

  const baseInput = (
    <input
      type={type}
      className={baseInputStyle}
      ref={ref}
      data-slot="input"
      onFocus={(e) => {
        onFocus && onFocus(e)
        setIsFocus(true)
      }}
      onBlur={(e) => {
        onBlur && onBlur(e)
        setIsFocus(false)
      }}
      {...otherProps}
    />
  )

  const inputDefault = useMemo(() => {
    const contentBaseStyle = cn(
      contentVariants({ size, isError: !!errorMessage }),
      classNames?.base
    )
    const contentWrapperStyle = cn(
      contentWrapperVariants({
        size,
      }),
      classNames?.wrapper
    )

    return (
      <div
        className={contentBaseStyle}
        data-slot="base"
        data-hover={isHovered}
        data-focus={isFocused}
        onMouseEnter={() => {
          setIsHover(true)
        }}
        onMouseLeave={() => {
          setIsHover(false)
        }}
      >
        <div className={contentWrapperStyle} data-slot="wrapper">
          {startContent}
          {baseInput}
          {endContent}
        </div>
      </div>
    )
  }, [
    size,
    baseInput,
    startContent,
    endContent,
    isFocused,
    isHovered,
    errorMessage,
    classNames?.base,
    classNames?.wrapper,
    classNames?.input,
  ])

  if (!label && (startContent || endContent)) {
    return inputDefault
  }

  return label || errorMessage || description ? (
    <div className="flex w-full flex-col gap-y-2">
      {label && (
        <label
          htmlFor={label.id.toLocaleLowerCase()}
          className={labelStyle}
          data-slot="label"
        >
          {label.value}
        </label>
      )}
      {inputDefault}
      {(errorMessage || description) && (
        <Typography
          tag="p"
          className={descriptionStyle}
          data-slot="description"
        >
          {errorMessage || description}
        </Typography>
      )}
    </div>
  ) : (
    inputDefault
  )
})
Input.displayName = 'Input'

export { Input }
