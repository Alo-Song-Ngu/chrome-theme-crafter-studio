
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Palette, Image, Download, RefreshCw } from 'lucide-react';
import { ThemeData } from '@/pages/Index';
import { ColorPicker } from '@/components/ColorPicker';

interface QuickStartWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: Partial<ThemeData>) => void;
}

const templates = [
  {
    id: 'dark',
    name: 'Dark Theme',
    description: 'Theme tối hiện đại',
    icon: '🌙',
    colors: {
      frame: '#2d2d2d',
      frame_inactive: '#1a1a1a',
      toolbar: '#2d2d2d',
      ntp_background: '#1a1a1a',
      ntp_text: '#ffffff',
      tab_text: '#ffffff',
      tab_background_text: '#cccccc',
    }
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    description: 'Theme xanh dương tươi mát',
    icon: '🌊',
    colors: {
      frame: '#1e40af',
      frame_inactive: '#3b82f6',
      toolbar: '#dbeafe',
      ntp_background: '#eff6ff',
      ntp_text: '#1e40af',
      tab_text: '#1e40af',
      tab_background_text: '#3b82f6',
    }
  },
  {
    id: 'green',
    name: 'Nature Green',
    description: 'Theme xanh lá tự nhiên',
    icon: '🌿',
    colors: {
      frame: '#16a34a',
      frame_inactive: '#22c55e',
      toolbar: '#dcfce7',
      ntp_background: '#f0fdf4',
      ntp_text: '#16a34a',
      tab_text: '#16a34a',
      tab_background_text: '#22c55e',
    }
  }
];

export const QuickStartWizard: React.FC<QuickStartWizardProps> = ({
  isOpen,
  onClose,
  onApplyTemplate
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
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

  const handleApplyTemplate = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      onApplyTemplate({
        name: template.name,
        description: template.description,
        colors: template.colors as any
      });
      onClose();
    }
  };

  const handleApplyPalette = () => {
    onApplyTemplate({
      colors: generatedPalette as any
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Quick Start - Chọn Template hoặc Tạo Bảng Màu
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Templates Có Sẵn</TabsTrigger>
            <TabsTrigger value="palette">Tạo Bảng Màu</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="text-3xl mb-2">{template.icon}</div>
                    <CardTitle className="text-sm">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-600 text-center mb-3">
                      {template.description}
                    </p>
                    <div className="flex justify-center gap-1">
                      {Object.values(template.colors).slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={onClose}>
                Bỏ qua
              </Button>
              <Button 
                onClick={handleApplyTemplate}
                disabled={!selectedTemplate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Áp dụng Template
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="palette" className="space-y-4">
            <div className="space-y-4">
              <div>
                <ColorPicker
                  label="Màu Chủ Đạo"
                  color={baseColor}
                  onChange={setBaseColor}
                />
              </div>
              
              <Button onClick={() => generateHarmoniousPalette(baseColor)} className="w-full" variant="outline">
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
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={onClose}>
                Bỏ qua
              </Button>
              <Button 
                onClick={handleApplyPalette}
                disabled={Object.keys(generatedPalette).length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                Áp Dụng Bảng Màu
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
