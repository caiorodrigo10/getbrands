import React from "react";

export const ProjectListHeader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 px-6 py-3 bg-white rounded-lg text-sm font-medium text-muted-foreground border">
      <div>Project Name</div>
      <div className="col-span-2">Client Info</div>
      <div>Status</div>
      <div>Account Manager</div>
      <div>Completion</div>
    </div>
  );
};