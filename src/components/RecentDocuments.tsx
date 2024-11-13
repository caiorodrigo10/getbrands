import { FileText } from "lucide-react";

const documents = [
  { name: "Contrato.pdf", date: "20/03/2024", type: "PDF" },
  { name: "Logo_Final.ai", date: "18/03/2024", type: "AI" },
  { name: "Briefing.docx", date: "15/03/2024", type: "DOCX" },
];

const RecentDocuments = () => {
  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div
          key={doc.name}
          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-background/50 transition-colors cursor-pointer group"
        >
          <FileText className="w-4 h-4 text-primary group-hover:text-primary-light" />
          <div className="flex-grow">
            <h4 className="text-sm font-medium text-foreground">{doc.name}</h4>
            <p className="text-xs text-muted-foreground">{doc.date}</p>
          </div>
          <span className="text-xs font-medium text-muted-foreground">{doc.type}</span>
        </div>
      ))}
    </div>
  );
};

export default RecentDocuments;