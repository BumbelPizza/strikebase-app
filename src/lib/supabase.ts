import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please ensure the following environment variables are set:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.error('')
  console.error('For Vercel deployment:')
  console.error('1. Go to your Vercel project dashboard')
  console.error('2. Navigate to Settings > Environment Variables')
  console.error('3. Add the variables from your .env.local file')
  console.error('4. Redeploy your application')
  console.error('')
  throw new Error(
    'Supabase configuration missing. Check the console for setup instructions.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)