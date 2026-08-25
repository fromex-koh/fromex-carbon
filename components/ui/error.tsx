import React from "react"
import { Frown } from "lucide-react"
import { cn } from "@/lib/utils"

export type ErrorProps = {
  code?: string
  message?: string
}

const ErrorGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ErrorProps
>(({ className, code, message, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex flex-col", className)} {...props}>
      <div className="flex items-center gap-2">
        <Frown className="text-muted-foreground" />
        <p className="text-xl font-bold text-muted-foreground">에러 발생!</p>
      </div>
      <div className="text-sm text-muted-foreground">
        {code && `[${code}] `}
        {message && `${message}`}
      </div>
    </div>
  )
})
ErrorGroup.displayName = "ErrorGroup"

export default ErrorGroup
