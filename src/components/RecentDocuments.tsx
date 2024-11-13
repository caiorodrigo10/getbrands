import { FileText } from "lucide-react";

const documents = [
  { name: "Contrato.pdf", date: "20/03/2024", type: "PDF" },
  { name: "Logo_Final.ai", date: "18/03/2024", type: "AI" },
  { name: "Briefing.docx", date: "15/03/2024", type: "DOCX" },
];

const RecentDocuments = () => {
  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.name}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <FileText className="w-5 h-5 text-primary" />
          <div className="flex-grow">
            <h4 className="font-medium text-sm">{doc.name}</h4>
            <p className="text-xs text-gray-500">{doc.date}</p>
          </div>
          <span className="text-xs font-medium text-gray-400">{doc.type}</span>
        </div>
      ))}
    </div>
  );
};

export default RecentDocuments;