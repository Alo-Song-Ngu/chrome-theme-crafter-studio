
import React from 'react';
import { ThemeData } from '@/pages/Index';

interface ChromePreviewProps {
  themeData: ThemeData;
}

export const ChromePreview: React.FC<ChromePreviewProps> = ({ themeData }) => {
  const backgroundImage = themeData.images.theme_ntp_background 
    ? URL.createObjectURL(themeData.images.theme_ntp_background)
    : undefined;

  return (
    <div className="chrome-browser-mockup bg-white">
      {/* Browser Frame */}
      <div 
        className="h-8 flex items-center px-4"
        style={{ backgroundColor: themeData.colors.frame }}
      >
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* Toolbar */}
      <div 
        className="h-12 flex items-center px-4 border-b"
        style={{ backgroundColor: themeData.colors.toolbar }}
      >
        <div className="flex-1 flex items-center space-x-4">
          {/* Navigation buttons */}
          <div className="flex space-x-1">
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
              <span className="text-xs">←</span>
            </div>
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
              <span className="text-xs">→</span>
            </div>
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
              <span className="text-xs">⟳</span>
            </div>
          </div>
          
          {/* Address bar */}
          <div className="flex-1 h-8 bg-white rounded border px-3 flex items-center">
            <span className="text-xs text-gray-500">chrome://newtab</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div 
        className="h-10 flex items-end px-2"
        style={{ backgroundColor: themeData.colors.frame }}
      >
        <div 
          className="chrome-tab active px-4 py-2 bg-white flex items-center space-x-2 min-w-0 max-w-[200px]"
          style={{ backgroundColor: themeData.colors.toolbar }}
        >
          <span 
            className="text-sm truncate"
            style={{ color: themeData.colors.tab_text }}
          >
            Trang mới
          </span>
        </div>
        <div 
          className="chrome-tab px-4 py-2 flex items-center space-x-2 min-w-0 max-w-[200px]"
          style={{ 
            backgroundColor: themeData.colors.frame_inactive,
            color: themeData.colors.tab_background_text 
          }}
        >
          <span className="text-sm truncate">Tab khác</span>
        </div>
        <div className="w-8 h-8 flex items-center justify-center">
          <span className="text-xl">+</span>
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div 
        className="h-8 flex items-center px-4 border-b"
        style={{ backgroundColor: themeData.colors.toolbar }}
      >
        <div className="flex space-x-4">
          <span 
            className="text-sm"
            style={{ color: themeData.colors.bookmark_text }}
          >
            Bookmark 1
          </span>
          <span 
            className="text-sm"
            style={{ color: themeData.colors.bookmark_text }}
          >
            Bookmark 2
          </span>
        </div>
      </div>

      {/* New Tab Page Content */}
      <div 
        className="h-64 p-8 flex flex-col items-center justify-center"
        style={{ 
          backgroundColor: themeData.colors.ntp_background,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: themeData.properties.ntp_background_alignment,
          backgroundRepeat: themeData.properties.ntp_background_repeat,
        }}
      >
        <div className="text-center space-y-4">
          <h2 
            className="text-2xl font-light"
            style={{ color: themeData.colors.ntp_text }}
          >
            Chrome Theme Preview
          </h2>
          <p 
            className="text-sm"
            style={{ color: themeData.colors.ntp_text }}
          >
            Đây là giao diện trang tab mới với theme của bạn
          </p>
          <div className="flex space-x-4">
            <a 
              href="#"
              className="text-sm underline"
              style={{ color: themeData.colors.ntp_link }}
            >
              Liên kết mẫu 1
            </a>
            <a 
              href="#"
              className="text-sm underline"
              style={{ color: themeData.colors.ntp_link }}
            >
              Liên kết mẫu 2
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
