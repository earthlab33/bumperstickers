-- Database function to submit poll responses
-- This function uses SECURITY DEFINER to bypass RLS policies
-- Run this in your Supabase SQL editor

-- Drop the existing function first (if it exists) to allow return type changes
DROP FUNCTION IF EXISTS submit_poll_response(TEXT, TEXT, JSONB, TIMESTAMPTZ);

CREATE OR REPLACE FUNCTION submit_poll_response(
  p_bumpersticker_id TEXT,
  p_sanity_poll_id TEXT,
  p_responses JSONB,
  p_submitted_at TIMESTAMPTZ
)
RETURNS TABLE(id UUID, bumpersticker_id UUID, sanity_poll_id TEXT, responses JSONB, submitted_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_bumpersticker_id UUID;
  v_sanity_poll_id TEXT;
  v_responses JSONB;
  v_submitted_at TIMESTAMPTZ;
BEGIN
  INSERT INTO poll_responses (
    bumpersticker_id,
    sanity_poll_id,
    responses,
    submitted_at
  )
  VALUES (
    p_bumpersticker_id::UUID,
    p_sanity_poll_id,
    p_responses,
    p_submitted_at
  )
  RETURNING 
    poll_responses.id,
    poll_responses.bumpersticker_id,
    poll_responses.sanity_poll_id,
    poll_responses.responses,
    poll_responses.submitted_at
  INTO 
    v_id,
    v_bumpersticker_id,
    v_sanity_poll_id,
    v_responses,
    v_submitted_at;
  
  RETURN QUERY SELECT 
    v_id,
    v_bumpersticker_id,
    v_sanity_poll_id,
    v_responses,
    v_submitted_at;
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

