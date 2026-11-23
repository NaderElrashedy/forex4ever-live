"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignup(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("من فضلك اكتب الاسم.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("من فضلك اكتب البريد الإلكتروني.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("كلمة المرور يجب ألا تقل عن 6 أحرف.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("كلمتا المرور غير متطابقتين.");
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setErrorMessage("إعدادات Supabase غير موجودة.");
      return;
    }

    setLoading(true);

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name.trim(),
        },
      },
    });

    if (error) {
      setLoading(false);

      if (error.message.toLowerCase().includes("already registered")) {
        setErrorMessage("هذا البريد الإلكتروني مسجل بالفعل.");
      } else {
        setErrorMessage(error.message);
      }

      return;
    }

    /*
      إذا كان تأكيد البريد مغلقًا، يتم تسجيل الدخول مباشرة.
      وإذا كان مفعّلًا، يتم نقله لصفحة الدخول.
    */
    if (data.session) {
      router.replace("/live");
      router.refresh();
    } else {
      router.replace("/login?signup=success");
    }
  }

  return (
    <main style={styles.page} dir="rtl">
      <section style={styles.card}>
        <div style={styles.logo}>Forex4Ever</div>

        <h1 style={styles.title}>إنشاء حساب جديد</h1>

        <p style={styles.description}>
          أنشئ حسابك مجانًا للوصول إلى البث المباشر.
        </p>

        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="name" style={styles.label}>
              الاسم
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="اكتب اسمك"
              autoComplete="name"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>
              البريد الإلكتروني
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>
              كلمة المرور
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="6 أحرف على الأقل"
              autoComplete="new-password"
              minLength={6}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="confirmPassword" style={styles.label}>
              تأكيد كلمة المرور
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="أعد كتابة كلمة المرور"
              autoComplete="new-password"
              minLength={6}
              style={styles.input}
              required
            />
          </div>

          {errorMessage && (
            <div style={styles.error}>{errorMessage}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
          </button>
        </form>

        <p style={styles.loginText}>
          لديك حساب بالفعل؟{" "}
          <Link href="/login" style={styles.link}>
            تسجيل الدخول
          </Link>
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 16px",
    background:
      "radial-gradient(circle at top, #1f2937 0%, #0b0f17 55%, #05070b 100%)",
    color: "#ffffff",
  },

  card: {
    width: "100%",
    maxWidth: "440px",
    padding: "32px 24px",
    background: "rgba(17, 24, 39, 0.96)",
    border: "1px solid rgba(212, 175, 55, 0.35)",
    borderRadius: "18px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
  },

  logo: {
    marginBottom: "18px",
    color: "#d4af37",
    fontSize: "25px",
    fontWeight: "800",
    textAlign: "center",
  },

  title: {
    margin: "0 0 10px",
    fontSize: "28px",
    textAlign: "center",
  },

  description: {
    margin: "0 0 26px",
    color: "#aeb7c7",
    lineHeight: "1.8",
    textAlign: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "17px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    color: "#f3f4f6",
    fontSize: "14px",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    background: "#0b0f17",
    color: "#ffffff",
    border: "1px solid #303846",
    borderRadius: "10px",
    fontSize: "16px",
    outline: "none",
  },

  error: {
    padding: "12px",
    color: "#fecaca",
    background: "rgba(127, 29, 29, 0.35)",
    border: "1px solid rgba(239, 68, 68, 0.45)",
    borderRadius: "10px",
    fontSize: "14px",
    lineHeight: "1.7",
  },

  button: {
    width: "100%",
    marginTop: "4px",
    padding: "14px",
    color: "#090b10",
    background: "#d4af37",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "800",
  },

  loginText: {
    margin: "22px 0 0",
    color: "#aeb7c7",
    textAlign: "center",
  },

  link: {
    color: "#d4af37",
    fontWeight: "700",
    textDecoration: "none",
  },
};
