/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { XIcon } from "lucide-react";
import { cn } from "../../utils";

// Types
interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(
  undefined
);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog");
  }
  return context;
}

// Main Dialog Component
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function Dialog({
  open,
  onOpenChange,
  children,
  className,
  ...props
}: DialogProps) {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange]);

  // Prevent body scroll when dialog is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      <div data-slot="dialog" className={className} {...props}>
        {children}
      </div>
    </DialogContext.Provider>
  );
}

// Dialog Trigger
interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ children, asChild = false, onClick, ...props }, ref) => {
    const { onOpenChange } = useDialog();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onOpenChange(true);
      onClick?.(e);
    };

    return (
      <button
        data-slot="dialog-trigger"
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DialogTrigger.displayName = "DialogTrigger";

// Dialog Overlay
interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, onClick, ...props }, ref) => {
    const { open, onOpenChange } = useDialog();

    if (!open) return null;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onOpenChange(false);
      onClick?.(e);
    };

    return (
      <div
        data-slot="dialog-overlay"
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 bg-black/50 animate-in fade-in-0",
          className
        )}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
DialogOverlay.displayName = "DialogOverlay";

// Dialog Content
interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  hideCloseButton?: boolean;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (
    { className, children, hideCloseButton = false, onClick, ...props },
    ref
  ) => {
    const { open, onOpenChange } = useDialog();

    if (!open) return null;

    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onClick?.(e);
    };

    return (
      <>
        <DialogOverlay />
        <div
          data-slot="dialog-content"
          ref={ref}
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2",
            "bg-background rounded-lg border shadow-lg p-6",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            "sm:max-w-lg",
            className
          )}
          onClick={handleContentClick}
          {...props}
        >
          {children}
          {!hideCloseButton && (
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              aria-label="Close"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      </>
    );
  }
);
DialogContent.displayName = "DialogContent";

// Dialog Header
interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

// Dialog Footer
interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

// Dialog Title
interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h2
        data-slot="dialog-title"
        ref={ref}
        className={cn("text-lg font-semibold leading-none", className)}
        {...props}
      />
    );
  }
);
DialogTitle.displayName = "DialogTitle";

// Dialog Description
interface DialogDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      data-slot="dialog-description"
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
DialogDescription.displayName = "DialogDescription";

// Dialog Close
interface DialogCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ children, onClick, ...props }, ref) => {
    const { onOpenChange } = useDialog();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onOpenChange(false);
      onClick?.(e);
    };

    return (
      <button
        data-slot="dialog-close"
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DialogClose.displayName = "DialogClose";

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
};
