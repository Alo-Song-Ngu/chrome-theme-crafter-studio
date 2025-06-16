
import React from 'react';
import { ThemeData } from '@/pages/Index';

interface ChromePreviewProps {
  themeData: ThemeData;
}

export const ChromePreview: React.FC<ChromePreviewProps> = ({ themeData }) => {
  const backgroundImage = themeData.images.theme_ntp_background 
    ? URL.createObjectURL(themeData.images.theme_ntp_background)
    : undefined;

  const frameImage = themeData.images.theme_frame
    ? URL.createObjectURL(themeData.images.theme_frame)
    : undefined;

  const toolbarImage = themeData.images.theme_toolbar
    ? URL.createObjectURL(themeData.images.theme_toolbar)
    : undefined;

  return (
    <div className="chrome-browser-mockup bg-white rounded-lg overflow-hidden shadow-lg">
      {/* Browser Frame */}
      <div 
        className="h-8 flex items-center px-4 relative"
        style={{ 
          backgroundColor: themeData.colors.frame,
          backgroundImage: frameImage ? `url(${frameImage})` : undefined,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'top'
        }}
      >
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="absolute right-4 flex space-x-1">
          <div className="w-6 h-4 bg-black bg-opacity-10 rounded-sm"></div>
          <div className="w-6 h-4 bg-black bg-opacity-10 rounded-sm"></div>
          <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
        </div>
      </div>

      {/* Tabs */}
      <div 
        className="h-10 flex items-end px-2 relative"
        style={{ 
          backgroundColor: themeData.colors.frame,
          backgroundImage: frameImage ? `url(${frameImage})` : undefined,
          backgroundRepeat: 'repeat-x'
        }}
      >
        <div 
          className="chrome-tab active px-4 py-2 flex items-center space-x-2 min-w-0 max-w-[200px] rounded-t-lg"
          style={{ 
            backgroundColor: themeData.colors.toolbar,
            backgroundImage: toolbarImage ? `url(${toolbarImage})` : undefined,
            backgroundRepeat: 'repeat-x'
          }}
        >
          <span 
            className="text-sm truncate"
            style={{ color: themeData.colors.tab_text }}
          >
            Trang mới
          </span>
        </div>
        <div 
          className="chrome-tab px-4 py-2 flex items-center space-x-2 min-w-0 max-w-[200px] rounded-t-lg mr-2"
          style={{ 
            backgroundColor: themeData.colors.frame_inactive,
            color: themeData.colors.tab_background_text 
          }}
        >
          <span className="text-sm truncate">Tab khác</span>
        </div>
        <div 
          className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-white hover:bg-opacity-20"
          style={{ color: themeData.colors.tab_background_text }}
        >
          <span className="text-xl">+</span>
        </div>
      </div>

      {/* Toolbar */}
      <div 
        className="h-12 flex items-center px-4 border-b"
        style={{ 
          backgroundColor: themeData.colors.toolbar,
          backgroundImage: toolbarImage ? `url(${toolbarImage})` : undefined,
          backgroundRepeat: 'repeat-x'
        }}
      >
        <div className="flex-1 flex items-center space-x-4">
          {/* Navigation buttons */}
          <div className="flex space-x-1">
            <div 
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ backgroundColor: themeData.colors.button_background }}
            >
              <span className="text-xs">←</span>
            </div>
            <div 
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ backgroundColor: themeData.colors.button_background }}
            >
              <span className="text-xs">→</span>
            </div>
            <div 
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ backgroundColor: themeData.colors.button_background }}
            >
              <span className="text-xs">⟳</span>
            </div>
          </div>
          
          {/* Address bar */}
          <div className="flex-1 h-8 bg-white rounded border px-3 flex items-center">
            <span className="text-xs text-gray-500">chrome://newtab</span>
          </div>
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div 
        className="h-8 flex items-center px-4 border-b"
        style={{ 
          backgroundColor: themeData.colors.toolbar,
          borderColor: themeData.colors.ntp_header
        }}
      >
        <div className="flex space-x-4">
          <span 
            className="text-sm cursor-pointer hover:underline"
            style={{ color: themeData.colors.bookmark_text }}
          >
            Bookmark 1
          </span>
          <span 
            className="text-sm cursor-pointer hover:underline"
            style={{ color: themeData.colors.bookmark_text }}
          >
            Bookmark 2
          </span>
        </div>
      </div>

      {/* New Tab Page Content */}
      <div 
        className="h-64 p-8 flex flex-col items-center justify-center relative"
        style={{ 
          backgroundColor: themeData.colors.ntp_background,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: themeData.properties.ntp_background_alignment,
          backgroundRepeat: themeData.properties.ntp_background_repeat,
        }}
      >
        <div className="text-center space-y-4 z-10">
          <div className="flex justify-center mb-4">
            {themeData.properties.ntp_logo_alternate === 1 ? (
              <div className="text-4xl font-bold text-white">Chrome</div>
            ) : (
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-green-500 to-red-500 bg-clip-text text-transparent">
                Chrome
              </div>
            )}
          </div>
          
          <h2 
            className="text-xl font-light"
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
          
          <div 
            className="bg-opacity-80 p-3 rounded"
            style={{ backgroundColor: themeData.colors.ntp_section }}
          >
            <p 
              className="text-sm"
              style={{ color: themeData.colors.ntp_section_text }}
            >
              Section mẫu
            </p>
            <a 
              href="#"
              className="text-sm underline"
              style={{ 
                color: themeData.colors.ntp_section_link,
                textDecorationColor: themeData.colors.ntp_section_link_underline
              }}
            >
              Liên kết section
            </a>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="#"
              className="text-sm underline"
              style={{ 
                color: themeData.colors.ntp_link,
                textDecorationColor: themeData.colors.ntp_link_underline
              }}
            >
              Liên kết mẫu 1
            </a>
            <a 
              href="#"
              className="text-sm underline"
              style={{ 
                color: themeData.colors.ntp_link,
                textDecorationColor: themeData.colors.ntp_link_underline
              }}
            >
              Liên kết mẫu 2
            </a>
          </div>
        </div>

        {/* Attribution */}
        {themeData.images.theme_ntp_attribution && (
          <div className="absolute bottom-4 right-4">
            <img 
              src={URL.createObjectURL(themeData.images.theme_ntp_attribution)}
              alt="Attribution"
              className="max-w-16 max-h-16"
            />
          </div>
        )}
      </div>
    </div>
  );
};
