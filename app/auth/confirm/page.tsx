"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/ui/password-input";

export default function ConfirmAccount() {
  // Let the invited admin choose a password before signing in.
  const [password, setPassword] = useState("");
  const supabase = createClient(); 
  
  const handleSetPassword = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) alert(error.message);
    else {
      alert("Password set! Welcome to the team.");
      window.location.href = "/admin/admins";
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Set Your Admin Password</h2>
      <form onSubmit={handleSetPassword} className="space-y-4">
        <PasswordInput
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-green-800 text-white p-2 rounded">
          Activate Account
        </button>
      </form>
    </div>
  );
}
