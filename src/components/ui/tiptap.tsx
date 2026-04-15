import { Textarea } from "@/components/ui/textarea";

interface TiptapProps {
  content: string;
  onChange: (content: string) => void;
}

const Tiptap = ({ content, onChange }: TiptapProps) => {
  return (
    <Textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Tell us about your company, what you do, and your mission..."
      className="min-h-30 resize-none"
    />
  );
};

export default Tiptap;