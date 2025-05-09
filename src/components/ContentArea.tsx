import React from 'react';
import type { SiteConfig } from '../lib/supabase';

interface ContentAreaProps {
  config: SiteConfig;
}

export const ContentArea: React.FC<ContentAreaProps> = ({ config }) => {
  const getThemeClasses = () => {
    switch (config.theme) {
      case 'radical':
        return 'bg-red-100 text-red-900 text-2xl font-["Impact"] p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-8 prose text-center';
      case 'subdude':
        return 'bg-blue-100 text-blue-900 font-bold text-2xl font-["Georgia"] p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-8 prose text-center';
      case 'subdude-light':
        return 'bg-blue-50 text-blue-800 font-bold text-2xl font-["Times New Roman"] p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-8 prose text-center';
      case 'darkhorse':
        return 'bg-gray-800 text-white font-bold text-2xl font-["Arial Black"] p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-8 prose text-center';
      default:
        return 'bg-gray-800 text-white font-bold text-2xl font-["Arial Black"] p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-8 prose text-center';
    }
  };

  return (
      <div className={`${getThemeClasses()}`}>
        {config.content}
      </div>
  );
}; 