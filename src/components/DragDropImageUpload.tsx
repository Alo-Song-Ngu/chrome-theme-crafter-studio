
import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';

interface DragDropImageUploadProps {
  label: string;
  description: string;
  onImageChange: (file: File | undefined) => void;
  acceptedSize?: { width: number; height: number };
  required?: boolean;
}

export const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({
  label,
  description,
  onImageChange,
  acceptedSize,
  required = false,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file hình ảnh');
      return;
    }

    const isValid = await validateImage(file);
    if (isValid) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    } else {
      onImageChange(undefined);
    }
  }, [acceptedSize, onImageChange]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      await processFile(imageFile);
    } else {
      setError('Vui lòng thả file hình ảnh');
    }
  }, [processFile]);

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
      
      <div 
        className={`border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
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
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            {isDragging ? (
              <>
                <Image className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                <p className="text-blue-600 font-medium">Thả file ở đây</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 mb-2">Kéo thả hoặc click để chọn ảnh</p>
                <Button variant="outline">
                  Chọn Hình Ảnh
                </Button>
              </>
            )}
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
