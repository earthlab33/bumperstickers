import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getPollForBumpersticker, type Poll as SanityPoll } from '../lib/sanity';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export interface PollProps {
  bumperstickerId: string;
}

export const Poll: React.FC<PollProps> = ({ bumperstickerId }) => {
  const [poll, setPoll] = useState<SanityPoll | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const pollData = await getPollForBumpersticker(bumperstickerId);
        setPoll(pollData);
      } catch (error) {
        console.error('Error fetching poll:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoll();
  }, [bumperstickerId]);

  const handleOptionChange = (optionKey: string) => {
    if (!poll) return;

    if (poll.type === 'multiple') {
      setSelectedOptions(prev => 
        prev.includes(optionKey)
          ? prev.filter(key => key !== optionKey)
          : [...prev, optionKey]
      );
    } else if (poll.type === 'single') {
      setSelectedOptions([optionKey]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poll) return;

    setIsSubmitting(true);
    try {
      const answer = poll.type === 'text' ? textAnswer : selectedOptions;
      
      const { error } = await supabase
        .from('poll_responses')
        .insert([{ 
          bumpersticker_id: bumperstickerId,
          sanity_poll_id: poll._id,
          responses: answer,
          submitted_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setSelectedOptions([]);
      setTextAnswer('');
      alert('Answer submitted successfully!');
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Error submitting answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading poll...</div>;
  }

  if (!poll) {
    return <div className="text-center">No poll available for this bumpersticker.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-4">{poll.question}</h3>
        
        {poll.type === 'text' ? (
          <textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            className="w-3/5 mx-auto p-2 border rounded-lg"
            rows={4}
            placeholder="Enter your answer..."
            required
          />
        ) : (
          <div className="w-3/5 space-y-2">
            {poll.options?.map((option) => (
              <label key={option._key} className="flex items-center space-x-2">
                <input
                  type={poll.type === 'multiple' ? 'checkbox' : 'radio'}
                  checked={selectedOptions.includes(option._key)}
                  onChange={() => handleOptionChange(option._key)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                  required={poll.type === 'single'}
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Answer'}
        </button>
      </div>
    </form>
  );
}; 