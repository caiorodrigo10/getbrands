import { useParams } from "react-router-dom";
import { PackageQuiz } from "@/components/project/PackageQuiz";

export default function PackageQuizPage() {
  const { projectId } = useParams();

  if (!projectId) {
    return <div>Project ID is required</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Questionário de Design de Embalagem</h1>
      <PackageQuiz projectId={projectId} />
    </div>
  );
}