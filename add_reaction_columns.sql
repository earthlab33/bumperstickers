-- Add supports column to bumperstickers table
ALTER TABLE bumperstickers
RENAME COLUMN peaces TO supports;

-- Add confuseds column to bumperstickers table
ALTER TABLE bumperstickers
RENAME COLUMN questions TO confuseds;

-- Optional: Add comments to document the columns
COMMENT ON COLUMN bumperstickers.supports IS 'Number of support reactions';
COMMENT ON COLUMN bumperstickers.confuseds IS 'Number of confused reactions';
