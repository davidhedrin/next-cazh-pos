"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerWithRange({
  dateVal,
  setDateVal,
  className,
}: React.HTMLAttributes<HTMLDivElement> & {
  dateVal?: DateRange | undefined;
  setDateVal?: (dateVal: DateRange | undefined) => void;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size={"sm"}
            className={cn(
              "w-full truncate justify-start text-left font-normal",
              !dateVal && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {dateVal?.from ? (
              dateVal.to ? (
                <>
                  {format(dateVal.from, "dd LLL y")} - {" "} {format(dateVal.to, "dd LLL y")}
                </>
              ) : (
                format(dateVal.from, "dd LLL y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 scale-95" align="center">
          <Calendar
            className="p-2"
            initialFocus
            mode="range"
            defaultMonth={dateVal?.from}
            selected={dateVal}
            onSelect={setDateVal}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
};