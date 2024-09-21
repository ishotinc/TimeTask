import React, { forwardRef } from 'react'
import '@/app/_styles/textarea.module.scss'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={`textarea ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"