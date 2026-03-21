'use client'

import type {
	ComponentPropsWithRef,
	HTMLAttributes,
	ReactNode,
} from 'react'
import type { CvaClassValue } from '~lib/cva'

import type {
	InputSlots,
	InputVariantsProps,
} from '../styles/input-variants'
import {
	useMemo,
	useState,
} from 'react'
import { cn } from '~utils/cn'
import {
	contentVariants,
	contentWrapperVariants,
	descriptionVariants,
	inputVariants,
	labelVariants,
} from '../styles/input-variants'

export type InputProps = Omit<ComponentPropsWithRef<'input'>, 'size' | 'className'>
	& Omit<
		InputVariantsProps,
    'withLabel' | 'startContent' | 'endContent' | 'isError'
	> & {
		label?: {
			id: string
			value: string
		}
		startContent?: ReactNode
		endContent?: ReactNode
		description?: string
		errorMessage?: string
		slotClassNames?: {
			[Slot in InputSlots]?: CvaClassValue;
		}
		inputStyles?: HTMLAttributes<HTMLInputElement>['style']
		baseStyles?: HTMLAttributes<HTMLDivElement>['style']
	}

export const Input = ({ ref, ...props }: InputProps) => {
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
		baseStyles,
		inputStyles,
		...otherProps
	} = props

	const [isHovered, setIsHover] = useState(false)
	const [isFocused, setIsFocus] = useState(false)

	const labelStyle = useMemo(
		() =>
			cn(labelVariants({ size, isError: !!errorMessage }), classNames?.label),
		[size, errorMessage, classNames?.label],
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
			type={type}
			className={baseInputStyle}
			ref={ref}
			data-slot="input"
			onFocus={(e) => {
				if (onFocus)
					onFocus(e)
				setIsFocus(true)
			}}
			onBlur={(e) => {
				if (onBlur)
					onBlur(e)
				setIsFocus(false)
			}}
			style={inputStyles}
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
					size,
					isError: !!errorMessage,
				}),
				classNames?.wrapper,
			),
		[classNames?.wrapper, size, errorMessage],
	)

	return (
		<div className={contentBaseStyle} data-slot="base" style={baseStyles}>
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
				<span className={descriptionStyle} data-slot="description">
					{errorMessage || description}
				</span>
			)}
		</div>
	)
}
Input.displayName = 'Input'
