"use client"

import React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarSearch } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { ko } from "date-fns/locale"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
  isValid?: boolean
}

const DatePicker = ({
  date,
  setDate,
  className,
  isValid = true,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          isValid={isValid}
          variant={"outline"}
          className={cn(
            "min-w-[131px] justify-start text-left font-normal",
            className,
            !date && "text-muted-foreground",
          )}
        >
          <CalendarSearch />
          {date ? format(date, "yyyy.MM.dd") : <span>날짜 선택</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          locale={ko}
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
