import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

interface LikeButtonProps {
  bumperstickerId: string;
  title?: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ bumperstickerId, title }) => {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize likes and like state
  useEffect(() => {
    const initializeLikes = async () => {
      try {
        // Get current likes from database
        const { data, error } = await supabase
          .from('bumperstickers')
          .select('likes')
          .eq('id', bumperstickerId)
          .single();

        if (error) throw error;

        const currentLikes = data.likes || 0;
        console.log('Initial likes from database:', currentLikes);
        setLikes(currentLikes);

        // Check localStorage for like status
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(`liked_${bumperstickerId}`);
          // If we have a stored like status, use it
          if (stored !== null) {
            setHasLiked(stored === 'true');
          } else {
            // If no stored status, set hasLiked based on current likes
            // This assumes the user hasn't liked if there are no likes
            setHasLiked(false);
          }
        }
      } catch (error) {
        console.error('Error initializing likes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLikes();
  }, [bumperstickerId]);

  const handleLike = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const newLikes = hasLiked ? Math.max(0, likes - 1) : likes + 1;
      console.log('Attempting to update likes to:', newLikes);
      
      // Update database first
      const { data, error } = await supabase
        .from('bumperstickers')
        .update({ likes: newLikes })
        .eq('id', bumperstickerId)
        .select();

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      console.log('Database update successful:', data);

      // Only update local state if database update was successful
      setLikes(newLikes);
      const newHasLiked = !hasLiked;
      setHasLiked(newHasLiked);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`liked_${bumperstickerId}`, String(newHasLiked));
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`like-button p-2 rounded-full transition-colors ${
        hasLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={title}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill={hasLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="ml-[2px]">{likes}</span>
    </button>
  );
}; 