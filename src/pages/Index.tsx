
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ChromePreview } from '@/components/ChromePreview';
import { ColorPicker } from '@/components/ColorPicker';
import { ImageUpload } from '@/components/ImageUpload';
import { ThemeGenerator } from '@/components/ThemeGenerator';
import { Palette, Image, Settings, Download } from 'lucide-react';

export interface ThemeData {
  name: string;
  version: string;
  description: string;
  colors: {
    frame: string;
    frame_inactive: string;
    toolbar: string;
    tab_text: string;
    tab_background_text: string;
    bookmark_text: string;
    ntp_background: string;
    ntp_text: string;
    ntp_link: string;
    button_background: string;
  };
  images: {
    theme_frame?: File;
    theme_toolbar?: File;
    theme_tab_background?: File;
    theme_ntp_background?: File;
  };
  properties: {
    ntp_background_alignment: string;
    ntp_background_repeat: string;
  };
}

const Index = () => {
  const [themeData, setThemeData] = useState<ThemeData>({
    name: 'My Chrome Theme',
    version: '1.0',
    description: 'A beautiful custom Chrome theme',
    colors: {
      frame: '#4285f4',
      frame_inactive: '#5f6368',
      toolbar: '#ffffff',
      tab_text: '#202124',
      tab_background_text: '#5f6368',
      bookmark_text: '#5f6368',
      ntp_background: '#ffffff',
      ntp_text: '#202124',
      ntp_link: '#1a73e8',
      button_background: '#f8f9fa',
    },
    images: {},
    properties: {
      ntp_background_alignment: 'center',
      ntp_background_repeat: 'no-repeat',
    },
  });

  const updateThemeData = useCallback((updates: Partial<ThemeData>) => {
    setThemeData(prev => ({
      ...prev,
      ...updates,
      colors: { ...prev.colors, ...updates.colors },
      images: { ...prev.images, ...updates.images },
      properties: { ...prev.properties, ...updates.properties },
    }));
  }, []);

  const updateColor = useCallback((colorKey: keyof ThemeData['colors'], color: string) => {
    updateThemeData({ colors: { [colorKey]: color } });
  }, [updateThemeData]);

  const updateImage = useCallback((imageKey: keyof ThemeData['images'], file: File | undefined) => {
    updateThemeData({ images: { [imageKey]: file } });
  }, [updateThemeData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-chrome-gradient rounded-xl flex items-center justify-center animate-chrome-glow">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-chrome-gradient bg-clip-text text-transparent">
                Chrome Theme Studio
              </h1>
              <p className="text-gray-600">Tạo theme Chrome tùy chỉnh một cách dễ dàng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Cơ Bản</TabsTrigger>
                    <TabsTrigger value="colors">Màu Sắc</TabsTrigger>
                    <TabsTrigger value="images">Hình Ảnh</TabsTrigger>
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

                  <TabsContent value="colors" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <ColorPicker
                        label="Màu Khung Cửa Sổ"
                        color={themeData.colors.frame}
                        onChange={(color) => updateColor('frame', color)}
                      />
                      <ColorPicker
                        label="Màu Khung Không Hoạt Động"
                        color={themeData.colors.frame_inactive}
                        onChange={(color) => updateColor('frame_inactive', color)}
                      />
                      <ColorPicker
                        label="Màu Thanh Công Cụ"
                        color={themeData.colors.toolbar}
                        onChange={(color) => updateColor('toolbar', color)}
                      />
                      <ColorPicker
                        label="Màu Chữ Tab"
                        color={themeData.colors.tab_text}
                        onChange={(color) => updateColor('tab_text', color)}
                      />
                      <ColorPicker
                        label="Màu Chữ Tab Nền"
                        color={themeData.colors.tab_background_text}
                        onChange={(color) => updateColor('tab_background_text', color)}
                      />
                      <ColorPicker
                        label="Màu Chữ Bookmark"
                        color={themeData.colors.bookmark_text}
                        onChange={(color) => updateColor('bookmark_text', color)}
                      />
                      <ColorPicker
                        label="Màu Nền Trang Mới"
                        color={themeData.colors.ntp_background}
                        onChange={(color) => updateColor('ntp_background', color)}
                      />
                      <ColorPicker
                        label="Màu Chữ Trang Mới"
                        color={themeData.colors.ntp_text}
                        onChange={(color) => updateColor('ntp_text', color)}
                      />
                      <ColorPicker
                        label="Màu Liên Kết Trang Mới"
                        color={themeData.colors.ntp_link}
                        onChange={(color) => updateColor('ntp_link', color)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="images" className="space-y-4">
                    <ImageUpload
                      label="Ảnh Nền Trang Mới"
                      description="Đề xuất: 1920x1080px"
                      onImageChange={(file) => updateImage('theme_ntp_background', file)}
                    />
                    <ImageUpload
                      label="Ảnh Khung Cửa Sổ"
                      description="Ảnh sẽ lặp lại ở cạnh trên của trình duyệt"
                      onImageChange={(file) => updateImage('theme_frame', file)}
                    />
                    <ImageUpload
                      label="Ảnh Nền Thanh Công Cụ"
                      description="Ảnh nền cho thanh công cụ"
                      onImageChange={(file) => updateImage('theme_toolbar', file)}
                    />
                    <ImageUpload
                      label="Ảnh Nền Tab"
                      description="Ảnh nền cho các tab"
                      onImageChange={(file) => updateImage('theme_tab_background', file)}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Download Button */}
            <ThemeGenerator themeData={themeData} />
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Xem Trước Trực Tiếp
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ChromePreview themeData={themeData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
