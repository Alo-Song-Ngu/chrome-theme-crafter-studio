
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Loader2 } from 'lucide-react';
import { ThemeData } from '@/pages/Index';

interface LazyChromaPreviewProps {
  themeData: ThemeData;
}

export const LazyChromaPreview: React.FC<LazyChromaPreviewProps> = ({ themeData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Simulate loading time for complex preview rendering
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const mockBrowserStyle = {
    backgroundColor: themeData.colors.ntp_background,
    color: themeData.colors.ntp_text,
  };

  const mockToolbarStyle = {
    backgroundColor: themeData.colors.toolbar,
  };

  const mockFrameStyle = {
    backgroundColor: themeData.colors.frame,
  };

  const mockTabStyle = {
    backgroundColor: themeData.colors.frame,
    color: themeData.colors.tab_text,
  };

  return (
    <div ref={ref} className="w-full">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Xem Trước Trực Tiếp
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {!isVisible ? (
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">Preview sẽ tải khi cuộn đến...</p>
            </div>
          ) : isLoading ? (
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">Đang tạo preview...</span>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200">
              {/* Browser Frame */}
              <div style={mockFrameStyle} className="h-8 flex items-center px-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>

              {/* Tabs */}
              <div style={mockFrameStyle} className="flex">
                <div 
                  style={mockTabStyle}
                  className="px-4 py-2 border-r border-white/20 min-w-[120px] text-sm"
                >
                  Tab Hiện Tại
                </div>
                <div 
                  className="px-4 py-2 text-sm opacity-70"
                  style={{ 
                    backgroundColor: themeData.colors.frame_inactive,
                    color: themeData.colors.tab_background_text 
                  }}
                >
                  Tab Khác
                </div>
              </div>

              {/* Toolbar */}
              <div style={mockToolbarStyle} className="h-12 flex items-center px-4 border-b">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-gray-300"></div>
                  <div className="w-6 h-6 rounded bg-gray-300"></div>
                  <div className="flex-1 mx-4 h-8 bg-white rounded px-3 flex items-center text-gray-600 text-sm">
                    chrome://newtab
                  </div>
                  <div className="w-6 h-6 rounded bg-gray-300"></div>
                </div>
              </div>

              {/* Content Area */}
              <div style={mockBrowserStyle} className="h-64 p-8">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">Tab Mới</h2>
                  <p style={{ color: themeData.colors.ntp_text }} className="opacity-80">
                    Đây là cách theme của bạn sẽ trông như thế nào
                  </p>
                  <div className="flex justify-center space-x-4 mt-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-400 rounded"></div>
                    </div>
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                  <a 
                    href="#" 
                    style={{ color: themeData.colors.ntp_link }}
                    className="inline-block mt-4 hover:underline"
                  >
                    Liên kết mẫu
                  </a>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
