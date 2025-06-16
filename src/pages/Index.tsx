import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ChromePreview } from '@/components/ChromePreview';
import { ColorPicker } from '@/components/ColorPicker';
import { ThemeGenerator } from '@/components/ThemeGenerator';
import { TintPicker } from '@/components/TintPicker';
import { QuickStartWizard } from '@/components/QuickStartWizard';
import { DragDropImageUpload } from '@/components/DragDropImageUpload';
import { CollapsibleSection } from '@/components/CollapsibleSection';
import { LazyChromaPreview } from '@/components/LazyChromaPreview';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Image, Settings, Download, Lightbulb, Undo, Redo, Sparkles } from 'lucide-react';

export interface ThemeData {
  name: string;
  version: string;
  description: string;
  author?: string;
  colors: {
    bookmark_text: string;
    button_background: string;
    control_background: string;
    frame: string;
    frame_inactive: string;
    frame_incognito: string;
    frame_incognito_inactive: string;
    ntp_background: string;
    ntp_header: string;
    ntp_link: string;
    ntp_link_underline: string;
    ntp_section: string;
    ntp_section_link: string;
    ntp_section_link_underline: string;
    ntp_section_text: string;
    ntp_text: string;
    tab_background_text: string;
    tab_text: string;
    toolbar: string;
  };
  images: {
    theme_button_background?: File;
    theme_frame?: File;
    theme_frame_inactive?: File;
    theme_frame_incognito?: File;
    theme_frame_incognito_inactive?: File;
    theme_frame_overlay?: File;
    theme_frame_overlay_inactive?: File;
    theme_ntp_attribution?: File;
    theme_ntp_background?: File;
    theme_tab_background?: File;
    theme_tab_background_incognito?: File;
    theme_tab_background_v?: File;
    theme_toolbar?: File;
    theme_window_control_background?: File;
  };
  tints: {
    buttons: [number, number, number];
    frame: [number, number, number];
    frame_inactive: [number, number, number];
    frame_incognito: [number, number, number];
    frame_incognito_inactive: [number, number, number];
    background_tab: [number, number, number];
  };
  properties: {
    ntp_background_alignment: string;
    ntp_background_repeat: string;
    ntp_logo_alternate: number;
  };
}

