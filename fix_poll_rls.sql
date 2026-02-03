-- ============================================================
-- FIX POLL RESPONSES RLS ISSUE
-- ============================================================
-- This file provides TWO solutions. Choose ONE:
--
-- SOLUTION 1: Create a database function (Recommended)
--   - More secure and flexible
--   - Allows validation/logging if needed in the future
--   - Run the function creation below
--
-- SOLUTION 2: Create an RLS policy (Simpler)
--   - Allows anonymous users to insert directly
--   - Run the policy creation below (commented out by default)
-- ============================================================

-- ============================================================
-- SOLUTION 1: Create Database Function
-- ============================================================
-- Run this block to create the function that bypasses RLS

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
GRANT EXECUTE ON FUNCTION submit_poll_response(TEXT, TEXT, JSONB, TIMESTAMPTZ) TO anon;
GRANT EXECUTE ON FUNCTION submit_poll_response(TEXT, TEXT, JSONB, TIMESTAMPTZ) TO authenticated;

-- Verify the function was created
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'submit_poll_response';

-- ============================================================
-- SOLUTION 2: Create RLS Policy (Alternative)
-- ============================================================
-- Uncomment and run this block if you prefer to allow direct inserts
-- instead of using a function. You can skip Solution 1 if using this.

/*
-- Enable RLS on the table (if not already enabled)
ALTER TABLE poll_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts
CREATE POLICY "Allow anonymous inserts to poll_responses"
  ON poll_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- If you want to allow authenticated users too:
CREATE POLICY "Allow authenticated inserts to poll_responses"
  ON poll_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
*/

