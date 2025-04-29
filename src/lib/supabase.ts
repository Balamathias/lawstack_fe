// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_SUPABASE_URL! as string
// const supabaseKey = process.env.NEXT_SUPABASE_PUBLIC_ANON_KEY! as string
// const supabaseServiceRoleKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY! as string

// // export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
// export const supabase = createClient(supabaseUrl, supabaseKey)


import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL! as string

let supabaseKey: string;

supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY! as string

let supabase: SupabaseClient;

try {
    supabase = createClient(supabaseUrl, supabaseKey)
} catch (error: any) {
    console.error(error)
}

export { supabase }