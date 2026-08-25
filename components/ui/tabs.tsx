import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ReactNode, useCallback, useEffect, useRef, useState } from "react"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "relative flex h-9 items-center justify-start overflow-x-hidden rounded-lg bg-muted p-1 whitespace-nowrap text-muted-foreground",
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex flex-1 items-center justify-center rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden",
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export function ScrollableTabs({
  children,
  tabContents,
}: {
  children: ReactNode
  tabContents: ReactNode
}) {
  const tabsListRef = useRef<HTMLDivElement>(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)

  const checkScrollable = useCallback(() => {
    if (tabsListRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = tabsListRef.current
      setShowLeftButton(scrollLeft > 0)
      setShowRightButton(scrollLeft + clientWidth < scrollWidth)
    }
  }, [])

  useEffect(() => {
    checkScrollable()

    window.addEventListener("resize", checkScrollable)
    tabsListRef.current?.addEventListener("scroll", checkScrollable)

    return () => {
      window.removeEventListener("resize", checkScrollable)
      tabsListRef.current?.removeEventListener("scroll", checkScrollable)
    }
  }, [checkScrollable])

  const scrollBy = (offset: number) => {
    if (tabsListRef.current) {
      tabsListRef.current?.scrollBy({ left: offset, behavior: "smooth" })
    }
  }

  return (
    <Tabs className="">
      <div className="relative flex w-full items-center rounded-lg bg-muted p-1 shadow-xs">
        {showLeftButton && (
          <div className="relative flex items-center">
            <Button
              onClick={() => scrollBy(-150)}
              aria-hidden={!showLeftButton}
              className="h-8 w-8 bg-background/70 p-2 text-black shadow-xs hover:bg-background"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
          </div>
        )}
        <div className="hide-scrollbar relative flex w-full overflow-x-auto">
          <TabsList
            ref={tabsListRef}
            className="flex h-9 min-w-0 flex-1 items-start gap-x-2 px-2"
          >
            {children}
          </TabsList>
        </div>
        {showRightButton && (
          <div className="relative flex items-center">
            <Button
              onClick={() => scrollBy(150)}
              aria-hidden={!showRightButton}
              className="h-8 w-8 bg-background/70 p-2 text-black shadow-xs hover:bg-background"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      {tabContents}
    </Tabs>
  )
}
export { Tabs, TabsList, TabsTrigger, TabsContent }
