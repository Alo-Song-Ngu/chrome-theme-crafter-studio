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
import { QuickStartWizard } from '@/components/QuickStartWizard';
import { CollapsibleSection } from '@/components/CollapsibleSection';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Image, Settings, Download, Lightbulb, Undo, Redo, Wand2, Sliders } from 'lucide-react';

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
  const [showWizard, setShowWizard] = useState(false);

  const initialThemeData: ThemeData = {
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
  };

  const {
    state: themeData,
    pushState: updateThemeData,
    undo,
    redo,
    canUndo,
    canRedo
  } = useUndoRedo({ initialState: initialThemeData });

  const updateThemeDataWithHistory = useCallback((updates: Partial<ThemeData>) => {
    const newThemeData = {
      ...themeData,
      ...updates,
      colors: { ...themeData.colors, ...updates.colors },
      images: { ...themeData.images, ...updates.images },
      tints: { ...themeData.tints, ...updates.tints },
      properties: { ...themeData.properties, ...updates.properties },
    };
    updateThemeData(newThemeData);
  }, [themeData, updateThemeData]);

  const updateColor = useCallback((colorKey: keyof ThemeData['colors'], color: string) => {
    updateThemeDataWithHistory({ 
      colors: { 
        ...themeData.colors,
        [colorKey]: color 
      } 
    });
  }, [updateThemeDataWithHistory, themeData.colors]);

  const updateImage = useCallback((imageKey: keyof ThemeData['images'], file: File | undefined) => {
    updateThemeDataWithHistory({ images: { [imageKey]: file } });
  }, [updateThemeDataWithHistory]);

  const updateTint = useCallback((tintKey: keyof ThemeData['tints'], values: [number, number, number]) => {
    updateThemeDataWithHistory({ 
      tints: { 
        ...themeData.tints,
        [tintKey]: values 
      } 
    });
  }, [updateThemeDataWithHistory, themeData.tints]);

  const updateProperty = useCallback((propertyKey: keyof ThemeData['properties'], value: string | number) => {
    updateThemeDataWithHistory({ 
      properties: { 
        ...themeData.properties,
        [propertyKey]: value 
      } 
    });
  }, [updateThemeDataWithHistory, themeData.properties]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 132) {
      updateThemeDataWithHistory({ description: value });
    }
  };

  const handleApplyTemplate = (template: Partial<ThemeData>) => {
    updateThemeDataWithHistory(template);
    toast({
      title: 'Template áp dụng thành công!',
      description: 'Theme template đã được áp dụng.',
    });
  };

  // Validation for required fields
  const isValid = () => {
    return (
      themeData.name.trim().length > 0 &&
      themeData.version.trim().length > 0 &&
      themeData.description.trim().length >= 22 &&
      themeData.icon !== null &&
      themeData.images.theme_ntp_background !== undefined
    );
  };

  const getValidationErrors = () => {
    const errors = [];
    if (!themeData.name.trim()) errors.push('Tên Theme là bắt buộc');
    if (!themeData.version.trim()) errors.push('Phiên Bản là bắt buộc');
    if (themeData.description.trim().length < 22) errors.push('Mô Tả phải có ít nhất 22 ký tự');
    if (!themeData.icon) errors.push('Icon Theme là bắt buộc');
    if (!themeData.images.theme_ntp_background) errors.push('Ảnh Nền Trang Mới là bắt buộc');
    return errors;
  };

  return (
    <>
      {/* SEO Meta Tags - using React Helmet pattern */}
      <title>Chrome Theme Studio Pro - Tạo Chrome Theme Chuyên Nghiệp</title>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
          <div className="container mx-auto px-4 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-chrome-gradient rounded-xl flex items-center justify-center animate-chrome-glow">
                  <Palette className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold bg-chrome-gradient bg-clip-text text-transparent">
                    Chrome Theme Studio Pro
                  </h1>
                  <p className="text-sm md:text-base text-gray-600">Tạo theme Chrome chuyên nghiệp với Manifest v3</p>
                </div>
              </div>
              
              {/* Undo/Redo Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={!canUndo}
                  className="touch-manipulation"
                >
                  <Undo className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={!canRedo}
                  className="touch-manipulation"
                >
                  <Redo className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWizard(true)}
                  className="touch-manipulation"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Quick Start</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8">
            {/* Control Panel */}
            <div className="space-y-4 md:space-y-6">
              {/* Validation Status */}
              {!isValid() && (
                <Card className="border-yellow-400 bg-yellow-50">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Trường Bắt Buộc Còn Thiếu:</h4>
                        <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                          {getValidationErrors().map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <CollapsibleSection 
                title="Bảng Điều Khiển" 
                icon={<Settings className="w-4 h-4" />}
                defaultExpanded={true}
                className="glass-effect"
              >
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 gap-1">
                    <TabsTrigger value="basic" className="text-xs md:text-sm">Cơ Bản</TabsTrigger>
                    <TabsTrigger value="colors" className="text-xs md:text-sm">Màu Sắc</TabsTrigger>
                    <TabsTrigger value="images" className="text-xs md:text-sm">Hình Ảnh</TabsTrigger>
                    <TabsTrigger value="tints" className="text-xs md:text-sm">Tint</TabsTrigger>
                    <TabsTrigger value="properties" className="text-xs md:text-sm">Thuộc Tính</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div>
                      <Label htmlFor="name">Tên Theme <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        value={themeData.name}
                        onChange={(e) => updateThemeDataWithHistory({ name: e.target.value })}
                        placeholder="Nhập tên theme của bạn"
                        className={!themeData.name.trim() ? 'border-red-300' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="version">Phiên Bản <span className="text-red-500">*</span></Label>
                      <Input
                        id="version"
                        value={themeData.version}
                        onChange={(e) => updateThemeDataWithHistory({ version: e.target.value })}
                        placeholder="1.0"
                        className={!themeData.version.trim() ? 'border-red-300' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="author">Tác Giả</Label>
                      <Input
                        id="author"
                        value={themeData.author || ''}
                        onChange={(e) => updateThemeDataWithHistory({ author: e.target.value })}
                        placeholder="Tên tác giả hoặc username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">
                        Mô Tả <span className="text-red-500">*</span> ({themeData.description.length}/132)
                      </Label>
                      <Textarea
                        id="description"
                        value={themeData.description}
                        onChange={handleDescriptionChange}
                        placeholder="Mô tả ngắn về theme của bạn (tối thiểu 22 ký tự, tối đa 132 ký tự)"
                        rows={3}
                        className={
                          themeData.description.length < 22 || themeData.description.length > 120 
                            ? 'border-red-300' 
                            : themeData.description.length > 110 
                              ? 'border-yellow-400' 
                              : ''
                        }
                      />
                      {themeData.description.length < 22 && (
                        <p className="text-xs text-red-500 mt-1">
                          Cần thêm {22 - themeData.description.length} ký tự nữa
                        </p>
                      )}
                      {themeData.description.length > 110 && themeData.description.length <= 132 && (
                        <p className="text-xs text-yellow-600 mt-1">
                          Còn {132 - themeData.description.length} ký tự
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-4 max-h-80 md:max-h-96 overflow-y-auto">
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

                  <TabsContent value="images" className="space-y-4 max-h-80 md:max-h-96 overflow-y-auto">
                    <div className="text-sm text-gray-600 mb-4">
                      <p>🖼️ Tải lên hình ảnh để tùy chỉnh giao diện Chrome</p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm">Hình Ảnh Bắt Buộc</h4>
                      
                      <div>
                        <Label className="text-sm font-medium">
                          Icon Theme (bắt buộc) <span className="text-red-500">*</span> - 128x128px
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">
                          Tải lên icon 128x128px. Hệ thống sẽ tự động tạo size 48x48 và 16x16
                        </p>
                        <ImageUpload
                          label=""
                          description="PNG hoặc JPEG, chính xác 128x128 pixels"
                          onImageChange={(file) => updateThemeDataWithHistory({ icon: file || null })}
                          acceptedSize={{ width: 128, height: 128 }}
                          required={true}
                        />
                        {!themeData.icon && (
                          <p className="text-xs text-red-500 mt-1">
                            ⚠️ Icon là bắt buộc để tạo theme
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Ảnh Nền Trang Mới <span className="text-red-500">*</span>
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">
                          Đề xuất: 1920x1080px hoặc lớn hơn
                        </p>
                        <ImageUpload
                          label=""
                          description="Ảnh nền cho trang tab mới"
                          onImageChange={(file) => updateImage('theme_ntp_background', file)}
                        />
                        {!themeData.images.theme_ntp_background && (
                          <p className="text-xs text-red-500 mt-1">
                            ⚠️ Ảnh nền trang mới là bắt buộc
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm">Hình Ảnh Cơ Bản</h4>
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
                      <p>⚙️ Cài đặt thuộc tính cho theme</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="ntp_background_alignment">Căn Chỉnh Ảnh Nền</Label>
                        <Select 
                          value={themeData.properties.ntp_background_alignment} 
                          onValueChange={(value) => updateProperty('ntp_background_alignment', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn cách căn chỉnh" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="center">Giữa</SelectItem>
                            <SelectItem value="left">Trái</SelectItem>
                            <SelectItem value="right">Phải</SelectItem>
                            <SelectItem value="top">Trên</SelectItem>
                            <SelectItem value="bottom">Dưới</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="ntp_background_repeat">Lặp Lại Ảnh Nền</Label>
                        <Select 
                          value={themeData.properties.ntp_background_repeat} 
                          onValueChange={(value) => updateProperty('ntp_background_repeat', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn cách lặp lại" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-repeat">Không lặp</SelectItem>
                            <SelectItem value="repeat">Lặp</SelectItem>
                            <SelectItem value="repeat-x">Lặp ngang</SelectItem>
                            <SelectItem value="repeat-y">Lặp dọc</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="ntp_logo_alternate">Logo Thay Thế</Label>
                        <Select 
                          value={themeData.properties.ntp_logo_alternate.toString()} 
                          onValueChange={(value) => updateProperty('ntp_logo_alternate', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn logo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Logo mặc định</SelectItem>
                            <SelectItem value="1">Logo màu trắng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CollapsibleSection>

              {/* Download Button */}
              <ThemeGenerator themeData={themeData} />
            </div>

            {/* Live Preview */}
            <div className="space-y-4 md:space-y-6">
              <CollapsibleSection 
                title="Xem Trước Trực Tiếp" 
                icon={<Image className="w-4 h-4" />}
                defaultExpanded={true}
                className="glass-effect"
              >
                <ChromePreview themeData={themeData} />
              </CollapsibleSection>
            </div>
          </div>
        </div>

        {/* Quick Start Wizard */}
        <QuickStartWizard
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          onApplyTemplate={handleApplyTemplate}
        />
      </div>
    </>
  );
};

export default Index;
