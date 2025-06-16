
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
      manifest_version: 2,
      name: themeData.name,
      version: themeData.version,
      description: themeData.description,
      ...(themeData.author && { author: themeData.author }),
      icons: {
        "16": "images/icons/icon16.png",
        "48": "images/icons/icon48.png", 
        "128": "images/icons/icon128.png"
      },
      theme: {
        images: {} as Record<string, string>,
        colors: {
          bookmark_text: hexToRgb(themeData.colors.bookmark_text),
          button_background: hexToRgb(themeData.colors.button_background),
          control_background: hexToRgb(themeData.colors.control_background),
          frame: hexToRgb(themeData.colors.frame),
          frame_inactive: hexToRgb(themeData.colors.frame_inactive),
          frame_incognito: hexToRgb(themeData.colors.frame_incognito),
          frame_incognito_inactive: hexToRgb(themeData.colors.frame_incognito_inactive),
          ntp_background: hexToRgb(themeData.colors.ntp_background),
          ntp_header: hexToRgb(themeData.colors.ntp_header),
          ntp_link: hexToRgb(themeData.colors.ntp_link),
          ntp_link_underline: hexToRgb(themeData.colors.ntp_link_underline),
          ntp_section: hexToRgb(themeData.colors.ntp_section),
          ntp_section_link: hexToRgb(themeData.colors.ntp_section_link),
          ntp_section_link_underline: hexToRgb(themeData.colors.ntp_section_link_underline),
          ntp_section_text: hexToRgb(themeData.colors.ntp_section_text),
          ntp_text: hexToRgb(themeData.colors.ntp_text),
          tab_background_text: hexToRgb(themeData.colors.tab_background_text),
          tab_text: hexToRgb(themeData.colors.tab_text),
          toolbar: hexToRgb(themeData.colors.toolbar),
        },
        tints: {} as Record<string, [number, number, number]>,
        properties: {
          ntp_background_alignment: themeData.properties.ntp_background_alignment,
          ntp_background_repeat: themeData.properties.ntp_background_repeat,
          ntp_logo_alternate: themeData.properties.ntp_logo_alternate,
        },
      },
    };

    // Add image references to manifest
    Object.entries(themeData.images).forEach(([key, file]) => {
      if (file) {
        manifest.theme.images[key] = `images/${file.name}`;
      }
    });

    // Add tints (only if not -1)
    Object.entries(themeData.tints).forEach(([key, values]) => {
      if (values.some(v => v !== -1)) {
        manifest.theme.tints[key] = values;
      }
    });

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

  const generateDefaultIcon = (size: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      
      // Create a simple gradient icon
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#4285f4');
      gradient.addColorStop(1, '#34a853');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      
      // Add a simple design
      ctx.fillStyle = 'white';
      ctx.fillRect(size * 0.2, size * 0.2, size * 0.6, size * 0.6);
      
      canvas.toBlob((blob) => resolve(blob!));
    });
  };

  const downloadTheme = async () => {
    try {
      const zip = new JSZip();
      const manifest = generateManifest();

      // Add manifest.json
      zip.file('manifest.json', JSON.stringify(manifest, null, 2));

      // Create images folder
      const imagesFolder = zip.folder('images');
      const iconsFolder = imagesFolder?.folder('icons');

      // Add user images to zip
      const imagePromises = Object.entries(themeData.images).map(async ([key, file]) => {
        if (file && imagesFolder) {
          const arrayBuffer = await file.arrayBuffer();
          imagesFolder.file(file.name, arrayBuffer);
        }
      });

      // Add default icons
      const iconPromises = [16, 48, 128].map(async (size) => {
        if (iconsFolder) {
          const iconBlob = await generateDefaultIcon(size);
          const iconBuffer = await iconBlob.arrayBuffer();
          iconsFolder.file(`icon${size}.png`, iconBuffer);
        }
      });

      await Promise.all([...imagePromises, ...iconPromises]);

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
            Theme sẽ được đóng gói thành file .zip với manifest v2 sẵn sàng để cài đặt
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
            <p>3. Nhấn "Tải tiện ích mở rộng đã giải nén"</p>
            <p>4. Giải nén file .zip và chọn thư mục</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
