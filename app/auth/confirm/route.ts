import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    // Check the one-time email code.
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // If it works, send the user to the next page.
      redirect(next);
    } else {
      // If it fails, show an error page with the reason.
      redirect(`/auth/error?error=${error?.message}`);
    }
  }

  // If the code is missing, the link is probably bad or expired.
  redirect(`/auth/error?error=No token hash or type`);
}
