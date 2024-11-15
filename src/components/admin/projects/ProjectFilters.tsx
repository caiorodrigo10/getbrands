import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectFiltersProps {
  statusFilter: string;
  managerFilter: string;
  onStatusChange: (value: string) => void;
  onManagerChange: (value: string) => void;
  uniqueManagers: string[];
}

export const ProjectFilters = ({
  statusFilter,
  managerFilter,
  onStatusChange,
  onManagerChange,
  uniqueManagers,
}: ProjectFiltersProps) => {
  return (
    <div className="flex gap-4">
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="Design Phase">Design Phase</SelectItem>
          <SelectItem value="Review">Review</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
        </SelectContent>
      </Select>
      <Select value={managerFilter} onValueChange={onManagerChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Manager" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Managers</SelectItem>
          {uniqueManagers.map(manager => (
            <SelectItem key={manager} value={manager}>{manager}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};