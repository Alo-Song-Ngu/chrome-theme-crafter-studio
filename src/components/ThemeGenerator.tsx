
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ThemeData } from '@/pages/Index';
import JSZip from 'jszip';

interface ThemeGeneratorProps {
  themeData: ThemeData;
}

export const ThemeGenerator: React.FC<ThemeGeneratorProps> = ({ themeData }) => {
  const generateManifest = () => {
    const manifest = {
      manifest_version: 3,
      name: themeData.name,
      version: themeData.version,
      description: themeData.description,
      theme: {
        images: {} as Record<string, string>,
        colors: {
          frame: hexToRgb(themeData.colors.frame),
          frame_inactive: hexToRgb(themeData.colors.frame_inactive),
          toolbar: hexToRgb(themeData.colors.toolbar),
          tab_text: hexToRgb(themeData.colors.tab_text),
          tab_background_text: hexToRgb(themeData.colors.tab_background_text),
          bookmark_text: hexToRgb(themeData.colors.bookmark_text),
          ntp_background: hexToRgb(themeData.colors.ntp_background),
          ntp_text: hexToRgb(themeData.colors.ntp_text),
          ntp_link: hexToRgb(themeData.colors.ntp_link),
          button_background: hexToRgb(themeData.colors.button_background),
        },
        properties: {
          ntp_background_alignment: themeData.properties.ntp_background_alignment,
          ntp_background_repeat: themeData.properties.ntp_background_repeat,
        },
      },
    };

    // Add image references to manifest
    if (themeData.images.theme_ntp_background) {
      manifest.theme.images.theme_ntp_background = `images/${themeData.images.theme_ntp_background.name}`;
    }
    if (themeData.images.theme_frame) {
      manifest.theme.images.theme_frame = `images/${themeData.images.theme_frame.name}`;
    }
    if (themeData.images.theme_toolbar) {
      manifest.theme.images.theme_toolbar = `images/${themeData.images.theme_toolbar.name}`;
    }
    if (themeData.images.theme_tab_background) {
      manifest.theme.images.theme_tab_background = `images/${themeData.images.theme_tab_background.name}`;
    }

    return manifest;
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  };

  const downloadTheme = async () => {
    try {
      const zip = new JSZip();
      const manifest = generateManifest();

      // Add manifest.json
      zip.file('manifest.json', JSON.stringify(manifest, null, 2));

      // Create images folder
      const imagesFolder = zip.folder('images');

      // Add images to zip
      const imagePromises = Object.entries(themeData.images).map(async ([key, file]) => {
        if (file && imagesFolder) {
          const arrayBuffer = await file.arrayBuffer();
          imagesFolder.file(file.name, arrayBuffer);
        }
      });

      await Promise.all(imagePromises);

      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Download zip file
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${themeData.name.toLowerCase().replace(/\s+/g, '-')}-theme.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Thành công!',
        description: 'Theme đã được tạo và tải về thành công.',
      });
    } catch (error) {
      console.error('Error generating theme:', error);
      toast({
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi tạo theme. Vui lòng thử lại.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="glass-effect">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Tải Theme Của Bạn</h3>
          <p className="text-sm text-gray-600">
            Theme sẽ được đóng gói thành file .zip sẵn sàng để cài đặt
          </p>
          <Button
            onClick={downloadTheme}
            className="w-full bg-chrome-gradient hover:opacity-90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 animate-chrome-glow"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Tạo và Tải Theme
          </Button>
          <div className="text-xs text-gray-500 space-y-1">
            <p>💡 <strong>Cách cài đặt:</strong></p>
            <p>1. Mở Chrome → Cài đặt → Tiện ích mở rộng</p>
            <p>2. Bật "Chế độ dành cho nhà phát triển"</p>
            <p>3. Kéo thả file .zip vào trang</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
