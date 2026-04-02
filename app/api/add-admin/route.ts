import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // 1. Initialize Supabase with the SERVICE_ROLE_KEY
    // This allows us to bypass RLS and manage users directly
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 2. Create the user silently
    // We set a random password and auto-confirm the email
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true, 
      password: Math.random().toString(36).slice(-16),
      user_metadata: { role: 'admin' } // Optional: tag them as admin in Auth
    })

    if (authError) throw authError

    // // 3. Insert into your custom 'admins' table
    // // This ensures they show up in your "Current Admins" list immediately
    // const { error: dbError } = await supabaseAdmin
    //   .from('admins')
    //   .insert([{ 
    //     id: authData.user.id, 
    //     email: email 
    //   }])

    // if (dbError) throw dbError

    const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
  // This must match your folder name exactly
  redirectTo: `http://localhost:3000/auth/update-password`,
    });

    if (resetError) {
      console.warn("User created, but reset email failed:", resetError.message)
      // We don't throw here because the account is already successfully created
    }

    return NextResponse.json({ 
      message: 'Admin created successfully and reset email sent.' 
    })

  } catch (error: any) {
    console.error("Admin Creation Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}