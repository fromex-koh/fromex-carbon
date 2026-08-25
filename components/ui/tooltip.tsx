"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"
import { TooltipProviderProps } from "@radix-ui/react-tooltip"
import { cva, VariantProps } from "class-variance-authority"

const TooltipProvider: React.FC<TooltipProviderProps> = ({
  delayDuration,
  skipDelayDuration,
  disableHoverableContent,
  children,
}) => {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration || 1}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      {children}
    </TooltipPrimitive.Provider>
  )
}

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const tooltipVariants = cva(
  "z-50 animate-in overflow-hidden fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-primary bg-background",
        shadow: "border border-input bg-background shadow-xs",
        secondary:
          "border border-neutral-300 bg-secondary text-secondary-foreground",
      },
      size: {
        default: "rounded-md px-3 py-1.5 text-xs",
        lg: "rounded-xl p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface TooltipProps
  extends
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipVariants> {
  asChild?: boolean
  hasArrow?: boolean
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipProps
>(
  (
    { className, sideOffset = 4, children, variant, size, hasArrow, ...props },
    ref,
  ) => {
    const getArrowVariant = () => {
      if (variant === "destructive") {
        return "fill-destructive"
      }
      if (variant === "outline") {
        return "fill-background"
      }
      if (variant === "shadow") {
        return "fill-background"
      }
      if (variant === "secondary") {
        return "fill-secondary"
      }
      return "fill-primary"
    }

    const getArrowOutlineVariant = () => {
      if (variant === "outline") {
        return "fill-primary"
      }
      if (variant === "shadow") {
        return "fill-input"
      }
      if (variant === "secondary") {
        return "fill-neutral-300"
      }
      return getArrowVariant()
    }

    const getArrowSize = () => {
      return size === "lg" ? { width: 12, height: 6 } : { width: 10, height: 5 }
    }

    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            "max-[500px]:max-w-[360px] max-[360px]:max-w-[250px] max-[250px]:max-w-[180px] max-2xl:max-w-[1280px] max-xl:max-w-[1024px] max-lg:max-w-[768px] max-md:max-w-[640px] max-sm:max-w-[500px]",
            tooltipVariants({ variant, size, className }),
          )}
          {...props}
        >
          {children}
          {hasArrow && (
            <>
              <TooltipPrimitive.Arrow className={"relative"} asChild>
                <span className="absolute bottom-[6px] translate-y-full">
                  <svg
                    width={getArrowSize().width}
                    height={getArrowSize().height}
                    className={cn(getArrowOutlineVariant(), "block")}
                    viewBox="0 0 30 10"
                    preserveAspectRatio="none"
                  >
                    <polygon points="0,0 30,0 15,10" />
                  </svg>
                </span>
              </TooltipPrimitive.Arrow>
              <TooltipPrimitive.Arrow className={"relative"} asChild>
                <span className="absolute bottom-[7px] translate-y-full">
                  <svg
                    width={getArrowSize().width}
                    height={getArrowSize().height}
                    className={cn(getArrowVariant(), "block")}
                    viewBox="0 0 30 10"
                    preserveAspectRatio="none"
                  >
                    <polygon points="0,0 30,0 15,10" />
                  </svg>
                </span>
              </TooltipPrimitive.Arrow>
            </>
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    )
  },
)
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  tooltipVariants,
}
