import { cn } from '@/lib/utils'
import {
  InputVariantsProps,
  contentVariants,
  contentWrapperVariants,
  inputVariants,
  labelVariants,
} from './InputVariants'
import {
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from 'react'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  Omit<InputVariantsProps, 'withLabel' | 'startContent' | 'endContent'> & {
    label?: {
      id: string
      value: string
    }
    startContent?: ReactNode
    endContent?: ReactNode
  }

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    size,
    startContent,
    endContent,
    type,
    className,
    label,
    ...otherProps
  } = props

  const [isHover, setIsHover] = useState(false)
  const [isFocus, setIsFocus] = useState(false)

  const inputStyle = useMemo(
    () =>
      cn(
        inputVariants({
          size,
          startContent: Boolean(startContent),
          endContent: Boolean(endContent),
          withLabel: Boolean(label),
        }),
        className
      ),
    [size, startContent, endContent, label]
  )
  const labelStyle = useMemo(() => cn(labelVariants()), [size, label])

  const inputWithContent = useMemo(() => {
    const contentBaseStyle = contentVariants({ size })
    const contentWrapperStyle = contentWrapperVariants({ size })

    return (
      <div
        className={contentBaseStyle}
        data-hover={isHover}
        data-focus={isFocus}
        onMouseEnter={() => {
          setIsHover(true)
        }}
        onMouseLeave={() => {
          setIsHover(false)
        }}
      >
        <div className={contentWrapperStyle}>
          {startContent}
          <input
            id={label?.id.toLocaleLowerCase()}
            type={type}
            className={inputStyle}
            ref={ref}
            onFocus={() => {
              setIsFocus(true)
            }}
            onBlur={() => {
              setIsFocus(false)
            }}
            {...otherProps}
          />
          {endContent}
        </div>
      </div>
    )
  }, [size, startContent, endContent, isFocus, isHover])

  if (!label && (startContent || endContent)) {
    console.log('here')
    return inputWithContent
  }

  const inputDefault = useMemo(
    () => (
      <input
        type={type}
        className={inputStyle}
        ref={ref}
        onFocus={() => {
          setIsFocus(true)
        }}
        onBlur={() => {
          setIsFocus(false)
        }}
        {...otherProps}
      />
    ),
    [inputStyle, type]
  )

  return (
    label && (
      <div className="flex w-full flex-col gap-y-2">
        {label && (
          <label htmlFor={label.id.toLocaleLowerCase()} className={labelStyle}>
            {label.value}
          </label>
        )}
        {startContent || endContent ? inputWithContent : inputDefault}
      </div>
    )
  )
})
Input.displayName = 'Input'

export { Input }
