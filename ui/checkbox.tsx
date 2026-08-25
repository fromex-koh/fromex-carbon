"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

type CheckboxProps = {
  isValid?: boolean
  isOptionalCheck?: boolean
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & CheckboxProps
>(({ className, isValid = true, isOptionalCheck = false, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-[20px] w-[20px] shrink-0 rounded-sm hover:border-ash-600 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      isValid ? "border-2 border-ash-400" : "ring-2 ring-destructive",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check
        className={cn(
          !isValid && "pb-0.5",
          isOptionalCheck && "hidden",
          "h-[16px] w-[16px]",
        )}
      />
      <Minus
        className={cn(
          !isValid && "pb-0.5",
          !isOptionalCheck && "hidden",
          "h-[16px] w-[16px]",
        )}
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
