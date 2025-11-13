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
  const [peaces, setPeaces] = useState(0);
  const [hasPeace, setHasPeace] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize peaces and peace state
  useEffect(() => {
    const initializePeaces = async () => {
      try {
        // Get current peaces from database
        const { data, error } = await supabase
          .from('bumperstickers')
          .select('peaces')
          .eq('id', bumperstickerId)
          .single();

        if (error) throw error;

        const currentPeaces = data.peaces || 0;
        console.log('Initial peaces from database:', currentPeaces);
        setPeaces(currentPeaces);

        // Check localStorage for peace status
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(`peace_${bumperstickerId}`);
          // If we have a stored peace status, use it
          if (stored !== null) {
            setHasPeace(stored === 'true');
          } else {
            // If no stored status, set hasPeace based on current peaces
            // This assumes the user hasn't peaced if there are no peaces
            setHasPeace(false);
          }
        }
      } catch (error) {
        console.error('Error initializing peaces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePeaces();
  }, [bumperstickerId]);

  const handlePeace = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const newPeaces = hasPeace ? Math.max(0, peaces - 1) : peaces + 1;
      console.log('Attempting to update peaces to:', newPeaces);
      
      // Update database first
      const { data, error } = await supabase
        .from('bumperstickers')
        .update({ peaces: newPeaces })
        .eq('id', bumperstickerId)
        .select();

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      console.log('Database update successful:', data);

      // Only update local state if database update was successful
      setPeaces(newPeaces);
      const newHasPeace = !hasPeace;
      setHasPeace(newHasPeace);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`peace_${bumperstickerId}`, String(newHasPeace));
      }
    } catch (error) {
      console.error('Error updating peaces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePeace}
      disabled={isLoading}
      className={`like-button p-2 rounded-full transition-colors ${
        hasPeace ? 'text-[#BCD2ED]' : 'text-gray-400 hover:text-[#BCD2ED]'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={title}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill={hasPeace ? 'currentColor' : 'none'}
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
      <span className="ml-[0px]">{peaces}</span>
    </button>
  );
};
