"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

type RadioProps = {
  isValid?: boolean
}

const RadioContext = React.createContext<RadioProps | null>(null)

const useRadio = () => {
  const context = React.useContext(RadioContext)

  if (!context) {
    throw new Error("useRadio must be used within a <RadioGroup />")
  }

  return context
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & RadioProps
>(({ className, isValid = true, ...props }, ref) => {
  return (
    <RadioContext.Provider value={{ isValid: isValid }}>
      <RadioGroupPrimitive.Root
        className={cn("grid gap-2", className)}
        {...props}
        ref={ref}
      />
    </RadioContext.Provider>
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  const { isValid } = useRadio()

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-[16px] w-[16px] rounded-full text-primary shadow-sm focus:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        isValid ? "border border-primary" : "ring-2 ring-destructive",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-[10px] w-[10px] fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
