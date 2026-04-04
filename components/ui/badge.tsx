import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Note: cva is not installed, but we can just use simple class merging for a dummy, or supply cva dependency manually.
// Actually, let's just use simple object variants to avoid adding class-variance-authority if we can, 
// Or I'll just rely on Tailwind simple logic so it runs out of the box without cva or add cva to dependencies.
// To keep it simple, I'll implement badge without cva:

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-transparent bg-destructive text-destructive-foreground",
    outline: "text-foreground",
    success: "border-transparent bg-emerald-500 text-white", // Added for green arrow indicator
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
