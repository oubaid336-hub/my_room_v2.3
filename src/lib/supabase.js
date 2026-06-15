import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Admin emails - only these can access /admin
export const ADMIN_EMAILS = ['oubaid3366@gmail.com', 'myroomtn@gmail.com']

export function isAdmin(email) {
  return ADMIN_EMAILS.includes(email)
}
