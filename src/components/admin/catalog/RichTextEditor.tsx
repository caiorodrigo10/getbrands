import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Button } from "@/components/ui/button";
import { Bold, Italic, Link as LinkIcon, List, Underline as UnderlineIcon } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const handleLinkClick = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 border-b border-gray-200 pb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBold().run()}
          type="button"
          data-active={editor.isActive('bold')}
        >
          <Bold className={`h-4 w-4 ${editor.isActive('bold') ? 'text-primary' : ''}`} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          type="button"
          data-active={editor.isActive('italic')}
        >
          <Italic className={`h-4 w-4 ${editor.isActive('italic') ? 'text-primary' : ''}`} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          type="button"
          data-active={editor.isActive('underline')}
        >
          <UnderlineIcon className={`h-4 w-4 ${editor.isActive('underline') ? 'text-primary' : ''}`} />
        </Button>
        <div className="h-4 w-px bg-gray-200 mx-1" />
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={handleLinkClick}
          type="button"
          data-active={editor.isActive('link')}
        >
          <LinkIcon className={`h-4 w-4 ${editor.isActive('link') ? 'text-primary' : ''}`} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          type="button"
          data-active={editor.isActive('bulletList')}
        >
          <List className={`h-4 w-4 ${editor.isActive('bulletList') ? 'text-primary' : ''}`} />
        </Button>
      </div>
      
      <EditorContent 
        editor={editor} 
        className="min-h-[200px] p-4 border rounded-md prose prose-sm max-w-none focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      />
    </div>
  );
};