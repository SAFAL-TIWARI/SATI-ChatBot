-- Add is_bookmarked column to conversations table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'conversations'
        AND column_name = 'is_bookmarked'
    ) THEN
        ALTER TABLE conversations ADD COLUMN is_bookmarked BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';