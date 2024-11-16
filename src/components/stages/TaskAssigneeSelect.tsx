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
    image: "/avatars/client.png",
  },
  account_manager: {
    name: "AM",
    image: "/avatars/account-manager.png",
  },
  designer: {
    name: "Designer",
    image: "/avatars/designer.png",
  },
  none: {
    name: "Assign",
    image: "",
  },
};

export const TaskAssigneeSelect = ({ assignee, onAssigneeChange }: TaskAssigneeSelectProps) => {
  return (
    <Select value={assignee} onValueChange={(value) => onAssigneeChange(value as AssigneeType)}>
      <SelectTrigger className="h-7 w-[90px]">
        <div className="flex items-center gap-1">
          <Avatar className="h-5 w-5">
            <AvatarImage src={ASSIGNEE_DATA[assignee].image} />
            <AvatarFallback>
              <User2 className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(ASSIGNEE_DATA).map(([key, data]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={data.image} />
                <AvatarFallback>
                  <User2 className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span>{data.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};