interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome, {userName}!</h1>
      <p className="text-muted-foreground">Here's what's happening with your projects</p>
    </div>
  );
};

export default DashboardHeader;