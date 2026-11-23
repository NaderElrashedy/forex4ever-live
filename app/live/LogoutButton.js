"use client";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function LogoutButton() {
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <button
      onClick={logout}
      style={{
        background: "#d4af37",
        color: "#111",
        border: "none",
        borderRadius: "8px",
        padding: "10px 18px",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      تسجيل خروج
    </button>
  );
}
