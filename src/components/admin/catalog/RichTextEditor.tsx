import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Link, List, MoreHorizontal, Underline } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 border-b border-gray-200 pb-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Underline className="h-4 w-4" />
        </Button>
        <div className="h-4 w-px bg-gray-200 mx-1" />
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Link className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <Textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] resize-y"
      />
    </div>
  );
};