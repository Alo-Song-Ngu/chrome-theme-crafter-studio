
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Wand2, Palette, Image, Download } from 'lucide-react';
import { ThemeData } from '@/pages/Index';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Quick Start - Chọn Template
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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

        <div className="flex justify-between items-center mt-6">
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
      </DialogContent>
    </Dialog>
  );
};
