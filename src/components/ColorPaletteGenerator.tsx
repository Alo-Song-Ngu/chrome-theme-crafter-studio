
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, RefreshCw } from 'lucide-react';
import { ColorPicker } from '@/components/ColorPicker';

interface ColorPaletteGeneratorProps {
  onApplyPalette: (colors: Record<string, string>) => void;
}

export const ColorPaletteGenerator: React.FC<ColorPaletteGeneratorProps> = ({
  onApplyPalette
}) => {
  const [baseColor, setBaseColor] = useState('#4285f4');
  const [generatedPalette, setGeneratedPalette] = useState<Record<string, string>>({});

  const hexToHsl = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    h /= 360;
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 1/6) {
      r = c; g = x; b = 0;
    } else if (1/6 <= h && h < 2/6) {
      r = x; g = c; b = 0;
    } else if (2/6 <= h && h < 3/6) {
      r = 0; g = c; b = x;
    } else if (3/6 <= h && h < 4/6) {
      r = 0; g = x; b = c;
    } else if (4/6 <= h && h < 5/6) {
      r = x; g = 0; b = c;
    } else if (5/6 <= h && h < 1) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const generateHarmoniousPalette = (baseHex: string) => {
    const [h, s, l] = hexToHsl(baseHex);
    
    const palette = {
      frame: baseHex,
      frame_inactive: hslToHex(h, s * 0.7, l * 0.8),
      frame_incognito: hslToHex(h, s * 0.9, l * 0.3),
      frame_incognito_inactive: hslToHex(h, s * 0.5, l * 0.2),
      toolbar: hslToHex(h, s * 0.3, Math.min(l * 1.8, 95)),
      ntp_background: hslToHex(h, s * 0.1, Math.min(l * 2, 98)),
      ntp_text: hslToHex(h, s * 0.8, Math.max(l * 0.3, 15)),
      ntp_link: hslToHex((h + 30) % 360, s * 0.9, l * 0.7),
      ntp_link_underline: hslToHex((h + 30) % 360, s * 0.9, l * 0.7),
      tab_text: hslToHex(h, s * 0.8, Math.max(l * 0.3, 15)),
      tab_background_text: hslToHex(h, s * 0.6, l * 0.6),
      button_background: hslToHex(h, s * 0.2, Math.min(l * 1.6, 90)),
      control_background: hslToHex(h, s * 0.1, Math.min(l * 1.9, 98)),
      bookmark_text: hslToHex(h, s * 0.7, l * 0.5),
      ntp_header: hslToHex(h, s * 0.2, Math.min(l * 1.7, 93)),
      ntp_section: hslToHex(h, s * 0.15, Math.min(l * 1.75, 95)),
      ntp_section_link: hslToHex((h + 20) % 360, s * 0.8, l * 0.6),
      ntp_section_link_underline: hslToHex((h + 20) % 360, s * 0.8, l * 0.6),
      ntp_section_text: hslToHex(h, s * 0.6, Math.max(l * 0.4, 20)),
    };

    setGeneratedPalette(palette);
  };

  const handleGenerate = () => {
    generateHarmoniousPalette(baseColor);
  };

  const handleApply = () => {
    onApplyPalette(generatedPalette);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Color Palette Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <ColorPicker
            label="Màu Chủ Đạo"
            color={baseColor}
            onChange={setBaseColor}
          />
        </div>
        
        <Button onClick={handleGenerate} className="w-full" variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Tạo Bảng Màu Hài Hòa
        </Button>

        {Object.keys(generatedPalette).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Bảng Màu Được Tạo:</h4>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(generatedPalette).slice(0, 8).map(([key, color]) => (
                <div key={key} className="text-center">
                  <div
                    className="w-full h-8 rounded border border-gray-300 mb-1"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-xs truncate">{key.replace(/_/g, ' ')}</p>
                </div>
              ))}
            </div>
            <Button onClick={handleApply} className="w-full bg-green-600 hover:bg-green-700">
              Áp Dụng Bảng Màu
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
