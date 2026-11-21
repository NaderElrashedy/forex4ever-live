"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="header">
      <div className="nav-container">
        <Link href="/" className="brand">
          <img src="/logo.jpg" alt="Forex4Ever" />
          <span>Forex4Ever</span>
        </Link>

        <nav className="nav">
          <Link href="/">الرئيسية</Link>

          {user ? (
            <>
              <Link href="/live" className="gold-link">البث المباشر</Link>
              <button type="button" className="nav-button" onClick={logout}>
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link href="/login">تسجيل الدخول</Link>
              <Link href="/register" className="nav-register">إنشاء حساب</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
