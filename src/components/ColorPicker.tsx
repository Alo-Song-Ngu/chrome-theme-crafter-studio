
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-1">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center space-x-2 mt-1">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-8 rounded border border-gray-200 cursor-pointer"
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 text-sm"
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );
};
