import React, { createContext, useContext, useState, forwardRef } from 'react'
import '@/app/_styles/select.module.scss'

// Context
const SelectContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
} | null>(null)

// Select
export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ children, defaultValue = '', onValueChange, ...props }, ref) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(defaultValue)

    const handleValueChange: React.Dispatch<React.SetStateAction<string>> = (newValue) => {
      const updatedValue = typeof newValue === 'function' ? newValue(value) : newValue
      setValue(updatedValue)
      onValueChange?.(updatedValue)
      setOpen(false)
    }

    return (
      <SelectContext.Provider value={{ open, setOpen, value, setValue: handleValueChange }}>
        <div ref={ref} className="select" {...props}>
          {children}
        </div>
      </SelectContext.Provider>
    )
  }
)

Select.displayName = "Select"

// SelectTrigger
export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, ...props }, ref) => {
    const context = useContext(SelectContext)
    if (!context) throw new Error('SelectTrigger must be used within a Select')

    return (
      <button
        ref={ref}
        className={`select-trigger ${className || ''}`}
        onClick={() => context.setOpen(!context.open)}
        aria-haspopup="listbox"
        aria-expanded={context.open}
        {...props}
      />
    )
  }
)

SelectTrigger.displayName = "SelectTrigger"

// SelectValue
export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, ...props }, ref) => {
    const context = useContext(SelectContext)
    if (!context) throw new Error('SelectValue must be used within a Select')

    return (
      <span ref={ref} className={`select-value ${className || ''}`} {...props}>
        {context.value || props.children}
      </span>
    )
  }
)

SelectValue.displayName = "SelectValue"

// SelectContent
export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, ...props }, ref) => {
    const context = useContext(SelectContext)
    if (!context) throw new Error('SelectContent must be used within a Select')

    if (!context.open) return null

    return (
      <div ref={ref} className={`select-content ${className || ''}`} {...props} />
    )
  }
)

SelectContent.displayName = "SelectContent"

// SelectItem
export interface SelectItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  value: string;
}

export const SelectItem = forwardRef<HTMLLIElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const context = useContext(SelectContext)
    if (!context) throw new Error('SelectItem must be used within a Select')

    return (
      <li
        ref={ref}
        className={`select-item ${className || ''}`}
        role="option"
        aria-selected={context.value === value}
        onClick={() => context.setValue(value)}
        {...props}
      >
        {children}
      </li>
    )
  }
)

SelectItem.displayName = "SelectItem"