import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // After the email link is clicked, continue to password setup.
  const next = searchParams.get('next') ?? '/auth/update-password'

  if (code) {
    const supabase = await createClient()
    // Turn the temporary code into a normal login session.
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If the code is missing or bad, send the user back to login.
  return NextResponse.redirect(`${origin}/auth/login?error=auth-code-error`)
}
