import { useEffect, useState } from "react";

interface ProjectProgressProps {
  progress: number;
}

const ProjectProgress = ({ progress }: ProjectProgressProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Total Progress</span>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      <div className="h-1.5 w-full bg-muted/15 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
          style={{ width: mounted ? `${progress}%` : '0%' }}
        />
      </div>
    </div>
  );
};

export default ProjectProgress;