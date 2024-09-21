import React, { InputHTMLAttributes, forwardRef } from 'react'
import styles from '@/app/_styles/input.module.scss'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  error?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        className={styles.input}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }