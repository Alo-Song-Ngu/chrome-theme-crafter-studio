
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  description: string;
  onImageChange: (file: File | undefined) => void;
  acceptedSize?: { width: number; height: number };
  required?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  description,
  onImageChange,
  acceptedSize,
  required = false,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!acceptedSize) {
        resolve(true);
        return;
      }

      const img = new Image();
      img.onload = () => {
        const isValid = img.width === acceptedSize.width && img.height === acceptedSize.height;
        if (!isValid) {
          setError(`Kích thước phải chính xác ${acceptedSize.width}x${acceptedSize.height}px. Ảnh hiện tại: ${img.width}x${img.height}px`);
        } else {
          setError(null);
        }
        resolve(isValid);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isValid = await validateImage(file);
      if (isValid) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        onImageChange(file);
      } else {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onImageChange(undefined);
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onImageChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      {description && <p className="text-xs text-gray-500">{description}</p>}
      
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <Button variant="outline" onClick={handleClick}>
              Chọn Hình Ảnh
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
