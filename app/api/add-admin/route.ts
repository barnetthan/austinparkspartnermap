import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // Use the service key because this route creates admin users.
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create the new admin account and send the invite email.
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      // Send the user through the callback route so the app can sign them in.
      redirectTo: `http://localhost:3000/auth/callback?next=/auth/update-password`,
    })

    if (authError) throw authError

    // Save the new admin in the admin list too.
    const { error: dbError } = await supabaseAdmin
      .from('admins')
      .upsert(
        [{
          id: authData.user.id,
          email,
        }],
        { onConflict: 'id' }
      )

    if (dbError) throw dbError

    return NextResponse.json({ 
      message: 'Invitation sent successfully.' 
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    console.error("Admin Invitation Error:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}
