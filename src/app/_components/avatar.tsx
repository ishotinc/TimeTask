import React, { forwardRef } from 'react'
import '@/app/_styles/avatar.module.scss'

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, src, alt, ...props }, ref) => (
    <span
      ref={ref}
      className={`avatar ${className || ''}`}
      {...props}
    >
      {src && <img className="avatar-image" src={src} alt={alt || ''} />}
      {props.children}
    </span>
  )
)
Avatar.displayName = "Avatar"

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={`avatar-fallback ${className || ''}`}
      {...props}
    />
  )
)
AvatarFallback.displayName = "AvatarFallback"
