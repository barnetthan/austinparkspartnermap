"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmAccount() {
const [password, setPassword] = useState("");
  const supabase = createClient(); 
  
  const handleSetPassword = async (e: React.FormEvent) => {
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
        <input 
          type="password" 
          placeholder="New Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required 
        />
        <button className="w-full bg-green-800 text-white p-2 rounded">
          Activate Account
        </button>
      </form>
    </div>
  );
}