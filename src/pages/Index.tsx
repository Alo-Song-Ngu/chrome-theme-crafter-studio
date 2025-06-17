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
import { TintPicker } from '@/components/TintPicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Image, Settings, Download, Lightbulb } from 'lucide-react';

export interface ThemeData {
  name: string;
  version: string;
  description: string;
  author?: string;
  icon: File | null;
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
  const [themeData, setThemeData] = useState<ThemeData>({
    name: 'My Chrome Theme',
    version: '1.0',
    description: 'A beautiful custom Chrome theme',
    author: '',
    icon: null,
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
  });

  const updateThemeData = useCallback((updates: Partial<ThemeData>) => {
    setThemeData(prev => ({
      ...prev,
      ...updates,
      colors: { ...prev.colors, ...updates.colors },
      images: { ...prev.images, ...updates.images },
      tints: { ...prev.tints, ...updates.tints },
      properties: { ...prev.properties, ...updates.properties },
    }));
  }, []);

  const updateColor = useCallback((colorKey: keyof ThemeData['colors'], color: string) => {
    updateThemeData({ 
      colors: { 
        ...themeData.colors,
        [colorKey]: color 
      } 
    });
  }, [updateThemeData, themeData.colors]);

  const updateImage = useCallback((imageKey: keyof ThemeData['images'], file: File | undefined) => {
    updateThemeData({ images: { [imageKey]: file } });
  }, [updateThemeData]);

  const updateTint = useCallback((tintKey: keyof ThemeData['tints'], values: [number, number, number]) => {
    updateThemeData({ 
      tints: { 
        ...themeData.tints,
        [tintKey]: values 
      } 
    });
  }, [updateThemeData, themeData.tints]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 132) {
      updateThemeData({ description: value });
    }
  };

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
                Chrome Theme Studio Pro
              </h1>
              <p className="text-gray-600">Tạo theme Chrome chuyên nghiệp với Manifest v3</p>
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
                  <TabsList className="grid w-full grid-cols-5">
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
                      <Label htmlFor="description">
                        Mô Tả ({themeData.description.length}/132)
                      </Label>
                      <Textarea
                        id="description"
                        value={themeData.description}
                        onChange={handleDescriptionChange}
                        placeholder="Mô tả ngắn về theme của bạn (tối đa 132 ký tự)"
                        rows={3}
                        className={themeData.description.length > 120 ? 'border-yellow-400' : ''}
                      />
                      {themeData.description.length > 120 && (
                        <p className="text-xs text-yellow-600 mt-1">
                          Còn {132 - themeData.description.length} ký tự
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Icon Theme (bắt buộc) - 128x128px
                      </Label>
                      <p className="text-xs text-gray-500 mb-2">
                        Tải lên icon 128x128px. Hệ thống sẽ tự động tạo size 48x48 và 16x16
                      </p>
                      <ImageUpload
                        label=""
                        description="PNG hoặc JPEG, chính xác 128x128 pixels"
                        onImageChange={(file) => updateThemeData({ icon: file || null })}
                        acceptedSize={{ width: 128, height: 128 }}
                        required={true}
                      />
                      {!themeData.icon && (
                        <p className="text-xs text-red-500 mt-1">
                          ⚠️ Icon là bắt buộc để tạo theme
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="text-sm text-gray-600 mb-4">
                      <p>🎨 Tùy chỉnh màu sắc cho từng thành phần của Chrome</p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Khung & Cửa Sổ</h4>
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

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Thanh Công Cụ & Nút Bấm</h4>
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

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Tab</h4>
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

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Trang Tab Mới (NTP)</h4>
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

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Bookmark</h4>
                      <ColorPicker
                        label="Màu Chữ Bookmark"
                        color={themeData.colors.bookmark_text}
                        onChange={(color) => updateColor('bookmark_text', color)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="images" className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="text-sm text-gray-600 mb-4">
                      <p>🖼️ Tải lên hình ảnh để tùy chỉnh giao diện Chrome</p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm">Hình Ảnh Cơ Bản</h4>
                      <ImageUpload
                        label="Ảnh Nền Trang Mới"
                        description="Đề xuất: 1920x1080px hoặc lớn hơn"
                        onImageChange={(file) => updateImage('theme_ntp_background', file)}
                      />
                      <ImageUpload
                        label="Ảnh Khung Cửa Sổ"
                        description="Chiều cao tối thiểu: 128px (lặp lại theo trục X)"
                        onImageChange={(file) => updateImage('theme_frame', file)}
                      />
                      <ImageUpload
                        label="Ảnh Thanh Công Cụ"
                        description="Chiều cao tối thiểu: 128px (tab hiện tại + toolbar)"
                        onImageChange={(file) => updateImage('theme_toolbar', file)}
                      />
                      <ImageUpload
                        label="Ảnh Nền Tab"
                        description="Kích thước: 16x16, 48x48 hoặc 128x128px"
                        onImageChange={(file) => updateImage('theme_tab_background', file)}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm">Hình Ảnh Nâng Cao</h4>
                      <ImageUpload
                        label="Ảnh Nền Nút Bấm"
                        description="Kích thước: 30x30px"
                        onImageChange={(file) => updateImage('theme_button_background', file)}
                      />
                      <ImageUpload
                        label="Ảnh Khung Không Hoạt Động"
                        description="Khung khi cửa sổ không được focus"
                        onImageChange={(file) => updateImage('theme_frame_inactive', file)}
                      />
                      <ImageUpload
                        label="Ảnh Overlay Khung"
                        description="Kích thước: 1100x64px (góc trên trái)"
                        onImageChange={(file) => updateImage('theme_frame_overlay', file)}
                      />
                      <ImageUpload
                        label="Ảnh Attribution"
                        description="Logo tác giả (góc dưới phải trang mới)"
                        onImageChange={(file) => updateImage('theme_ntp_attribution', file)}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm">Chế Độ Incognito</h4>
                      <ImageUpload
                        label="Ảnh Khung Incognito"
                        description="Khung trong chế độ incognito"
                        onImageChange={(file) => updateImage('theme_frame_incognito', file)}
                      />
                      <ImageUpload
                        label="Ảnh Tab Incognito"
                        description="Tab không hoạt động trong incognito"
                        onImageChange={(file) => updateImage('theme_tab_background_incognito', file)}
                      />
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
