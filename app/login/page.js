"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      setMessage("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      return;
    }

    router.push("/live");
    router.refresh();
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <img src="/logo.jpg" alt="Forex4Ever" className="auth-logo" />
        <h1>تسجيل الدخول</h1>
        <p className="form-description">أدخل بياناتك لمشاهدة البث المباشر.</p>

        <form onSubmit={login}>
          <label htmlFor="email">البريد الإلكتروني</label>
          <input
            id="email"
            type="email"
            dir="ltr"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
          />

          <label htmlFor="password">كلمة المرور</label>
          <input
            id="password"
            type="password"
            dir="ltr"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />

          {message && <p className="error-message">{message}</p>}

          <button className="button primary form-button" disabled={loading}>
            {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="form-footer">
          ليس لديك حساب؟ <Link href="/register">أنشئ حسابًا مجانًا</Link>
        </p>
      </div>
    </section>
  );
}
