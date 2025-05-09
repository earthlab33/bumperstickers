import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export const LikeButton: React.FC = () => {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = async () => {
    if (hasLiked) return;

    try {
      const { error } = await supabase
        .from('likes')
        .insert([{ created_at: new Date().toISOString() }]);

      if (error) throw error;

      setLikes(prev => prev + 1);
      setHasLiked(true);
    } catch (error) {
      console.error('Error adding like:', error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`like-button p-2 rounded-full transition-colors ${
        hasLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
      }`}
      disabled={hasLiked}
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