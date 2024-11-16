import { User2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type AssigneeType = "client" | "account_manager" | "designer" | "none";

interface TaskAssigneeSelectProps {
  assignee: AssigneeType;
  onAssigneeChange: (assignee: AssigneeType) => void;
}

const ASSIGNEE_DATA = {
  client: {
    name: "Client",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop",
  },
  account_manager: {
    name: "AM",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&h=100&fit=crop",
  },
  designer: {
    name: "Designer",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop",
  },
  none: {
    name: "Assign",
    image: "",
  },
};

export const TaskAssigneeSelect = ({ assignee, onAssigneeChange }: TaskAssigneeSelectProps) => {
  return (
    <Select value={assignee} onValueChange={(value) => onAssigneeChange(value as AssigneeType)}>
      <SelectTrigger className="h-7 w-[100px]">
        <div className="flex items-center gap-1.5">
          <Avatar className="h-5 w-5">
            <AvatarImage src={ASSIGNEE_DATA[assignee].image} />
            <AvatarFallback>
              <User2 className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          <SelectValue className="truncate" />
        </div>
      </SelectTrigger>
      <SelectContent align="end">
        {Object.entries(ASSIGNEE_DATA).map(([key, data]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={data.image} />
                <AvatarFallback>
                  <User2 className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{data.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};