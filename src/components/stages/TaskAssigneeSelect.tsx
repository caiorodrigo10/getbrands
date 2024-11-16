import { User2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AssigneeType } from "../StagesTimeline";

interface TaskAssigneeSelectProps {
  assignee: AssigneeType;
  onAssigneeChange: (assignee: AssigneeType) => void;
}

export const TaskAssigneeSelect = ({ assignee = "none", onAssigneeChange }: TaskAssigneeSelectProps) => {
  const { data: adminUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, role')
        .eq('role', 'admin');

      if (error) throw error;
      return data;
    }
  });

  return (
    <Select value={assignee} onValueChange={onAssigneeChange}>
      <SelectTrigger className="h-7">
        <SelectValue>
          <div className="flex items-center gap-1.5">
            <Avatar className="h-5 w-5">
              <AvatarFallback>
                <User2 className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span>
              {assignee === "none" ? "Assign" : assignee}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="none">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarFallback>
                <User2 className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span>Unassigned</span>
          </div>
        </SelectItem>
        {adminUsers?.map((admin) => (
          <SelectItem key={admin.id} value={admin.id}>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={admin.avatar_url || ''} />
                <AvatarFallback>
                  <User2 className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span>{`${admin.first_name} ${admin.last_name}`}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};