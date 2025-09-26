import React, { useEffect } from 'react';
import type { SiteConfig } from '../lib/supabase';
import { incrementViews } from '../lib/supabase';

interface ContentAreaProps {
  config: SiteConfig;
}

export const ContentArea: React.FC<ContentAreaProps> = ({ config }) => {
  // Use config values - styleConfig is required for new sites
  const styleConfig = config.config;

  // Increment views when component mounts (client-side)
  useEffect(() => {
    if (config.id && config.id !== 'default') {
      incrementViews(config.id);
    }
  }, [config.id]);
  
  if (!styleConfig) {
    console.warn('No styleConfig found for site:', config.id);
    return (
      <div className="bg-white p-8 border border-gray-300 rounded text-gray-900">
        <p>Configuration not found. Please check your site settings.</p>
      </div>
    );
  }

  // Generate dynamic styles based on styleConfig
  const containerStyle = {
    backgroundColor: styleConfig.backgroundColor,
    borderColor: styleConfig.borderColor,
    borderWidth: `${styleConfig.borderWidth}px`,
    borderRadius: `${styleConfig.borderRadius}px`,
    padding: '2rem',
    textAlign: styleConfig.justify as 'left' | 'center' | 'right',
    lineHeight: styleConfig.leading,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    MozUserSelect: 'none' as const,
    msUserSelect: 'none' as const,
  };

  const headingStyle = {
    color: styleConfig.headingFontColor,
    fontFamily: styleConfig.headingFontStyle,
    fontSize: `${styleConfig.headingFontSize}px`,
    textAlign: styleConfig.headerAlignment as 'left' | 'center' | 'right',
    marginBottom: '1rem',
    fontWeight: 'bold',
  };

  const bodyStyle = {
    color: styleConfig.bodyFontColor,
    fontFamily: styleConfig.bodyFontStyle,
    fontSize: `${styleConfig.bodyFontSize}px`,
    textAlign: styleConfig.justify as 'left' | 'center' | 'right',
    lineHeight: styleConfig.leading,
    whiteSpace: 'pre-line',
  };

  // Determine border style
  const getBorderStyle = () => {
    switch (styleConfig.borderStyle) {
      case 'none':
        return 'border-none';
      case 'simple':
        return 'border border-solid';
      case 'double':
        return 'border-double';
      case 'dashed':
        return 'border-dashed';
      case 'dotted':
        return 'border-dotted';
      case 'shadow':
        return 'border shadow-2xl';
      case 'accent':
        return 'border-l-4 border-t border-r border-b border-opacity-30 relative before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-current before:opacity-60 after:absolute after:top-0 after:left-0 after:w-2 after:h-2 after:bg-current after:transform after:rotate-45';
      case 'outline':
        return 'border-0 outline outline-2 outline-offset-2';
      case 'modern':
        return 'border-2 rounded-lg shadow-md';
      case 'vintage':
        return 'border-double shadow-inner shadow-2xl drop-shadow-lg ring-1 ring-inset ring-opacity-20 rounded-none relative before:absolute before:inset-[-2px] before:border before:border-dashed before:rounded-none before:opacity-30 after:absolute after:inset-[2px] after:border after:border-dotted after:rounded-none after:opacity-40';
      default:
        return 'border border-solid';
    }
  };

  return (
    <div 
      className={`${getBorderStyle()} select-none mt-[15%] md:mt-[30%] lg:mt-[33vh]`} 
      style={containerStyle}
    >
      {styleConfig.headingText && (
        <h1 style={headingStyle}>
          {styleConfig.headingText}
        </h1>
      )}
      <div style={bodyStyle}>
        {styleConfig.bodyText}
      </div>
    </div>
  );
};
