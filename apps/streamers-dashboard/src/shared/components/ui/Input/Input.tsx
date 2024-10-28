import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: {
    id: string
    value: string
  }
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    return label ? (
      <div className="flex w-full flex-col gap-y-2">
        {label && (
          <label
            htmlFor={label.id.toLocaleLowerCase()}
            className="text-body font-semibold"
          >
            {label.value}
          </label>
        )}
        <input
          id={label?.id.toLocaleLowerCase()}
          type={type}
          className={cn(
            'file:bg-transparent dark flex h-11 w-full rounded-medium border border-dark bg-background bg-dark-foreground px-3 py-2 text-body font-medium ring-offset-background file:border-0 file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-accent focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    ) : (
      <input
        type={type}
        className={cn(
          'file:bg-transparent dark flex h-11 w-full rounded-medium border border-dark bg-background bg-dark-foreground px-3 py-2 text-body font-medium ring-offset-background file:border-0 file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
