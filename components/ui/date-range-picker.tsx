"use client"

import React from "react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarSearch } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import { ko } from "date-fns/locale"

interface DateRangePickerProps {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
  className?: string
  isValid?: boolean
}

const DateRangePicker = ({
  date,
  setDate,
  className,
  isValid,
}: DateRangePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          isValid={isValid}
          variant={"outline"}
          className={cn(
            "min-w-[218px] justify-start text-left font-normal",
            className,
            !date && "text-muted-foreground",
          )}
        >
          <CalendarSearch />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "yyyy.MM.dd")}
                {" - "}
                {format(date.to, "yyyy.MM.dd")}
              </>
            ) : (
              format(date.from, "yyyy.MM.dd")
            )
          ) : (
            <span>기간 선택</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          locale={ko}
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
        />
      </PopoverContent>
    </Popover>
  )
}

export default DateRangePicker
