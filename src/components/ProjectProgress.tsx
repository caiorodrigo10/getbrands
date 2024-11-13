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
        <span className="text-sm text-gray-400">Progresso Total</span>
        <span className="text-sm font-semibold text-white">{progress}%</span>
      </div>
      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-light transition-all duration-1000 ease-out rounded-full"
          style={{ width: mounted ? `${progress}%` : '0%' }}
        />
      </div>
    </div>
  );
};

export default ProjectProgress;