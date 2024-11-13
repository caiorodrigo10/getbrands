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
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">Progresso Total</span>
        <span className="text-sm font-semibold">{progress}%</span>
      </div>
      <div className="progress-bar" style={{ "--progress-width": `${progress}%` } as any}>
        <div className="progress-value" />
      </div>
    </div>
  );
};

export default ProjectProgress;