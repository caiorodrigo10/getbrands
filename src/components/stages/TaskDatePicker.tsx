import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface TaskDatePickerProps {
  date?: Date;
  onDateChange: (date?: Date) => void;
}

export const TaskDatePicker = ({ date, onDateChange }: TaskDatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-6 px-2 text-xs w-[80px]">
          <Calendar className="h-3 w-3 mr-1" />
          {date ? format(date, "MM/dd") : "Set"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          className="rounded-md border w-[250px]"
        />
      </PopoverContent>
    </Popover>
  );
};