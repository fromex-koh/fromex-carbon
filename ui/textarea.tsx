/* eslint-disable react-hooks/rules-of-hooks,@typescript-eslint/no-unused-expressions,react-hooks/exhaustive-deps */
"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type TextareaProps = {
  lengthInfo?: boolean
  isValid?: boolean
  lengthInfoClassName?: string
}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & TextareaProps
>(
  (
    {
      lengthInfo = true,
      isValid = true,
      lengthInfoClassName,
      className,
      ...props
    },
    ref,
  ) => {
    if (!lengthInfo) {
      return (
        <textarea
          className={cn(
            "flex min-h-[60px] w-full rounded-md bg-transparent px-3 py-2 text-base text-sm shadow-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            isValid ? "border border-input" : "ring-2 ring-destructive",
            className,
          )}
          ref={ref}
          {...props}
        />
      )
    }

    const [value, setValue] = useState("")
    const [width, setWidth] = useState(0)
    const localRef = useRef<HTMLTextAreaElement | null>(null)

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      !(props?.maxLength && e.target.value.length > props.maxLength) &&
        setValue(e.target.value)
    }

    const updateWidth = () => {
      const target =
        (ref as React.RefObject<HTMLTextAreaElement>)?.current ||
        localRef.current
      target && setWidth(target.offsetWidth)
    }

    useEffect(() => {
      updateWidth()

      const observer = new MutationObserver(updateWidth)
      const target =
        (ref as React.RefObject<HTMLTextAreaElement>)?.current ||
        localRef.current
      target &&
        observer.observe(target, {
          attributes: true,
          childList: true,
          subtree: true,
        })

      window.addEventListener("resize", updateWidth)

      return () => {
        observer.disconnect()
        window.removeEventListener("resize", updateWidth)
      }
    }, [ref, value])

    return (
      <>
        <textarea
          className={cn(
            "flex min-h-[60px] w-full rounded-md bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            isValid ? "border border-input" : "ring-2 ring-destructive",
            className,
          )}
          onChange={handleChange}
          ref={(node) => {
            if (ref && typeof ref !== "function") {
              ;(
                ref as React.MutableRefObject<HTMLTextAreaElement | null>
              ).current = node
            }
            localRef.current = node
          }}
          {...props}
        />
        <div
          className={cn(
            "flex justify-end gap-1 pt-1",
            !width && "opacity-0",
            lengthInfoClassName,
          )}
          style={{ width: width || 85 }}
        >
          <span className="text-sm text-muted-foreground">
            {value.length}
            {props?.maxLength && ` / ${props.maxLength}`}
          </span>
        </div>
      </>
    )
  },
)
Textarea.displayName = "Textarea"

export { Textarea }
