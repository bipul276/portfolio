"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center w-full", // was `caption`
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        button_previous: cn( // was `nav_button_previous`
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        button_next: cn( // was `nav_button_next`
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        month_grid: "w-full border-collapse space-x-1", // was `table`
        weekdays: "flex", // was `head_row`
        weekday: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]", // was `head_cell`
        week: "flex w-full mt-2", // was `row`
        day: cn( // was `cell`
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected=true])]:bg-accent [&:has([data-selected=true].day-range-end)]:rounded-r-md"
        ),
        day_button: cn( // was `day`
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal data-[selected=true]:opacity-100"
        ),
        range_start: "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground", // was `day_range_start`
        range_end: "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",   // was `day_range_end`
        selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground", // was `day_selected`
        today: "bg-accent text-accent-foreground", // was `day_today`
        outside: "text-muted-foreground data-[selected=true]:text-muted-foreground", // was `day_outside`
        disabled: "text-muted-foreground opacity-50", // was `day_disabled`
        range_middle: "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground", // was `day_range_middle`
        hidden: "invisible", // was `day_hidden`
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...p }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("size-4", className)} {...p} />
          ) : orientation === "right" ? (
            <ChevronRight className={cn("size-4", className)} {...p} />
          ) : (
            <ChevronDown className={cn("size-4", className)} {...p} />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
