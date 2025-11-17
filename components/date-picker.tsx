import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function DatePicker({
  selected,
  onSelect,
  placeholder = "Pick a date",
  disabled = false,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-[240px] pl-3 text-left font-normal",
            !selected && "text-muted-foreground",
          )}
        >
          {selected ? (
            format(selected, "PPP")
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={selected}
            onSelect={onSelect}
            disabled={(date: Date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
          />
        </PopoverContent>
      )}
    </Popover>
  );
}
