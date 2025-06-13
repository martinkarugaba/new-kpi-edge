"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  date,
  setDate,
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className={cn(
        "relative w-full",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={() => !disabled && setOpen(true)}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="w-full">
            <Button
              variant="outline"
              className={cn(
                "h-12 w-full justify-start rounded-lg border-gray-300 text-left text-base font-normal focus:border-black focus:ring-black",
                !date && "text-muted-foreground"
              )}
              disabled={disabled}
              type="button"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={newDate => {
              setDate(newDate || null);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
