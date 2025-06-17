
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Image, RotateCcw } from 'lucide-react';

interface ImageEffectsProps {
  originalFile: File | null;
  onProcessedFile: (file: File) => void;
}

export const ImageEffects: React.FC<ImageEffectsProps> = ({
  originalFile,
  onProcessedFile
}) => {
  const [blur, setBlur] = useState([0]);
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [preview, setPreview] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (originalFile) {
      applyEffects();
    }
  }, [originalFile, blur, brightness, contrast]);

  const applyEffects = async () => {
    if (!originalFile || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply CSS filters to canvas context
      ctx.filter = `blur(${blur[0]}px) brightness(${brightness[0]}%) contrast(${contrast[0]}%)`;
      ctx.drawImage(img, 0, 0);
      
      // Update preview
      setPreview(canvas.toDataURL('image/png'));
    };
    
    img.src = URL.createObjectURL(originalFile);
  };

  const handleApplyEffects = () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const processedFile = new File([blob], originalFile?.name || 'processed-image.png', {
          type: 'image/png'
        });
        onProcessedFile(processedFile);
      }
    }, 'image/png');
  };

  const handleReset = () => {
    setBlur([0]);
    setBrightness([100]);
    setContrast([100]);
  };

  if (!originalFile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Image Effects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Tải ảnh lên để áp dụng hiệu ứng</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Image Effects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label>Blur: {blur[0]}px</Label>
            <Slider
              value={blur}
              onValueChange={setBlur}
              max={10}
              step={0.5}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Brightness: {brightness[0]}%</Label>
            <Slider
              value={brightness}
              onValueChange={setBrightness}
              min={50}
              max={150}
              step={5}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Contrast: {contrast[0]}%</Label>
            <Slider
              value={contrast}
              onValueChange={setContrast}
              min={50}
              max={150}
              step={5}
              className="mt-2"
            />
          </div>
        </div>

        {preview && (
          <div className="space-y-2">
            <Label>Preview:</Label>
            <img
              src={preview}
              alt="Preview with effects"
              className="w-full h-32 object-cover rounded border"
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleApplyEffects} size="sm" className="flex-1">
            Áp Dụng Hiệu Ứng
          </Button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};
