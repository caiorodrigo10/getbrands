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
    <div>
      <p className="text-2xl font-bold text-primary mb-1">{progress}%</p>
      <div className="flex justify-between mb-2">
        <span className="text-xs text-muted-foreground">Progresso Total</span>
      </div>
      <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
          style={{ width: mounted ? `${progress}%` : '0%' }}
        />
      </div>
    </div>
  );
};

export default ProjectProgress;