import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-[#32CD32] text-primary-foreground hover:bg-[#32CD32]/80",
        warning:
          "border-transparent bg-[#FACC15] text-[#5F3C08] hover:bg-[#FACC15]/80",
        blue: "border-transparent bg-[#2563EB] text-primary-foreground hover:bg-[#2563EB]/80",
        violet:
          "border-transparent bg-[#7C3AED] text-primary-foreground hover:bg-[#7C3AED]/80",
        forest:
          "border-transparent bg-forest text-primary-foreground hover:bg-forest/80",
        amber:
          "border-transparent bg-amber-500 text-primary-foreground hover:bg-amber-500/80",
        yellow:
          "border-transparent bg-yellow-500 text-secondary-foreground hover:bg-yellow-500/80",
        slate:
          "border-transparent bg-slate-400 text-primary-foreground hover:bg-slate-500/80 dark:bg-slate-600",
        orange:
          "border-transparent bg-orange-500 text-primary-foreground hover:bg-orange-500/80",
        tertiary:
          "border-transparent bg-sky-blue-light text-primary hover:bg-sky-blue",
      },
      size: {
        default: "",
        number: "h-5 min-w-5 rounded-full px-[5px] tabular-nums",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  isValid?: boolean
}

function Badge({
  className,
  variant,
  size,
  isValid = true,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant, size }),
        !isValid && "ring-2 ring-destructive",
        className,
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
