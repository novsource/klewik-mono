import { InputHTMLAttributes, forwardRef, useMemo, useState } from 'react'

import { Typography } from '~shared/ui/typograghy'
import { cn } from '~shared/utils'

import {
  InputVariantsProps,
  contentVariants,
  contentWrapperVariants,
  descriptionVariants,
  inputVariants,
  labelVariants,
} from '../styles/input-variants'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
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
  }

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    description,
    size,
    errorMessage,
    startContent,
    endContent,
    type,
    className,
    label,
    onFocus,
    onBlur,
    ...otherProps
  } = props

  const [isHovered, setIsHover] = useState(false)
  const [isFocused, setIsFocus] = useState(false)

  const labelStyle = useMemo(
    () => cn(labelVariants({ size, isError: !!errorMessage })),
    [size, label, errorMessage]
  )

  const descriptionStyle = useMemo(
    () => cn(descriptionVariants({ size, isError: !!errorMessage })),
    [size, label, errorMessage]
  )

  const inputStyle = useMemo(
    () =>
      cn(
        inputVariants({
          size,
          startContent: Boolean(startContent),
          endContent: Boolean(endContent),
          withLabel: Boolean(label),
          isError: Boolean(errorMessage),
        }),
        className
      ),
    [size, startContent, endContent, label, errorMessage]
  )

  const inputDefault = (
    <input
      type={type}
      className={inputStyle}
      ref={ref}
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

  const inputWithContent = useMemo(() => {
    const contentBaseStyle = contentVariants({ size, isError: !!errorMessage })
    const contentWrapperStyle = contentWrapperVariants({
      size,
    })

    return (
      <div
        className={contentBaseStyle}
        data-hover={isHovered}
        data-focus={isFocused}
        onMouseEnter={() => {
          setIsHover(true)
        }}
        onMouseLeave={() => {
          setIsHover(false)
        }}
      >
        <div className={contentWrapperStyle}>
          {startContent}
          {inputDefault}
          {endContent}
        </div>
      </div>
    )
  }, [size, startContent, endContent, isFocused, isHovered, errorMessage])

  if (!label && (startContent || endContent)) {
    return inputWithContent
  }

  return label ? (
    <div className="flex w-full flex-col gap-y-2">
      {label && (
        <label htmlFor={label.id.toLocaleLowerCase()} className={labelStyle}>
          {label.value}
        </label>
      )}
      {startContent || endContent ? inputWithContent : inputDefault}
      {(errorMessage || description) && (
        <Typography tag="p" className={descriptionStyle}>
          {errorMessage || description}
        </Typography>
      )}
    </div>
  ) : errorMessage || description ? (
    <div className="flex w-full flex-col gap-y-2">
      {inputDefault}
      {
        <Typography tag="p" className={descriptionStyle}>
          {errorMessage || description}
        </Typography>
      }
    </div>
  ) : (
    inputDefault
  )
})
Input.displayName = 'Input'

export { Input }
