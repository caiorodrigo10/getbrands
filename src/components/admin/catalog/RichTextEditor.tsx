import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Link, List, MoreHorizontal, Underline } from "lucide-react";
import { useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPreview, setIsPreview] = useState(false);

  const handleFormat = (command: string, value?: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value || textarea.value.substring(start, end);

    let formattedText = '';
    let surroundText = '';
    switch (command) {
      case 'bold':
        surroundText = '**';
        break;
      case 'italic':
        surroundText = '*';
        break;
      case 'underline':
        surroundText = '__';
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          formattedText = `[${selectedText}](${url})`;
        }
        break;
      case 'list':
        formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        break;
      default:
        return;
    }

    if (!formattedText) {
      formattedText = `${surroundText}${selectedText}${surroundText}`;
    }

    const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    onChange(newValue);

    // Reset selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + surroundText.length,
        start + formattedText.length - surroundText.length
      );
    }, 0);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 border-b border-gray-200 pb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.preventDefault();
            handleFormat('bold');
          }}
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.preventDefault();
            handleFormat('italic');
          }}
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.preventDefault();
            handleFormat('underline');
          }}
          type="button"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="h-4 w-px bg-gray-200 mx-1" />
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.preventDefault();
            handleFormat('link');
          }}
          type="button"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.preventDefault();
            handleFormat('list');
          }}
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            setIsPreview(!isPreview);
          }}
          type="button"
        >
          {isPreview ? 'Edit' : 'Preview'}
        </Button>
      </div>
      
      {isPreview ? (
        <div className="min-h-[200px] p-4 border rounded-md prose prose-sm max-w-none">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      ) : (
        <Textarea 
          ref={textareaRef}
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[200px] resize-y font-mono"
        />
      )}
    </div>
  );
};