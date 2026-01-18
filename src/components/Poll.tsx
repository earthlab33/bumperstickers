import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getPollForBumpersticker, type Poll as SanityPoll, type PollQuestion } from '../lib/sanity';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export interface PollProps {
  bumperstickerId: string;
}

export const Poll: React.FC<PollProps> = ({ bumperstickerId }) => {
  const [poll, setPoll] = useState<SanityPoll | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const pollData = await getPollForBumpersticker(bumperstickerId);
        setPoll(pollData);
        
        // Check if poll was already submitted
        const submittedKey = `poll_submitted_${bumperstickerId}`;
        const wasSubmitted = localStorage.getItem(submittedKey) === 'true';
        if (wasSubmitted) {
          setIsSubmitted(true);
        }
        
        // Initialize answers object
        if (pollData && !wasSubmitted) {
          const initialAnswers: Record<string, string | string[]> = {};
          pollData.questions.forEach(q => {
            initialAnswers[q.questionText] = q.questionType === 'multiple-choice' ? [] : '';
          });
          setAnswers(initialAnswers);
        }
      } catch (error) {
        console.error('Error fetching poll:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoll();
  }, [bumperstickerId]);

  const handleOptionChange = (questionText: string, option: string, isMultiple: boolean) => {
    setAnswers(prev => {
      if (isMultiple) {
        const currentAnswers = prev[questionText] as string[];
        return {
          ...prev,
          [questionText]: currentAnswers.includes(option)
            ? currentAnswers.filter(a => a !== option)
            : [...currentAnswers, option]
        };
      } else {
        return {
          ...prev,
          [questionText]: option
        };
      }
    });
  };

  const handleTextChange = (questionText: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionText]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poll) return;

    setIsSubmitting(true);
    try {
      // Try direct insert first (fallback if RLS allows it)
      // If RLS blocks anonymous inserts, use an RPC function instead
      const { data, error } = await supabase
        .from('poll_responses')
        .insert([{ 
          bumpersticker_id: bumperstickerId,
          sanity_poll_id: poll._id,
          responses: answers,
          submitted_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        // If we get an RLS/permission error, try using RPC function
        const isRlsError = error.code === '42501' || 
                          error.message?.includes('permission') || 
                          error.message?.includes('RLS') || 
                          error.message?.includes('row-level security') ||
                          error.code === 'PGRST301';
        
        if (isRlsError) {
          console.log('RLS error detected, attempting RPC function call...');
          // Try calling an RPC function that should have SECURITY DEFINER
          const { data: rpcData, error: rpcError } = await supabase
            .rpc('submit_poll_response', {
              p_bumpersticker_id: bumperstickerId,
              p_sanity_poll_id: poll._id,
              p_responses: answers,
              p_submitted_at: new Date().toISOString()
            });

          if (rpcError) {
            console.error('RPC function error:', rpcError);
            // If function doesn't exist, provide helpful error message
            if (rpcError.message?.includes('does not exist') || rpcError.code === '42883') {
              throw new Error('The database function submit_poll_response does not exist. Please run the SQL script create_poll_response_function.sql in your Supabase SQL editor.');
            }
            throw rpcError;
          }

          console.log('Poll submitted via RPC successfully:', rpcData);
        } else {
          throw error;
        }
      } else {
        console.log('Poll submitted successfully:', data);
      }

      // Mark as submitted and store in localStorage
      setIsSubmitted(true);
      const submittedKey = `poll_submitted_${bumperstickerId}`;
      localStorage.setItem(submittedKey, 'true');
    } catch (error: any) {
      console.error('Error submitting poll:', error);
      const errorMessage = error?.message || 'Unknown error occurred';
      const isRlsError = error?.code === '42501' || 
                        error?.code === 'PGRST301' ||
                        errorMessage.includes('permission') || 
                        errorMessage.includes('RLS') || 
                        errorMessage.includes('row-level security') ||
                        errorMessage.includes('function') && errorMessage.includes('does not exist');
      
      if (isRlsError) {
        alert(`Permission denied: ${errorMessage}. The database function 'submit_poll_response' may need to be created with SECURITY DEFINER, or RLS policies need to allow anonymous inserts.`);
      } else {
        alert(`Error submitting poll: ${errorMessage}. Please try again.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-200">Loading poll...</div>;
  }

  if (!poll) {
    return null;
  }

  if (isSubmitted) {
    return (
      <div className="text-center text-gray-200">
        <h3 className="text-md font-bold text-gray-200 mb-3">Thank you!</h3>
        <p className="text-gray-200 text-md">Your poll response has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-200">{poll.title}</h2>
        <p className="text-gray-200 mb-6">{poll.description}</p>
        
        <div className="w-3/5 space-y-6">
          {poll.questions.map((question, index) => (
            <div key={index} className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-200">
                {question.questionText}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </h3>
              
              {question.questionType === 'text' ? (
                <textarea
                  value={answers[question.questionText] as string}
                  onChange={(e) => handleTextChange(question.questionText, e.target.value)}
                  className="w-full p-2 border rounded-lg text-gray-200"
                  rows={4}
                  placeholder="Enter your answer..."
                  required={question.required}
                />
              ) : (
                <div className="space-y-2">
                  {question.options?.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-2">
                      <input
                        type={question.questionType === 'multiple-choice' ? 'checkbox' : 'radio'}
                        checked={
                          question.questionType === 'multiple-choice'
                            ? (answers[question.questionText] as string[]).includes(option)
                            : answers[question.questionText] === option
                        }
                        onChange={() => handleOptionChange(
                          question.questionText,
                          option,
                          question.questionType === 'multiple-choice'
                        )}
                        className="form-checkbox h-4 w-4 text-gray-200"
                        required={question.required && question.questionType === 'single-choice'}
                      />
                      <span className="text-gray-200">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 px-6 py-2 bg-[#BCD2ED] text-white rounded-lg hover:bg-[#BCD2ED]/80 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Poll'}
        </button>
      </div>
    </form>
  );
}; 