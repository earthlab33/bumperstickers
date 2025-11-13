-- Add peaces column to bumperstickers table
ALTER TABLE bumperstickers
ADD COLUMN IF NOT EXISTS peaces INTEGER DEFAULT 0;

-- Add questions column to bumperstickers table
ALTER TABLE bumperstickers
ADD COLUMN IF NOT EXISTS questions INTEGER DEFAULT 0;

-- Optional: Add comments to document the columns
COMMENT ON COLUMN bumperstickers.peaces IS 'Number of peace sign reactions';
COMMENT ON COLUMN bumperstickers.questions IS 'Number of question mark reactions';

