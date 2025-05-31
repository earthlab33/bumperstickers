import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

interface LikeButtonProps {
  bumperstickerId: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ bumperstickerId }) => {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    // Fetch current likes count
    const fetchLikes = async () => {
      try {
        const { data, error } = await supabase
          .from('bumperstickers')
          .select('likes')
          .eq('id', bumperstickerId)
          .single();

        if (error) throw error;
        setLikes(data.likes || 0);
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    fetchLikes();
  }, [bumperstickerId]);

  const handleLike = async () => {
    try {
      const newLikes = hasLiked ? likes - 1 : likes + 1;
      const { error } = await supabase
        .from('bumperstickers')
        .update({ likes: newLikes })
        .eq('id', bumperstickerId);

      if (error) throw error;

      setLikes(newLikes);
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`like-button p-2 rounded-full transition-colors ${
        hasLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
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
      <span className="ml-2">{likes}</span>
    </button>
  );
}; 