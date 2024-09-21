import React, { forwardRef } from 'react'
import '@/app/_styles/badge.module.scss'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`badge badge-${variant} ${className || ''}`}
        {...props}
      />
    )
  }
)

Badge.displayName = "Badge"
