/* eslint-disable @typescript-eslint/no-unused-expressions,react-hooks/exhaustive-deps */
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import ItemCompletion from "@/public/item-completion.svg"
import ItemCompletionDark from "@/public/item-completion-dark.svg"
import ItemIng from "@/public/item-ing.svg"
import ItemIngDark from "@/public/item-ing-dark.svg"
import ItemBefore from "@/public/item-before.svg"
import ItemBeforeDark from "@/public/item-before-dark.svg"

type StepperProps = {
  items: string[]
  activeIndex: number
  size: number
  stepInfoClassName?: string
  padding?: number
  isMobileMode?: boolean
}

const Stepper = React.forwardRef<
  HTMLOListElement,
  React.ComponentProps<"ol"> & StepperProps
>(
  (
    {
      className,
      items,
      activeIndex,
      size,
      stepInfoClassName,
      padding,
      isMobileMode,
    },
    ref,
  ) => {
    const numberingItems = items.map((item, index) => `${index + 1}.${item}`)
    const longestItem = numberingItems.reduce(
      (longest, current) =>
        current.length > longest.length ? current : longest,
      "",
    )

    const getBarLengthText = (
      items: string[],
      item: string,
      index: number,
      type: "forward" | "back",
    ) => {
      if (
        (index === 0 && type === "forward") ||
        (index + 1 === items.length && type === "back")
      ) {
        return item
      }

      return longestItem
    }

    return (
      <>
        <ol
          ref={ref}
          className={cn(
            "inline-flex flex-wrap items-center",
            isMobileMode === undefined && "max-sm:hidden",
            isMobileMode && "hidden",
            className,
          )}
        >
          {numberingItems.map((item, index) => (
            <li
              className="flex items-center"
              style={{ marginBottom: `${size * 2.85}px` }}
              key={"stepper" + item + index}
            >
              <div
                className={cn(
                  index === 0 && "opacity-0",
                  index <= activeIndex ? "bg-ash-600" : "bg-ash-400",
                )}
                style={{
                  height: `${size / 6}px`,
                }}
              >
                <div
                  className={cn("whitespace-nowrap opacity-0")}
                  style={{
                    fontSize: `${size / 2}px`,
                    marginRight: `${padding === undefined || !index ? -size : padding - size}px`,
                  }}
                >
                  {getBarLengthText(numberingItems, item, index, "forward")}
                </div>
              </div>
              <div className="relative flex flex-col items-center">
                {index < activeIndex ? (
                  <>
                    <Image
                      priority
                      src={ItemCompletion}
                      alt={"완료"}
                      height={size * 2}
                      className={"dark:hidden"}
                    />
                    <Image
                      priority
                      src={ItemCompletionDark}
                      alt={"완료"}
                      height={size * 2}
                      className={"hidden dark:block"}
                    />
                  </>
                ) : index === activeIndex ? (
                  <>
                    <Image
                      priority
                      src={ItemIng}
                      alt={"진행 중"}
                      height={size * 2}
                      className={"dark:hidden"}
                    />
                    <Image
                      priority
                      src={ItemIngDark}
                      alt={"완료"}
                      height={size * 2}
                      className={"hidden dark:block"}
                    />
                  </>
                ) : (
                  <>
                    <Image
                      priority
                      src={ItemBefore}
                      alt={"미진행"}
                      height={size * 2}
                      className={"dark:hidden"}
                    />
                    <Image
                      priority
                      src={ItemBeforeDark}
                      alt={"미진행"}
                      height={size * 2}
                      className={"hidden dark:block"}
                    />
                  </>
                )}
                <div
                  className="absolute flex w-full flex-col items-center justify-end"
                  style={{ bottom: `${-size * 2}px` }}
                >
                  <div className="flex flex-col whitespace-nowrap">
                    <div
                      className={cn(
                        "font-bold",
                        index === activeIndex ? "text-primary" : "text-ash-600",
                      )}
                      style={{ fontSize: `${size}px` }}
                      aria-current={index === activeIndex}
                    >
                      {item}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  index + 1 === items.length && "opacity-0",
                  index < activeIndex ? "bg-ash-600" : "bg-ash-400",
                )}
                style={{
                  height: `${size / 6}px`,
                }}
              >
                <div
                  className={cn("whitespace-nowrap opacity-0")}
                  style={{
                    fontSize: `${size / 2}px`,
                    marginLeft: `${padding === undefined || index + 1 === items.length ? -size : padding - size}px`,
                  }}
                >
                  {getBarLengthText(numberingItems, item, index, "back")}
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div
          className={cn(
            "flex w-full items-center",
            !!activeIndex && "pl-[7px]",
            activeIndex !== items.length - 1 && "pr-[7px]",
            stepInfoClassName,
          )}
        >
          {!activeIndex && (
            <div className="invisible text-[6.5px] whitespace-nowrap">
              {items[activeIndex]}
            </div>
          )}
          <ol
            className={cn(
              "relative mt-3 mb-7 flex h-[3px] w-full items-center",
              isMobileMode === undefined && "sm:hidden",
              isMobileMode === false && "hidden",
              className,
            )}
            style={{
              background: `linear-gradient( to right, var(--color-primary-light) ${Math.round((100 * activeIndex) / (items.length - 1))}%, var(--color-ash-400) ${Math.round((100 * activeIndex) / (items.length - 1))}%)`,
            }}
          >
            {numberingItems.map((item, index) => (
              <li
                className={cn(
                  "absolute top-1/2 min-h-3 min-w-3 -translate-x-1/2 -translate-y-1/2 rounded-full",
                  index <= activeIndex
                    ? "bg-primary-light"
                    : "border-3 border-ash-400 bg-background",
                )}
                key={"stepperMini" + item + index}
                aria-current={index === activeIndex}
                style={{
                  left: `${Math.round((100 * index) / (items.length - 1))}%`,
                }}
              >
                {index === activeIndex && (
                  <div className="relative">
                    <div className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-background">
                      Step{index + 1}
                    </div>
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap">
                      {items[index]}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>
          {activeIndex === items.length - 1 && (
            <div className="invisible text-[6.5px] whitespace-nowrap">
              {items[activeIndex]}
            </div>
          )}
        </div>
      </>
    )
  },
)
Stepper.displayName = "Stepper"

export { Stepper }
