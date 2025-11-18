import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client with service role privileges.
 * This client bypasses Row Level Security (RLS) policies.
 *
 * WARNING: Only use this in server-side code (API routes, server components)
 * and only for operations that require bypassing RLS, such as:
 * - Fetching public data for anonymous users
 * - Admin operations
 * - Background jobs
 *
 * Never expose this client to the client-side or use it for user-specific operations
 * where RLS should be enforced.
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for service client')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
