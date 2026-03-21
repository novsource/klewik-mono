'use client'

import type { ComponentPropsWithRef } from 'react'
import { forwardRef, useId, useMemo } from 'react'

import { textAreaContentVariants, textAreaNoteVariants, textAreaVariants, textAreaWrapperVariants } from '../styles/text-area.styles'

export type TextAreaProps = ComponentPropsWithRef<'textarea'> & {
  note?: string
  errorMessage?: string
  textValidation?: (text: string) => boolean
  isError?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, forwardRef) => {
  const {
    id,
    className,
    note,
    errorMessage,
    textValidation,
    isError,
    ...restProps
  } = props

  const textAreaClasses = useMemo(() => textAreaVariants({ className }), [className])
  const textAreaWrapperClasses = useMemo(() => textAreaWrapperVariants(), [])
  const textAreaContentClasses = useMemo(() => textAreaContentVariants({ isError }), [isError])
  const textAreaNoteClasses = useMemo(() => textAreaNoteVariants({ isError }), [isError])

  const areaId = useId()

  return (
    <span data-slot="text-area-wrapper" className={textAreaWrapperClasses}>
      <span data-slot="text-area-content" className={textAreaContentClasses}>
        <textarea
          id={id || areaId}
          ref={forwardRef}
          className={textAreaClasses}
          placeholder="Input text..."
          {...restProps}
        />
      </span>
      {(note || (errorMessage && isError))
        && <span data-slot="text-area-note" className={textAreaNoteClasses}>{isError ? errorMessage : note}</span>}
    </span>

  )
})
