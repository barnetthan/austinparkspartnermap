import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/auth/confirm'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // This sends them to app/auth/confirm/page.tsx
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    console.error("Auth Exchange Error:", error.message)
  }

  // If there's no code or an error, send them to the login page
  return NextResponse.redirect(`${origin}/login?error=auth-failed`)
}