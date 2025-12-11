import { createClient } from "@supabase/supabase-js"

/**
 * Cliente Supabase Admin - USA SERVICE ROLE KEY
 * ATENÇÃO: Só use em APIs server-side NUNCA no client!
 * Este cliente bypassa RLS - tenha cuidado!
 */
export function createAdminClient() {
  const supabaseUrl = "https://kojduqsmxipoayecuvsi.supabase.co"
  const supabaseServiceKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig"

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
