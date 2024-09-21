import React, { forwardRef } from 'react'
import '@/app/_styles/label.module.scss'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, htmlFor, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`label ${className || ''}`}
        htmlFor={htmlFor}
        {...props}
      />
    )
  }
)

Label.displayName = "Label"