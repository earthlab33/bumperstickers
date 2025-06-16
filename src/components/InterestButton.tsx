import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

interface InterestButtonProps {
  bumperstickerId: string;
  title?: string;
}

export const InterestButton: React.FC<InterestButtonProps> = ({ bumperstickerId, title }) => {
  const [interests, setInterests] = useState(0);
  const [hasInterest, setHasInterest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize interests and interest state
  useEffect(() => {
    const initializeInterests = async () => {
      try {
        // Get current wows from database
        const { data, error } = await supabase
          .from('bumperstickers')
          .select('interests')
          .eq('id', bumperstickerId)
          .single();

        if (error) throw error;

        const currentInterests = data.interests || 0;
        console.log('Initial interests from database:', currentInterests);
        setInterests(currentInterests);

        // Check localStorage for wow status
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(`interest_${bumperstickerId}`);
          // If we have a stored interest status, use it
          if (stored !== null) {
            setHasInterest(stored === 'true');
          } else {
            // If no stored status, set hasInterest based on current interests
            // This assumes the user hasn't interested if there are no interests
            setHasInterest(false);
          }
        }
      } catch (error) {
        console.error('Error initializing interests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeInterests();
  }, [bumperstickerId]);

  const handleInterest = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const newInterests = hasInterest ? Math.max(0, interests - 1) : interests + 1;
      console.log('Attempting to update interests to:', newInterests);
      
      // Update database first
      const { data, error } = await supabase
        .from('bumperstickers')
        .update({ interests: newInterests })
        .eq('id', bumperstickerId)
        .select();

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      console.log('Database update successful:', data);

      // Only update local state if database update was successful
      setInterests(newInterests);
      const newHasInterest = !hasInterest;
      setHasInterest(newHasInterest);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`interest_${bumperstickerId}`, String(newHasInterest));
      }
    } catch (error) {
      console.error('Error updating interests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleInterest}
      disabled={isLoading}
      className={`interest-button p-2 rounded-full transition-colors ${
        hasInterest ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={title}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill={hasInterest ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
      <span className="ml-2">{interests}</span>
    </button>
  );
}; 