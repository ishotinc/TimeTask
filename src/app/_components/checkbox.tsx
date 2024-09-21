import React, { forwardRef } from 'react'
import '@/app/_styles/checkbox.module.scss'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className={`checkbox-container ${className || ''}`}>
        <input
          type="checkbox"
          className="checkbox-input"
          ref={ref}
          {...props}
        />
        <div className="checkbox-box"></div>
        {label && <label className="checkbox-label">{label}</label>}
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"
