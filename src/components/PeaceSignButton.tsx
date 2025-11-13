import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

interface PeaceSignButtonProps {
  bumperstickerId: string;
  title?: string;
}

export const PeaceSignButton: React.FC<PeaceSignButtonProps> = ({ bumperstickerId, title }) => {
  const [supports, setSupports] = useState(0);
  const [hasSupport, setHasSupport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize supports and support state
  useEffect(() => {
    const initializeSupports = async () => {
      try {
        // Get current supports from database
        const { data, error } = await supabase
          .from('bumperstickers')
          .select('supports')
          .eq('id', bumperstickerId)
          .single();

        if (error) throw error;

        const currentSupports = data.supports || 0;
        console.log('Initial supports from database:', currentSupports);
        setSupports(currentSupports);

        // Check localStorage for support status
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(`support_${bumperstickerId}`);
          // If we have a stored support status, use it
          if (stored !== null) {
            setHasSupport(stored === 'true');
          } else {
            // If no stored status, set hasSupport based on current supports
            // This assumes the user hasn't supported if there are no supports
            setHasSupport(false);
          }
        }
      } catch (error) {
        console.error('Error initializing supports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSupports();
  }, [bumperstickerId]);

  const handleSupport = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const newSupports = hasSupport ? Math.max(0, supports - 1) : supports + 1;
      console.log('Attempting to update supports to:', newSupports);
      
      // Update database first
      const { data, error } = await supabase
        .from('bumperstickers')
        .update({ supports: newSupports })
        .eq('id', bumperstickerId)
        .select();

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      console.log('Database update successful:', data);

      // Only update local state if database update was successful
      setSupports(newSupports);
      const newHasSupport = !hasSupport;
      setHasSupport(newHasSupport);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`support_${bumperstickerId}`, String(newHasSupport));
      }
    } catch (error) {
      console.error('Error updating supports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSupport}
      disabled={isLoading}
      className={`like-button p-2 rounded-full transition-colors ${
        hasSupport ? 'text-[#BCD2ED]' : 'text-gray-400 hover:text-[#BCD2ED]'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={title}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill={hasSupport ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          strokeWidth={2}
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v14M12 18l-6-6M12 18l6-6"
        />
      </svg>
      <span className="ml-[0px]">{supports}</span>
    </button>
  );
};
