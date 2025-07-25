import React from 'react';
import type { SiteConfig } from '../lib/supabase';

interface ContentAreaProps {
  config: SiteConfig;
}

export const ContentArea: React.FC<ContentAreaProps> = ({ config }) => {
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
        return 'bg-gray-800 text-white font-bold text-2xl font-["Arial Black"] py-16 shadow-lg max-w-4xl mx-auto my-8 prose text-center';
    }
  };

  const getSuperscriptClasses = () => {
    switch (config.theme) {
      case 'artistic':
        return `
        text-emerald-300 
        font-['Goudy_Old_Style'] 
        text-lg 
        italic 
        mb-4 
        text-center
        [text-shadow:_1px_1px_2px_rgb(0_0_0_/_30%)]
        before:content-['✦'] before:mr-2 before:text-emerald-400
        after:content-['✦'] after:ml-2 after:text-emerald-400
        `;
      case 'minimalist':
        return `
        text-gray-500 
        font-['Playfair_Display'] 
        text-sm 
        uppercase 
        tracking-widest 
        mb-6 
        text-center
        before:content-[''] before:block before:w-8 before:h-px before:bg-gray-300 before:mx-auto before:mb-2
        after:content-[''] after:block after:w-8 after:h-px after:bg-gray-300 after:mx-auto after:mt-2
        `;
      case 'bold':
        return `
        text-yellow-400 
        font-['Bebas_Neue'] 
        text-xl 
        uppercase 
        tracking-widest 
        mb-4 
        text-center
        [text-shadow:_2px_2px_4px_rgb(0_0_0_/_50%)]
        before:content-['★'] before:mr-3 before:text-yellow-300
        after:content-['★'] after:ml-3 after:text-yellow-300
        `;
      case 'modern':
        return `
        text-indigo-600 
        font-['Montserrat'] 
        text-sm 
        font-semibold 
        uppercase 
        tracking-wider 
        mb-4 
        text-center
        before:content-[''] before:inline-block before:w-2 before:h-2 before:bg-indigo-500 before:rounded-full before:mr-2
        after:content-[''] after:inline-block after:w-2 after:h-2 after:bg-indigo-500 after:rounded-full after:ml-2
        `;
      case 'elegant':
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