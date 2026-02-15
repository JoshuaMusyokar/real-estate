import React from "react";
import { cn } from "../../utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline";
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
  ...props
}) => {
  const baseStyles = "rounded-lg";

  const variants = {
    default:
      "bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700",
    outline: "border border-gray-200 dark:border-gray-700",
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={cn(
      "px-6 py-4 border-b border-gray-200 dark:border-gray-700",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
export function CardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn("p-6", className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={cn(
      "px-6 py-4 border-t border-gray-200 dark:border-gray-700",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
