"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(event) {
    event.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage("كلمة المرور يجب ألا تقل عن 6 أحرف.");
      return;
    }

    if (password !== confirmation) {
      setMessage("كلمتا المرور غير متطابقتين.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("already")) {
        setMessage("يوجد حساب مسجل بهذا البريد بالفعل.");
      } else {
        setMessage("تعذر إنشاء الحساب. تأكد من البيانات وحاول مرة أخرى.");
      }
      return;
    }

    if (data.session) {
      router.push("/live");
    } else {
      setMessage("تم إنشاء الحساب. يمكنك الآن تسجيل الدخول.");
    }

    router.refresh();
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <img src="/logo.jpg" alt="Forex4Ever" className="auth-logo" />
        <h1>إنشاء حساب مجاني</h1>
        <p className="form-description">سجّل للوصول إلى البث المباشر.</p>

        <form onSubmit={register}>
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
            minLength="6"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="6 أحرف على الأقل"
          />

          <label htmlFor="confirmation">تأكيد كلمة المرور</label>
          <input
            id="confirmation"
            type="password"
            dir="ltr"
            required
            minLength="6"
            autoComplete="new-password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder="أعد كتابة كلمة المرور"
          />

          {message && <p className="error-message">{message}</p>}

          <button className="button primary form-button" disabled={loading}>
            {loading ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
          </button>
        </form>

        <p className="form-footer">
          لديك حساب بالفعل؟ <Link href="/login">سجّل الدخول</Link>
        </p>
      </div>
    </section>
  );
}
