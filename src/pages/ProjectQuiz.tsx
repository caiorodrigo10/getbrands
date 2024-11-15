import { useParams } from "react-router-dom";

export const ProjectQuiz = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Project Quiz</h1>
      <p className="text-muted-foreground">
        Project ID: {id}
      </p>
    </div>
  );
};

export default ProjectQuiz;