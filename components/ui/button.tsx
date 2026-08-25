import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white group-hover:bg-primary-dark hover:bg-primary-dark",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "bg-background font-bold text-primary ring ring-primary hover:bg-ash-200",
        secondary: "bg-ash-100 text-secondary-foreground hover:bg-ash-300",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        login:
          "rounded-4xl bg-foreground text-background hover:bg-foreground/80",
        underLine: "hover:underline hover:underline-offset-4",
        roundedGhost:
          "rounded-full hover:bg-accent hover:text-accent-foreground",
        sns: "rounded-full hover:bg-footer-foreground",
        forest:
          "bg-forest text-white group-hover:bg-forest-dark hover:bg-forest-dark",
        tertiary:
          "bg-sky-blue text-primary hover:bg-sky-blue-light hover:ring-2 hover:ring-primary",
        download:
          "bg-background text-primary ring ring-primary hover:bg-ash-200",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3 text-xs",
        md: "rounded-full px-7 py-2.5 text-base font-medium",
        lg: "rounded-lg px-12 py-4 text-sm",
        xl: "rounded-full px-10 py-3.5 text-lg font-medium",
        xxl: "rounded-full px-15 py-3.5 text-xl font-medium",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isValid?: boolean
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, isValid = true, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          !isValid && "ring-2 ring-destructive",
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
