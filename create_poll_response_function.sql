-- Database function to submit poll responses
-- This function uses SECURITY DEFINER to bypass RLS policies
-- Run this in your Supabase SQL editor

CREATE OR REPLACE FUNCTION submit_poll_response(
  p_bumpersticker_id TEXT,
  p_sanity_poll_id TEXT,
  p_responses JSONB,
  p_submitted_at TIMESTAMPTZ
)
RETURNS TABLE(id UUID, bumpersticker_id TEXT, sanity_poll_id TEXT, responses JSONB, submitted_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO poll_responses (
    bumpersticker_id,
    sanity_poll_id,
    responses,
    submitted_at
  )
  VALUES (
    p_bumpersticker_id,
    p_sanity_poll_id,
    p_responses,
    p_submitted_at
  )
  RETURNING *;
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION submit_poll_response TO anon;
GRANT EXECUTE ON FUNCTION submit_poll_response TO authenticated;

-- Optional: If you prefer to allow anonymous inserts directly, 
-- you can create an RLS policy instead:
-- CREATE POLICY "Allow anonymous inserts to poll_responses"
--   ON poll_responses
--   FOR INSERT
--   TO anon
--   WITH CHECK (true);

