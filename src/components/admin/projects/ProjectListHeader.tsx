const ProjectListHeader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 py-3 px-4 bg-muted/50 rounded-md mb-4">
      <div>
        <span className="text-sm font-medium">Project Name</span>
      </div>
      <div>
        <span className="text-sm font-medium">Client Name</span>
      </div>
      <div>
        <span className="text-sm font-medium">Email</span>
      </div>
      <div>
        <span className="text-sm font-medium">Phone</span>
      </div>
      <div>
        <span className="text-sm font-medium">Status</span>
      </div>
      <div>
        <span className="text-sm font-medium">Account Manager</span>
      </div>
    </div>
  );
};

export default ProjectListHeader;