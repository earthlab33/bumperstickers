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
  const [questions, setQuestions] = useState(0);
  const [hasQuestion, setHasQuestion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize questions and question state
  useEffect(() => {
    const initializeQuestions = async () => {
      try {
        // Get current questions from database
        const { data, error } = await supabase
          .from('bumperstickers')
          .select('questions')
          .eq('id', bumperstickerId)
          .single();

        if (error) throw error;

        const currentQuestions = data.questions || 0;
        console.log('Initial questions from database:', currentQuestions);
        setQuestions(currentQuestions);

        // Check localStorage for question status
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(`question_${bumperstickerId}`);
          // If we have a stored question status, use it
          if (stored !== null) {
            setHasQuestion(stored === 'true');
          } else {
            // If no stored status, set hasQuestion based on current questions
            // This assumes the user hasn't questioned if there are no questions
            setHasQuestion(false);
          }
        }
      } catch (error) {
        console.error('Error initializing questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeQuestions();
  }, [bumperstickerId]);

  const handleQuestion = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const newQuestions = hasQuestion ? Math.max(0, questions - 1) : questions + 1;
      console.log('Attempting to update questions to:', newQuestions);
      
      // Update database first
      const { data, error } = await supabase
        .from('bumperstickers')
        .update({ questions: newQuestions })
        .eq('id', bumperstickerId)
        .select();

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      console.log('Database update successful:', data);

      // Only update local state if database update was successful
      setQuestions(newQuestions);
      const newHasQuestion = !hasQuestion;
      setHasQuestion(newHasQuestion);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`question_${bumperstickerId}`, String(newHasQuestion));
      }
    } catch (error) {
      console.error('Error updating questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleQuestion}
      disabled={isLoading}
      className={`like-button p-2 rounded-full transition-colors ${
        hasQuestion ? 'text-[#3A3735]' : 'text-gray-400 hover:text-[#3A3735]'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={title}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill={hasQuestion ? 'currentColor' : 'none'}
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
      <span className="ml-[0px]">{questions}</span>
    </button>
  );
};