const Index = () => {
  const [showWizard, setShowWizard] = useState(true);
  
  const initialThemeData: ThemeData = {
    name: 'My Chrome Theme',
    version: '1.0',
    description: 'A beautiful custom Chrome theme',
    author: '',
    colors: {
      bookmark_text: '#5f6368',
      button_background: '#f8f9fa',
      control_background: '#ffffff',
      frame: '#4285f4',
      frame_inactive: '#5f6368',
      frame_incognito: '#3c4043',
      frame_incognito_inactive: '#1a1a1a',
      ntp_background: '#ffffff',
      ntp_header: '#e8eaed',
      ntp_link: '#1a73e8',
      ntp_link_underline: '#1a73e8',
      ntp_section: '#f1f3f4',
      ntp_section_link: '#1a73e8',
      ntp_section_link_underline: '#1a73e8',
      ntp_section_text: '#202124',
      ntp_text: '#202124',
      tab_background_text: '#5f6368',
      tab_text: '#202124',
      toolbar: '#ffffff',
    },
    images: {},
    tints: {
      buttons: [-1, -1, -1],
      frame: [-1, -1, -1],
      frame_inactive: [-1, -1, -1],
      frame_incognito: [-1, -1, -1],
      frame_incognito_inactive: [-1, -1, -1],
      background_tab: [-1, -1, -1],
    },
    properties: {
      ntp_background_alignment: 'center',
      ntp_background_repeat: 'no-repeat',
      ntp_logo_alternate: 0,
    },
  };

  const {
    state: themeData,
    set: setThemeData,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetThemeData
  } = useUndoRedo(initialThemeData);

  const updateThemeData = useCallback((updates: Partial<ThemeData>) => {
    setThemeData({
      ...themeData,
      ...updates,
      colors: { ...themeData.colors, ...updates.colors },
      images: { ...themeData.images, ...updates.images },
      tints: { ...themeData.tints, ...updates.tints },
      properties: { ...themeData.properties, ...updates.properties },
    });
  }, [themeData, setThemeData]);

  const updateColor = useCallback((colorKey: keyof ThemeData['colors'], color: string) => {
    updateThemeData({ 
      colors: { 
        ...themeData.colors,
        [colorKey]: color 
      } 
    });
  }, [updateThemeData, themeData.colors]);

  const updateImage = useCallback((imageKey: keyof ThemeData['images'], file: File | undefined) => {
    updateThemeData({ images: { ...themeData.images, [imageKey]: file } });
  }, [updateThemeData, themeData.images]);

  const updateTint = useCallback((tintKey: keyof ThemeData['tints'], values: [number, number, number]) => {
    updateThemeData({ 
      tints: { 
        ...themeData.tints,
        [tintKey]: values 
      } 
    });
  }, [updateThemeData, themeData.tints]);

  const handleApplyTemplate = useCallback((template: Partial<ThemeData>) => {
    setThemeData({
      ...themeData,
      ...template
    });
    toast({
      title: 'Template đã được áp dụng!',
      description: 'Bạn có thể tiếp tục tùy chỉnh từ template này.',
    });
  }, [themeData, setThemeData]);

  // Image size recommendations for different elements
  const imageSizeRecommendations: Record<keyof ThemeData['images'], string> = {
    theme_button_background: '30x30',
    theme_frame: '∞x128',
    theme_frame_inactive: '∞x128',
    theme_frame_incognito: '∞x128',
    theme_frame_incognito_inactive: '∞x128',
    theme_frame_overlay: '1100x64',
    theme_frame_overlay_inactive: '1100x64',
    theme_ntp_attribution: 'Any',
    theme_ntp_background: '1920x1080',
    theme_tab_background: '16x16',
    theme_tab_background_incognito: '∞x128',
    theme_tab_background_v: '∞x128',
    theme_toolbar: '∞x128',
    theme_window_control_background: '∞x128',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Quick Start Wizard */}
      <QuickStartWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onApplyTemplate={handleApplyTemplate}
      />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-chrome-gradient rounded-xl flex items-center justify-center animate-chrome-glow">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-chrome-gradient bg-clip-text text-transparent">
                  Chrome Theme Studio Pro
                </h1>
                <p className="text-gray-600">Tạo theme Chrome chuyên nghiệp với đầy đủ tính năng</p>
              </div>
            </div>
            
            {/* Undo/Redo Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWizard(true)}
                className="hidden md:flex"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Quick Start
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                title="Hoàn tác (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
                title="Làm lại (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Control Panel */}
          <div className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Bảng Điều Khiển
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 text-xs md:text-sm">
                    <TabsTrigger value="basic">Cơ Bản</TabsTrigger>
                    <TabsTrigger value="colors">Màu Sắc</TabsTrigger>
                    <TabsTrigger value="images">Hình Ảnh</TabsTrigger>
                    <TabsTrigger value="tints">Tint</TabsTrigger>
                    <TabsTrigger value="properties">Thuộc Tính</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div>
                      <Label htmlFor="name">Tên Theme</Label>
                      <Input
                        id="name"
                        value={themeData.name}
                        onChange={(e) => updateThemeData({ name: e.target.value })}
                        placeholder="Nhập tên theme của bạn"
                      />
                    </div>
                    <div>
                      <Label htmlFor="version">Phiên Bản</Label>
                      <Input
                        id="version"
                        value={themeData.version}
                        onChange={(e) => updateThemeData({ version: e.target.value })}
                        placeholder="1.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="author">Tác Giả</Label>
                      <Input
                        id="author"
                        value={themeData.author || ''}
                        onChange={(e) => updateThemeData({ author: e.target.value })}
                        placeholder="Tên tác giả hoặc username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Mô Tả</Label>
                      <Textarea
                        id="description"
                        value={themeData.description}
                        onChange={(e) => updateThemeData({ description: e.target.value })}
                        placeholder="Mô tả ngắn về theme của bạn"
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="text-sm text-gray-600 mb-4">
                      <p>🎨 Tùy chỉnh màu sắc cho từng thành phần của Chrome</p>
                    </div>
                    
                    <div className="space-y-4">
                      <CollapsibleSection title="Khung & Cửa Sổ" defaultOpen={true}>
                        <div className="space-y-3">
                          <ColorPicker
                            label="Màu Khung Hoạt Động"
                            color={themeData.colors.frame}
                            onChange={(color) => updateColor('frame', color)}
                          />
                          <ColorPicker
                            label="Màu Khung Không Hoạt Động"
                            color={themeData.colors.frame_inactive}
                            onChange={(color) => updateColor('frame_inactive', color)}
                          />
                          <ColorPicker
                            label="Màu Khung Incognito"
                            color={themeData.colors.frame_incognito}
                            onChange={(color) => updateColor('frame_incognito', color)}
                          />
                          <ColorPicker
                            label="Màu Khung Incognito Không Hoạt Động"
                            color={themeData.colors.frame_incognito_inactive}
                            onChange={(color) => updateColor('frame_incognito_inactive', color)}
                          />
                        </div>
                      </CollapsibleSection>

                      <CollapsibleSection title="Thanh Công Cụ & Nút Bấm" defaultOpen={false}>
                        <div className="space-y-3">
                          <ColorPicker
                            label="Màu Thanh Công Cụ"
                            color={themeData.colors.toolbar}
                            onChange={(color) => updateColor('toolbar', color)}
                          />
                          <ColorPicker
                            label="Màu Nền Nút Bấm"
                            color={themeData.colors.button_background}
                            onChange={(color) => updateColor('button_background', color)}
                          />
                          <ColorPicker
                            label="Màu Nút Điều Khiển"
                            color={themeData.colors.control_background}
                            onChange={(color) => updateColor('control_background', color)}
                          />
                        </div>
                      </CollapsibleSection>

                      <CollapsibleSection title="Tab" defaultOpen={false}>
                        <div className="space-y-3">
                          <ColorPicker
                            label="Màu Chữ Tab Hoạt Động"
                            color={themeData.colors.tab_text}
                            onChange={(color) => updateColor('tab_text', color)}
                          />
                          <ColorPicker
                            label="Màu Chữ Tab Nền"
                            color={themeData.colors.tab_background_text}
                            onChange={(color) => updateColor('tab_background_text', color)}
                          />
                        </div>
                      </CollapsibleSection>

                      <CollapsibleSection title="Trang Tab Mới (NTP)" defaultOpen={false}>
                        <div className="space-y-3">
                          <ColorPicker
                            label="Màu Nền NTP"
                            color={themeData.colors.ntp_background}
                            onChange={(color) => updateColor('ntp_background', color)}
                          />
                          <ColorPicker
                            label="Màu Chữ NTP"
                            color={themeData.colors.ntp_text}
                            onChange={(color) => updateColor('ntp_text', color)}
                          />
                          <ColorPicker
                            label="Màu Liên Kết NTP"
                            color={themeData.colors.ntp_link}
                            onChange={(color) => updateColor('ntp_link', color)}
                          />
                          <ColorPicker
                            label="Màu Gạch Chân Liên Kết NTP"
                            color={themeData.colors.ntp_link_underline}
                            onChange={(color) => updateColor('ntp_link_underline', color)}
                          />
                          <ColorPicker
                            label="Màu Header NTP"
                            color={themeData.colors.ntp_header}
                            onChange={(color) => updateColor('ntp_header', color)}
                          />
                          <ColorPicker
                            label="Màu Section NTP"
                            color={themeData.colors.ntp_section}
                            onChange={(color) => updateColor('ntp_section', color)}
                          />
                          <ColorPicker
                            label="Màu Liên Kết Section"
                            color={themeData.colors.ntp_section_link}
                            onChange={(color) => updateColor('ntp_section_link', color)}
                          />
                          <ColorPicker
                            label="Màu Gạch Chân Section"
                            color={themeData.colors.ntp_section_link_underline}
                            onChange={(color) => updateColor('ntp_section_link_underline', color)}
                          />
                          <ColorPicker
                            label="Màu Chữ Section"
                            color={themeData.colors.ntp_section_text}
                            onChange={(color) => updateColor('ntp_section_text', color)}
                          />
                        </div>
                      </CollapsibleSection>

                      <CollapsibleSection title="Bookmark" defaultOpen={false}>
                        <div className="space-y-3">
                          <ColorPicker
                            label="Màu Chữ Bookmark"
                            color={themeData.colors.bookmark_text}
                            onChange={(color) => updateColor('bookmark_text', color)}
                          />
                        </div>
                      </CollapsibleSection>
                    </div>
                  </TabsContent>

                  <TabsContent value="images" className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="text-sm text-gray-600 mb-4">
                      <p>🖼️ Tải lên hình ảnh để tùy chỉnh giao diện Chrome</p>
                    </div>

                    <div className="space-y-4">
                      <CollapsibleSection title="Hình Ảnh Cơ Bản" defaultOpen={true}>
                        <div className="space-y-4">
                          <DragDropImageUpload
                            label="Ảnh Nền Trang Mới"
                            description="Đề xuất: 1920x1080px hoặc lớn hơn"
                            recommendedSize={imageSizeRecommendations.theme_ntp_background}
                            onImageChange={(file) => updateImage('theme_ntp_background', file)}
                          />
                          <DragDropImageUpload
                            label="Ảnh Khung Cửa Sổ"
                            description="Chiều cao tối thiểu: 128px (lặp lại theo trục X)"
                            recommendedSize={imageSizeRecommendations.theme_frame}
                            onImageChange={(file) => updateImage('theme_frame', file)}
                          />
                          <DragDropImageUpload
                            label="Ảnh Thanh Công Cụ"
                            description="Chiều cao tối thiểu: 128px (tab hiện tại + toolbar)"
                            recommendedSize={imageSizeRecommendations.theme_toolbar}
                            onImageChange={(file) => updateImage('theme_toolbar', file)}
                          />
                          <DragDropImageUpload
                            label="Ảnh Nền Tab"
                            description="Kích thước: 16x16, 48x48 hoặc 128x128px"
                            recommendedSize={imageSizeRecommendations.theme_tab_background}
                            onImageChange={(file) => updateImage('theme_tab_background', file)}
                          />
                        </div>
                      </CollapsibleSection>

                      <CollapsibleSection title="Hình Ảnh Nâng Cao" defaultOpen={false}>
                        <div className="space-y-4">
                          <DragDropImageUpload
                            label="Ảnh Nền Nút Bấm"
                            description="Kích thước: 30x30px"
                            recommendedSize={imageSizeRecommendations.theme_button_background}
                            onImageChange={(file) => updateImage('theme_button_background', file)}
                          />
                          <DragDropImageUpload
                            label="Ảnh Khung Không Hoạt Động"
                            description="Khung khi cửa sổ không được focus"
                            recommendedSize={imageSizeRecommendations.theme_frame_inactive}
                            onImageChange={(file) => updateImage('theme_frame_inactive', file)}
                          />
                          <DragDropImageUpload
                            label="Ảnh Overlay Khung"
                            description="Kích thước: 1100x64px (góc trên trái)"
                            recommendedSize={imageSizeRecommendations.theme_frame_overlay}
                            onImageChange={(file) => updateImage('theme_frame_overlay', file)}
                          />
                          <DragDropImageUpload
                            label="Ảnh Attribution"
                            description="Logo tác giả (góc dưới phải trang mới)"
                            recommendedSize={imageSizeRecommendations.theme_ntp_attribution}
                            onImageChange={(file) => updateImage('theme_ntp_attribution', file)}
                          />
                        </div>
                      </CollapsibleSection>

                      <CollapsibleSection title="Chế Độ Incognito" defaultOpen={false}>
                        <div className="space-y-4">
                          <DragDropImageUpload
                            label="Ảnh Khung Incognito"
                            description="Khung trong chế độ incognito"
                            recommendedSize={imageSizeRecommendations.theme_frame_incognito}
                            onImageChange={(file) => updateImage('theme_frame_incognito', file)}
                          />
                          <DragDropImageUpload
                            label="Ảnh Tab Incognito"
                            description="Tab không hoạt động trong incognito"
                            recommendedSize={imageSizeRecommendations.theme_tab_background_incognito}
                            onImageChange={(file) => updateImage('theme_tab_background_incognito', file)}
                          />
                        </div>
                      </CollapsibleSection>
                    </div>
                  </TabsContent>

                  <TabsContent value="tints" className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      <p>🌈 Áp dụng hiệu ứng màu cho các thành phần</p>
                      <p className="text-xs">Giá trị -1 có nghĩa là không thay đổi</p>
                    </div>
                    
                    <div className="space-y-4">
                      <TintPicker
                        label="Tint Nút Bấm"
                        values={themeData.tints.buttons}
                        onChange={(values) => updateTint('buttons', values)}
                      />
                      <TintPicker
                        label="Tint Khung"
                        values={themeData.tints.frame}
                        onChange={(values) => updateTint('frame', values)}
                      />
                      <TintPicker
                        label="Tint Khung Không Hoạt Động"
                        values={themeData.tints.frame_inactive}
                        onChange={(values) => updateTint('frame_inactive', values)}
                      />
                      <TintPicker
                        label="Tint Khung Incognito"
                        values={themeData.tints.frame_incognito}
                        onChange={(values) => updateTint('frame_incognito', values)}
                      />
                      <TintPicker
                        label="Tint Tab Nền"
                        values={themeData.tints.background_tab}
                        onChange={(values) => updateTint('background_tab', values)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="properties" className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      <p>⚙️ Cài đặt thuộc tính hiển thị</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Căn Chỉnh Ảnh Nền NTP</Label>
                        <Select
                          value={themeData.properties.ntp_background_alignment}
                          onValueChange={(value) => updateThemeData({ 
                            properties: { ...themeData.properties, ntp_background_alignment: value } 
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="center">Giữa</SelectItem>
                            <SelectItem value="top">Trên</SelectItem>
                            <SelectItem value="bottom">Dưới</SelectItem>
                            <SelectItem value="left">Trái</SelectItem>
                            <SelectItem value="right">Phải</SelectItem>
                            <SelectItem value="top left">Trên Trái</SelectItem>
                            <SelectItem value="top right">Trên Phải</SelectItem>
                            <SelectItem value="bottom left">Dưới Trái</SelectItem>
                            <SelectItem value="bottom right">Dưới Phải</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Lặp Lại Ảnh Nền NTP</Label>
                        <Select
                          value={themeData.properties.ntp_background_repeat}
                          onValueChange={(value) => updateThemeData({ 
                            properties: { ...themeData.properties, ntp_background_repeat: value } 
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-repeat">Không Lặp</SelectItem>
                            <SelectItem value="repeat">Lặp Toàn Bộ</SelectItem>
                            <SelectItem value="repeat-x">Lặp Theo X</SelectItem>
                            <SelectItem value="repeat-y">Lặp Theo Y</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Logo Chrome</Label>
                        <Select
                          value={themeData.properties.ntp_logo_alternate.toString()}
                          onValueChange={(value) => updateThemeData({ 
                            properties: { ...themeData.properties, ntp_logo_alternate: parseInt(value) } 
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Logo Màu</SelectItem>
                            <SelectItem value="1">Logo Trắng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Download Button */}
            <ThemeGenerator themeData={themeData} />
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <LazyChromaPreview themeData={themeData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
