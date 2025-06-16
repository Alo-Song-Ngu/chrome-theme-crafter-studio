
import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DragDropImageUploadProps {
  label: string;
  description: string;
  recommendedSize?: string;
  maxSizeMB?: number;
  onImageChange: (file: File | undefined) => void;
}

export const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({
  label,
  description,
  recommendedSize,
  maxSizeMB = 5,
  onImageChange,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileWarning, setFileWarning] = useState<string | null>(null);
  const [isOptimalSize, setIsOptimalSize] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    let warning = null;
    let optimal = true;

    if (file.size > maxSizeBytes) {
      warning = `File quá lớn (${(file.size / 1024 / 1024).toFixed(1)}MB). Khuyến nghị dưới ${maxSizeMB}MB.`;
      optimal = false;
    } else if (file.size > 1024 * 1024) {
      warning = `File khá lớn (${(file.size / 1024 / 1024).toFixed(1)}MB). Có thể làm chậm theme.`;
      optimal = false;
    }

    if (recommendedSize && file.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        if (recommendedSize.includes('x')) {
          const [width, height] = recommendedSize.split('x').map(Number);
          if (img.width !== width || img.height !== height) {
            setFileWarning(prev => prev + ` Kích thước khuyến nghị: ${recommendedSize}px.`);
            setIsOptimalSize(false);
          } else {
            setIsOptimalSize(true);
          }
        }
      };
      img.src = URL.createObjectURL(file);
    }

    setFileWarning(warning);
    return optimal;
  }, [maxSizeMB, recommendedSize]);

  const handleFileChange = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      validateFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    }
  }, [onImageChange, validateFile]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileChange(imageFile);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleRemove = () => {
    setPreview(null);
    setFileWarning(null);
    setIsOptimalSize(null);
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
      <Label className="text-sm font-medium">{label}</Label>
      <p className="text-xs text-gray-500">{description}</p>
      {recommendedSize && (
        <p className="text-xs text-blue-600">📏 Kích thước khuyến nghị: {recommendedSize}px</p>
      )}
      
      <div 
        className={`border-2 border-dashed rounded-lg p-4 transition-all ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
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
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
            {isOptimalSize !== null && (
              <div className="absolute top-2 left-2">
                {isOptimalSize ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Upload className={`w-8 h-8 mx-auto mb-2 ${
              isDragOver ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <p className="text-sm text-gray-600 mb-2">
              {isDragOver ? 'Thả file vào đây' : 'Kéo thả hoặc click để chọn'}
            </p>
            <Button variant="outline" onClick={handleClick}>
              Chọn Hình Ảnh
            </Button>
          </div>
        )}
      </div>

      {fileWarning && (
        <Alert className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {fileWarning}
          </AlertDescription>
        </Alert>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};
