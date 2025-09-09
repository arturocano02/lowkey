import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase environment variables not set. Using placeholder values.');
} else {
  console.log('✅ Supabase environment variables configured');
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface EmailData {
  id?: number
  email: string
  timestamp: string
  user_agent: string
  ip_address?: string
  created_at?: string
}