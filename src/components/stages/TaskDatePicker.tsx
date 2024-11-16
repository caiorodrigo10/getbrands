import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface TaskDatePickerProps {
  date?: Date;
  onDateChange: (date?: Date) => void;
  label: string;
}

export const TaskDatePicker = ({ date, onDateChange, label }: TaskDatePickerProps) => {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground whitespace-nowrap">{label}:</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {date ? format(date, "MM/dd") : "Set"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};