-- SQL Block for StrikeBase Transfer Market Setup
-- Run this in your Supabase SQL Editor

-- 1. Add missing columns to fighters table
ALTER TABLE fighters
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS value INTEGER;

-- 2. Add cash column to profiles table (assuming profiles exists)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS cash INTEGER DEFAULT 1000;

-- 3. Calculate value for all existing fighters (no NULL values)
UPDATE fighters
SET value = (COALESCE(wins, 0) * 150) + 100
WHERE value IS NULL;

-- 4. Enable RLS on tables
ALTER TABLE fighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Authenticated users can view all fighters" ON fighters;
DROP POLICY IF EXISTS "Authenticated users can update fighters" ON fighters;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 6. Create RLS Policies for fighters
CREATE POLICY "Authenticated users can view all fighters"
ON fighters FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update fighters"
ON fighters FOR UPDATE
USING (auth.role() = 'authenticated');

-- 7. Create RLS Policies for profiles
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);