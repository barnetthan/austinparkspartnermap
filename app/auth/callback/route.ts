import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // This tells Supabase where to send the user AFTER the code is exchanged
  const next = searchParams.get('next') ?? '/auth/update-password'

  if (code) {
    const supabase = await createClient()
    // This is the "Magic" line that creates the session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/login?error=auth-code-error`)
}