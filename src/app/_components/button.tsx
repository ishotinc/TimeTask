import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import styles from '@/app/_styles/button.module.scss'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {
    return (
      <button
        className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }