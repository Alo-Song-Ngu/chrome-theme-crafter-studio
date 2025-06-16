
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface TintPickerProps {
  label: string;
  values: [number, number, number];
  onChange: (values: [number, number, number]) => void;
}

export const TintPicker: React.FC<TintPickerProps> = ({ label, values, onChange }) => {
  const updateValue = (index: number, value: number) => {
    const newValues: [number, number, number] = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs w-12">Hue:</span>
          <Slider
            value={[values[0]]}
            onValueChange={(value) => updateValue(0, value[0])}
            max={1}
            min={-1}
            step={0.1}
            className="flex-1"
          />
          <span className="text-xs w-8">{values[0].toFixed(1)}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs w-12">Sat:</span>
          <Slider
            value={[values[1]]}
            onValueChange={(value) => updateValue(1, value[0])}
            max={1}
            min={-1}
            step={0.1}
            className="flex-1"
          />
          <span className="text-xs w-8">{values[1].toFixed(1)}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs w-12">Light:</span>
          <Slider
            value={[values[2]]}
            onValueChange={(value) => updateValue(2, value[0])}
            max={1}
            min={-1}
            step={0.1}
            className="flex-1"
          />
          <span className="text-xs w-8">{values[2].toFixed(1)}</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        HSL: {values[0].toFixed(1)}, {values[1].toFixed(1)}, {values[2].toFixed(1)}
      </div>
    </div>
  );
};
