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
  const [ipAddress, setIpAddress] = useState<string | null>(null);

  useEffect(() => {
    // Get IP address
    const getIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error('Error getting IP address:', error);
      }
    };
    getIpAddress();

    // Fetch current likes count and check if this IP has already liked
    const fetchData = async () => {
      try {
        // Get current likes count
        const { data: bumpersticker, error: fetchError } = await supabase
          .from('bumperstickers')
          .select('likes')
          .eq('id', bumperstickerId)
          .single();

        if (fetchError) throw fetchError;
        setLikes(bumpersticker.likes || 0);

        // Check if this IP has already liked
        if (ipAddress) {
          const { data } = await supabase
            .from('likes')
            .select('id')
            .eq('bumpersticker_id', bumperstickerId)
            .eq('ip_address', ipAddress)
            .single();
          
          setHasLiked(!!data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [bumperstickerId, ipAddress]);

  const handleLike = async () => {
    if (!ipAddress) {
      console.error('IP address not available');
      return;
    }

    try {
      if (hasLiked) {
        // Unlike
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('bumpersticker_id', bumperstickerId)
          .eq('ip_address', ipAddress);

        if (deleteError) throw deleteError;

        // Update bumpersticker likes count
        const { error: updateError } = await supabase
          .from('bumperstickers')
          .update({ likes: likes - 1 })
          .eq('id', bumperstickerId);

        if (updateError) throw updateError;

        setLikes(prev => prev - 1);
        setHasLiked(false);
      } else {
        // Like
        const { error: insertError } = await supabase
          .from('likes')
          .insert([{
            bumpersticker_id: bumperstickerId,
            ip_address: ipAddress
          }]);

        if (insertError) throw insertError;

        // Update bumpersticker likes count
        const { error: updateError } = await supabase
          .from('bumperstickers')
          .update({ likes: likes + 1 })
          .eq('id', bumperstickerId);

        if (updateError) throw updateError;

        setLikes(prev => prev + 1);
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
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