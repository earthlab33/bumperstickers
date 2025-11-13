import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

interface WowButtonProps {
  bumperstickerId: string;
  title?: string;
}

export const WowButton: React.FC<WowButtonProps> = ({ bumperstickerId, title }) => {
  const [wows, setWows] = useState(0);
  const [hasWow, setHasWow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize wows and wow state
  useEffect(() => {
    const initializeWows = async () => {
      try {
        // Get current wows from database
        const { data, error } = await supabase
          .from('bumperstickers')
          .select('wows')
          .eq('id', bumperstickerId)
          .single();

        if (error) throw error;

        const currentWows = data.wows || 0;
        console.log('Initial wows from database:', currentWows);
        setWows(currentWows);

        // Check localStorage for wow status
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(`wow_${bumperstickerId}`);
          // If we have a stored wow status, use it
          if (stored !== null) {
            setHasWow(stored === 'true');
          } else {
            // If no stored status, set hasWow based on current wows
            // This assumes the user hasn't wowed if there are no wows
            setHasWow(false);
          }
        }
      } catch (error) {
        console.error('Error initializing wows:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeWows();
  }, [bumperstickerId]);

  const handleWow = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const newWows = hasWow ? Math.max(0, wows - 1) : wows + 1;
      console.log('Attempting to update wows to:', newWows);
      
      // Update database first
      const { data, error } = await supabase
        .from('bumperstickers')
        .update({ wows: newWows })
        .eq('id', bumperstickerId)
        .select();

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      console.log('Database update successful:', data);

      // Only update local state if database update was successful
      setWows(newWows);
      const newHasWow = !hasWow;
      setHasWow(newHasWow);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`wow_${bumperstickerId}`, String(newHasWow));
      }
    } catch (error) {
      console.error('Error updating wows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleWow}
      disabled={isLoading}
      className={`like-button p-2 rounded-full transition-colors ${
        hasWow ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={title}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill={hasWow ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          strokeWidth={1.5}
          fill={hasWow ? 'currentColor' : 'none'}
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 7v6"
          fill="none"
        />
        <circle
          cx="12"
          cy="16.5"
          r="0.75"
          fill="currentColor"
          stroke="none"
        />
      </svg>
      <span className="ml-[0px]">{wows}</span>
    </button>
  );
}; 