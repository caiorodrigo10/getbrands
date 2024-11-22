import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Link, List, MoreHorizontal, Underline } from "lucide-react";
import { useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormat = (command: string, value?: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value || textarea.value.substring(start, end);

    let formattedText = '';
    switch (command) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `_${selectedText}_`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          formattedText = `[${selectedText}](${url})`;
        }
        break;
      case 'list':
        formattedText = `\n- ${selectedText}`;
        break;
      default:
        return;
    }

    const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    onChange(newValue);

    // Reset selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 border-b border-gray-200 pb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => handleFormat('bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => handleFormat('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => handleFormat('underline')}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="h-4 w-px bg-gray-200 mx-1" />
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => handleFormat('link')}
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => handleFormat('list')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <Textarea 
        ref={textareaRef}
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] resize-y"
      />
    </div>
  );
};