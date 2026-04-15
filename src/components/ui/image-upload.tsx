import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  boxText: string;
  className?: string;
}

const ImageUpload = ({ value, onChange, boxText, className }: ImageUploadProps) => {
  return (
    <div className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center ${className}`}>
      <Label htmlFor="image-upload" className="cursor-pointer">
        <div className="text-sm text-gray-600">{boxText}</div>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              // For now, just set a placeholder URL
              onChange(URL.createObjectURL(file));
            }
          }}
          className="hidden"
        />
      </Label>
    </div>
  );
};

export default ImageUpload;