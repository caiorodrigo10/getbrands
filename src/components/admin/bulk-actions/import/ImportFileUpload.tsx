import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface ImportFileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImportFileUpload = ({ onFileUpload }: ImportFileUploadProps) => {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <Input
          type="file"
          accept=".csv"
          onChange={onFileUpload}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <Upload className="h-8 w-8 text-gray-400" />
          <span className="text-sm text-gray-600">
            Click to upload or drag and drop a CSV file
          </span>
        </label>
      </div>
    </div>
  );
};