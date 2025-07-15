# Supabase Bookmark Column Setup

If you're seeing errors about the `is_bookmarked` column not being found in the Supabase schema cache, you need to add this column to your Supabase database.

## Instructions:

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Create a new query
4. Paste the following SQL code:

```sql
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
```

5. Run the query
6. Refresh your application

This will add the `is_bookmarked` column to your conversations table if it doesn't already exist and refresh the schema cache so Supabase recognizes the new column.