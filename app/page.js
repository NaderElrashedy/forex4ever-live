import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <img className="hero-logo" src="/logo.jpg" alt="Forex4Ever" />

          <span className="eyebrow">مرحبًا بك في</span>
          <h1>Forex<span>4Ever</span></h1>

          <p>
            تابع البث المباشر والتحليلات من مكان واحد، وسجّل مجانًا للوصول
            إلى صفحة البث.
          </p>

          <div className="hero-actions">
            <Link href="/register" className="button primary">
              إنشاء حساب مجاني
            </Link>
            <Link href="/login" className="button secondary">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </section>

      <section className="features container">
        <article className="feature-card">
          <div className="feature-icon">📺</div>
          <h2>بث مباشر</h2>
          <p>شاهد بث Forex4Ever من خلال YouTube داخل الموقع.</p>
        </article>

        <article className="feature-card">
          <div className="feature-icon">🔐</div>
          <h2>دخول آمن</h2>
          <p>التسجيل وتسجيل الدخول مجانًا باستخدام البريد وكلمة المرور.</p>
        </article>

        <article className="feature-card">
          <div className="feature-icon">📱</div>
          <h2>من أي جهاز</h2>
          <p>تصميم سريع ومتوافق مع الهاتف والتابلت والكمبيوتر.</p>
        </article>
      </section>
    </>
  );
}
