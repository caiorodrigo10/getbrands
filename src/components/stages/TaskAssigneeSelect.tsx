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
    name: "Account Manager",
    image: "/avatars/account-manager.png",
  },
  designer: {
    name: "Designer",
    image: "/avatars/designer.png",
  },
  none: {
    name: "Unassigned",
    image: "",
  },
};

export const TaskAssigneeSelect = ({ assignee, onAssigneeChange }: TaskAssigneeSelectProps) => {
  return (
    <Select value={assignee} onValueChange={(value) => onAssigneeChange(value as AssigneeType)}>
      <SelectTrigger className="h-8 w-[140px]">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={ASSIGNEE_DATA[assignee].image} />
            <AvatarFallback>
              <User2 className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(ASSIGNEE_DATA).map(([key, data]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={data.image} />
                <AvatarFallback>
                  <User2 className="h-4 w-4" />
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