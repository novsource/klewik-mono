'use client'

import type {
  InputSlots,
  InputVariantsProps,
} from '../styles/input-variants'

import type { ComponentProps, JSX } from 'react'
import { forwardRef, useMemo, useState } from 'react'

import type { ClassValue } from 'class-variance-authority/dist/types'

import { Typography } from '~components/ui/typography'

import { cn } from '~utils/index'

import {
  contentVariants,
  contentWrapperVariants,
  descriptionVariants,
  inputVariants,
  labelVariants,
  sidesSectionsVariants,
} from '../styles/input-variants'

export type InputSlotsClassnames = {
  [Slot in InputSlots]?: ClassValue
}

export type InputProps = Omit<ComponentProps<'input'>, 'size' | 'className'>
  & Omit<
    InputVariantsProps,
    'withLabel' | 'startContent' | 'endContent' | 'isError'
  > & {
    label?: {
      id: string
      value: string
    }
    variant?: 'default' | 'ghost'
    startContent?: JSX.Element | string
    endContent?: JSX.Element | string
    description?: string
    errorMessage?: string
    slotClassNames?: InputSlotsClassnames
  }

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    description,
    size,
    errorMessage,
    startContent,
    endContent,
    variant,
    type,
    slotClassNames: classNames,
    label,
    onFocus,
    onBlur,
    disabled,
    ...otherProps
  } = props

  const [isHovered, setIsHover] = useState(false)
  const [isFocused, setIsFocus] = useState(false)

  const labelStyle = useMemo(
    () =>
      cn(labelVariants({ size, isError: !!errorMessage }), classNames?.label),
    [classNames?.label, size, errorMessage],
  )

  const descriptionStyle = useMemo(
    () =>
      cn(
        descriptionVariants({ size, isError: !!errorMessage }),
        classNames?.description,
      ),
    [size, errorMessage, classNames?.description],
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
        classNames?.input,
      ),
    [size, startContent, endContent, label, errorMessage, classNames?.input],
  )

  const baseInput = (
    <input
      id={label?.id}
      type={type ?? 'text'}
      className={baseInputStyle}
      ref={ref}
      disabled={disabled}
      data-slot="input"
      onFocus={(event) => {
        onFocus?.(event)
        setIsFocus(true)
      }}
      onBlur={(event) => {
        onBlur?.(event)
        setIsFocus(false)
      }}
      {...otherProps}
    />
  )

  const contentBaseStyle = useMemo(
    () => cn(contentVariants(), classNames?.base),
    [classNames?.base],
  )
  const contentWrapperStyle = useMemo(
    () =>
      cn(
        contentWrapperVariants({
          variant,
          size,
          isError: !!errorMessage,
          isDisabled: disabled,
        }),
        classNames?.wrapper,
      ),
    [classNames?.wrapper, size, errorMessage, disabled, variant],
  )

  const sidesContentStyle = useMemo(() => cn(sidesSectionsVariants({ size })), [size])

  return (
    <div className={contentBaseStyle} data-slot="base">
      {label && (
        <label
          htmlFor={label.id}
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
        <div className={cn(sidesContentStyle, classNames?.startContent)} data-side="start">
          {startContent}
        </div>
        {baseInput}
        <div className={cn(sidesContentStyle, classNames?.endContent)} data-side="end">
          {endContent}
        </div>
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
