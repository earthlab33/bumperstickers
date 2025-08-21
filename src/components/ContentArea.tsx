import React from 'react';
import type { SiteConfig } from '../lib/supabase';

interface ContentAreaProps {
  config: SiteConfig;
}

export const ContentArea: React.FC<ContentAreaProps> = ({ config }) => {
  // Use config values if available, fallback to legacy values
  const styleConfig = config.config;
  
  if (!styleConfig) {
    // Fallback to legacy theme-based styling
    return <LegacyContentArea config={config} />;
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
    fontFamily: styleConfig.fontStyle,
    fontStyle: styleConfig.headingFontStyle,
    fontColor: styleConfig.headingFontColor,
    fontSize: `${styleConfig.headingFontSize}px`,
    textAlign: styleConfig.headerAlignment as 'left' | 'center' | 'right',
    marginBottom: '1rem',
    fontWeight: 'bold',
  };

  const bodyStyle = {
    color: styleConfig.bodyFontColor,
    fontFamily: styleConfig.bodyFontStyle,
    fontStyle: styleConfig.bodyFontStyle,
    fontSize: `${styleConfig.bodyFontSize}px`,
    textAlign: styleConfig.justify as 'left' | 'center' | 'right',
    lineHeight: styleConfig.leading,
  };

  // Determine border style
  const getBorderStyle = () => {
    switch (styleConfig.borderStyle) {
      case 'none':
        return 'border-none';
      case 'simple':
        return 'border border-solid';
      case 'double':
        return 'border-2 border-double';
      case 'thick':
        return 'border-4 border-solid';
      case 'dashed':
        return 'border-2 border-dashed';
      case 'dotted':
        return 'border-2 border-dotted';
      case 'shadow':
        return 'border shadow-lg';
      case 'accent':
        return 'border-l-8 border-t-0 border-r-0 border-b-8';
      case 'outline':
        return 'border-0 shadow-lg';
      case 'modern':
        return 'border-l-4 border-t border-r border-b';
      case 'vintage':
        return 'border-4 border-double';
      default:
        return 'border border-solid';
    }
  };

  return (
    <div 
      className={`${getBorderStyle()} select-none`} 
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

// Legacy component for backward compatibility
const LegacyContentArea: React.FC<ContentAreaProps> = ({ config }) => {
  const getThemeClasses = () => {
    switch (config.theme) {
      case 'artistic':
        return `
        relative 
    bg-gradient-to-r from-emerald-700 via-emerald-700 to-emerald-700
    bg-[length:50%_100%] bg-left bg-no-repeat
    p-8 
    border border-emerald-500
    rounded-sm
    text-white 
    font-['Goudy_Old_Style'] 
    text-2xl 
    italic
    text-center
    leading-relaxed
    before:content-['❝'] before:absolute before:top-2 before:left-2 before:text-4xl before:text-emerald-300
    after:content-['❞'] after:absolute after:bottom-2 after:right-2 after:text-4xl after:text-emerald-300
    [text-shadow:_1px_1px_2px_rgb(0_0_0_/_20%)]
    [&>span.highlight]:text-emerald-300 [&>span.highlight]:underline [&>span.highlight]:underline-offset-4 [&>span.highlight]:decoration-dotted [&>span.highlight]:decoration-emerald-400
        `;
      case 'minimalist':
        return `
        relative 
    bg-white 
    p-8 pt-12
    border-t border-gray-200
    text-gray-700 
    font-['Playfair_Display'] 
    text-2xl 
    leading-relaxed
    tracking-wide
    before:content-['—'] before:absolute before:top-4 before:left-8 before:text-gray-300
    hover:border-t-2 hover:border-gray-800 hover:transition-all hover:duration-300
    selection:bg-gray-100`;
      case 'bold':
        return `
        relative 
    bg-black 
    p-6 pb-10
    border-2 border-yellow-400
    text-white 
    font-['Bebas_Neue'] 
    text-3xl 
    text-center
    uppercase 
    tracking-widest
    leading-tight
    before:content-[''] before:absolute before:-bottom-5 before:right-10 before:w-10 before:h-10 before:bg-yellow-400 before:rotate-45 before:z-10
    after:content-['"'] after:absolute after:top-2 after:left-2 after:text-7xl after:text-yellow-400 after:font-serif after:opacity-20`;
      case 'modern':
        return `
        relative 
    bg-gradient-to-br from-indigo-50 to-purple-50
    border-l-8 border-t-0 border-r-0 border-b-0 border-indigo-500
    shadow-lg
    rounded-r-xl
    p-8 
    text-indigo-900 
    font-['Montserrat']
    text-2xl 
    text-center
    leading-snug
    tracking-wide
    after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-500
        `;
      case 'elegant':
        return `
        relative 
    bg-amber-50 
    px-8 py-10
    border-t-2 border-b-2 border-amber-800
    text-amber-900 
    font-serif 
    text-xl 
    text-center
    leading-relaxed
    italic
    before:content-['"'] before:absolute before:top-0 before:left-2 before:text-6xl before:text-amber-300 before:font-serif before:opacity-50
    after:content-['"'] after:absolute after:bottom-0 after:right-2 after:text-6xl after:text-amber-300 after:font-serif after:opacity-50
    first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:text-amber-800
        `;
      default:
        return 'bg-white p-8 border border-gray-300 rounded text-gray-900';
    }
  };

  const getSuperscriptClasses = () => {
    switch (config.theme) {
      case 'artistic':
        return `
        text-amber-700 
        font-serif 
        text-base 
        italic 
        mb-6 
        text-center
        before:content-['❦'] before:mr-3 before:text-amber-500 before:text-lg
        after:content-['❦'] after:ml-3 after:text-amber-500 after:text-lg
        `;
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className={`${getThemeClasses()} select-none`} style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
      <span className={`${getSuperscriptClasses()}`}>{config.superscript}</span>
      {config.content}
    </div>
  );
}; 