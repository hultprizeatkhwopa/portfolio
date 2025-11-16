import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'https://your-project-id.supabase.co') {
    console.warn('Supabase credentials not configured. Please update .env.local file.')
  }
  
  return createBrowserClient(supabaseUrl, supabaseKey)
}
