#!/usr/bin/env node

/**
 * Environment Variables Check Script
 * Run this to verify your Supabase environment variables are properly configured
 */

console.log('🔍 Checking Supabase Environment Variables...\n')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let hasErrors = false

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set')
  hasErrors = true
} else {
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL is set')
  // Basic URL validation
  try {
    new URL(supabaseUrl)
    console.log('   Valid URL format')
  } catch {
    console.error('   ⚠️  Invalid URL format')
  }
}

if (!supabaseKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
  hasErrors = true
} else {
  console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set')
  // Basic key validation (Supabase keys start with 'eyJ')
  if (supabaseKey.startsWith('eyJ')) {
    console.log('   Valid key format')
  } else {
    console.error('   ⚠️  Unexpected key format (should start with "eyJ")')
  }
}

console.log('')

if (hasErrors) {
  console.error('❌ Environment variables are missing or invalid!')
  console.log('')
  console.log('📋 To fix this for Vercel deployment:')
  console.log('1. Go to your Vercel project dashboard')
  console.log('2. Navigate to Settings > Environment Variables')
  console.log('3. Add the following variables from your .env.local file:')
  console.log('   - NEXT_PUBLIC_SUPABASE_URL')
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.log('4. Redeploy your application')
  console.log('')
  console.log('📋 To fix this for local development:')
  console.log('1. Copy .env.example to .env.local')
  console.log('2. Fill in your actual Supabase project values')
  console.log('3. Restart your development server')
  process.exit(1)
} else {
  console.log('✅ All environment variables are properly configured!')
  console.log('')
  console.log('🚀 Your StrikeBase application should work correctly.')
}