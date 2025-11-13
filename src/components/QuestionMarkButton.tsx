import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

interface QuestionMarkButtonProps {
  bumperstickerId: string;
  title?: string;
}

export const QuestionMarkButton: React.FC<QuestionMarkButtonProps> = ({ bumperstickerId, title }) => {
  const [confuseds, setConfuseds] = useState(0);
  const [hasConfused, setHasConfused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize confuseds and confused state
  useEffect(() => {
    const initializeConfuseds = async () => {
      try {
        // Get current confuseds from database
        const { data, error } = await supabase
          .from('bumperstickers')
          .select('confuseds')
          .eq('id', bumperstickerId)
          .single();

        if (error) throw error;

        const currentConfuseds = data.confuseds || 0;
        console.log('Initial confuseds from database:', currentConfuseds);
        setConfuseds(currentConfuseds);

        // Check localStorage for confused status
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(`confused_${bumperstickerId}`);
          // If we have a stored confused status, use it
          if (stored !== null) {
            setHasConfused(stored === 'true');
          } else {
            // If no stored status, set hasConfused based on current confuseds
            // This assumes the user hasn't confused if there are no confuseds
            setHasConfused(false);
          }
        }
      } catch (error) {
        console.error('Error initializing confuseds:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeConfuseds();
  }, [bumperstickerId]);

  const handleConfused = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const newConfuseds = hasConfused ? Math.max(0, confuseds - 1) : confuseds + 1;
      console.log('Attempting to update confuseds to:', newConfuseds);
      
      // Update database first
      const { data, error } = await supabase
        .from('bumperstickers')
        .update({ confuseds: newConfuseds })
        .eq('id', bumperstickerId)
        .select();

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      console.log('Database update successful:', data);

      // Only update local state if database update was successful
      setConfuseds(newConfuseds);
      const newHasConfused = !hasConfused;
      setHasConfused(newHasConfused);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`confused_${bumperstickerId}`, String(newHasConfused));
      }
    } catch (error) {
      console.error('Error updating confuseds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleConfused}
      disabled={isLoading}
      className={`like-button p-2 rounded-full transition-colors ${
        hasConfused ? 'text-[#3A3735]' : 'text-gray-400 hover:text-[#3A3735]'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={title}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill={hasConfused ? 'currentColor' : 'none'}
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
          d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"
        />
        <circle
          cx="12"
          cy="17"
          r="1.5"
        />
      </svg>
      <span className="ml-[0px]">{confuseds}</span>
    </button>
  );
};
