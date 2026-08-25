import * as React from "react"

import { cn } from "@/lib/utils"

type InputProps = {
  isValid?: boolean
}

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & InputProps
>(({ className, type, isValid = true, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-md bg-transparent px-3 py-1 text-sm font-semibold transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:font-normal placeholder:text-muted-foreground hover:ring-2 hover:ring-ash-600 focus-visible:ring-2 focus-visible:ring-ash-600 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        isValid ? "border border-input" : "ring-2 ring-destructive",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
