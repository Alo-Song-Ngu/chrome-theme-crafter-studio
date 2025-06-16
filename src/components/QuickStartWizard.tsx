
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Palette, Moon, Sun, Zap } from 'lucide-react';
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
    description: 'Modern dark theme with blue accents',
    icon: Moon,
    colors: {
      frame: '#1f2937',
      frame_inactive: '#374151',
      toolbar: '#111827',
      tab_text: '#f9fafb',
      tab_background_text: '#9ca3af',
      bookmark_text: '#d1d5db',
      ntp_background: '#111827',
      ntp_text: '#f9fafb',
      ntp_link: '#60a5fa',
      button_background: '#374151',
    }
  },
  {
    id: 'light',
    name: 'Clean Light',
    description: 'Minimal light theme with soft colors',
    icon: Sun,
    colors: {
      frame: '#f8fafc',
      frame_inactive: '#e2e8f0',
      toolbar: '#ffffff',
      tab_text: '#1e293b',
      tab_background_text: '#64748b',
      bookmark_text: '#475569',
      ntp_background: '#ffffff',
      ntp_text: '#1e293b',
      ntp_link: '#3b82f6',
      button_background: '#f1f5f9',
    }
  },
  {
    id: 'gradient',
    name: 'Gradient Pro',
    description: 'Eye-catching gradient theme',
    icon: Palette,
    colors: {
      frame: '#6366f1',
      frame_inactive: '#a855f7',
      toolbar: '#8b5cf6',
      tab_text: '#ffffff',
      tab_background_text: '#e0e7ff',
      bookmark_text: '#f3f4f6',
      ntp_background: '#4f46e5',
      ntp_text: '#ffffff',
      ntp_link: '#fbbf24',
      button_background: '#7c3aed',
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Quick Start Wizard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600">
              Chọn một template để bắt đầu nhanh hoặc tiếp tục để tạo theme từ đầu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => {
              const Icon = template.icon;
              const isSelected = selectedTemplate === template.id;
              
              return (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Icon className="w-8 h-8 text-blue-500" />
                      {isSelected && (
                        <Badge variant="default">Đã chọn</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {template.description}
                    </p>
                    <div className="flex gap-2">
                      {Object.values(template.colors).slice(0, 5).map((color, index) => (
                        <div 
                          key={index}
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-between gap-4">
            <Button variant="outline" onClick={onClose}>
              Bỏ qua & Tạo từ đầu
            </Button>
            <Button 
              onClick={handleApplyTemplate}
              disabled={!selectedTemplate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Áp dụng Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
