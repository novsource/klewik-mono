import { InputHTMLAttributes, forwardRef, useMemo, useState } from 'react'

import { Typography } from '~shared/ui/typograghy'

import { CvaClassValue } from '~shared/utils/types'

import { cn } from '~shared/utils'

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
    slotClassNames?: {
      [Slot in InputSlots]?: CvaClassValue
    }
  }

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

  const contentBaseStyle = useMemo(
    () => cn(contentVariants(), classNames?.base),
    [classNames?.base]
  )
  const contentWrapperStyle = useMemo(
    () =>
      cn(
        contentWrapperVariants({
          size,
          isError: !!errorMessage,
        }),
        classNames?.wrapper
      ),
    [classNames?.wrapper, size, errorMessage]
  )

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
          setIsHover(true)
        }}
        onMouseLeave={() => {
          setIsHover(false)
        }}
      >
        {startContent}
        {baseInput}
        {endContent}
      </div>
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
  )
})
Input.displayName = 'Input'

export { Input }
