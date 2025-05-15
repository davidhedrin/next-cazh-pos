"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({
  dateVal,
  setDateVal,
  placeholder,
  className,
}: React.HTMLAttributes<HTMLDivElement> & {
  dateVal?: Date | undefined;
  setDateVal?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  placeholder?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full truncate justify-start text-left font-normal",
            !dateVal && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          {dateVal ? format(dateVal, "PPP") : <span>{placeholder || "Pick a date"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 scale-95" align="center">
        <Calendar
          mode="single"
          selected={dateVal}
          onSelect={setDateVal}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
