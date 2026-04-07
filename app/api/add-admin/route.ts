import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // 1. Initialize with SERVICE_ROLE_KEY
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

    // 2. The "All-in-One" Invite
    // This creates the user AND sends the 'User Invite' email template.
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      // CRITICAL: Point this to your callback, NOT the form directly
      redirectTo: `http://localhost:3000/auth/callback?next=/auth/update-password`,
    })

    if (authError) throw authError

    // 3. Insert into your 'admins' table so they appear in your dashboard
    const { error: dbError } = await supabaseAdmin
      .from('admins')
      .insert([{ 
        id: authData.user.id, 
        email: email 
      }])

    if (dbError) throw dbError

    return NextResponse.json({ 
      message: 'Invitation sent successfully.' 
    })

  } catch (error: any) {
    console.error("Admin Invitation Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}