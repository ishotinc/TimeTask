import React, { createContext, useContext, useState, forwardRef } from 'react'
import { createPortal } from 'react-dom'
import '@/app/_styles/dialog.module.scss'

// Context
const DialogContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null)

// Dialog
export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dialog: React.FC<DialogProps> = ({ children, open: controlledOpen, onOpenChange, ...props }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = controlledOpen !== undefined

  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen: React.Dispatch<React.SetStateAction<boolean>> = (newOpen) => {
    const updatedOpen = typeof newOpen === 'function' ? newOpen(open) : newOpen
    if (isControlled) {
      onOpenChange?.(updatedOpen)
    } else {
      setUncontrolledOpen(updatedOpen)
    }
  }

  if (!open) return null

  return createPortal(
    <DialogContext.Provider value={{ open, setOpen }}>
      <div className="dialog-overlay" onClick={() => setOpen(false)}>
        <div className="dialog" onClick={(e) => e.stopPropagation()} {...props}>
          {children}
        </div>
      </div>
    </DialogContext.Provider>,
    document.body
  )
}

// DialogContent
export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={`dialog-content ${className || ''}`} {...props} />
  }
)

DialogContent.displayName = "DialogContent"

// DialogHeader
export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={`dialog-header ${className || ''}`} {...props} />
  }
)

DialogHeader.displayName = "DialogHeader"

// DialogTitle
export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => {
    return <h2 ref={ref} className={`dialog-title ${className || ''}`} {...props} />
  }
)

DialogTitle.displayName = "DialogTitle"

// DialogFooter
export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={`dialog-footer ${className || ''}`} {...props} />
  }
)

DialogFooter.displayName = "DialogFooter"