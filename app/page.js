"use client";
import FloatingSocialMenu from "./components/FloatingSocialMenu";
import Link from "next/link";
import { useEffect, useRef } from "react";


const features = [
  {
    icon: "🎓",
    title: "الأكاديمية المجانية",
    description:
      "ابدأ من الأساسيات وتعلّم التحليل الفني وإدارة رأس المال وعلم نفس التداول بخطوات واضحة.",
    href: "/academy",
    button: "ابدأ التعلّم",
  },
  {
    icon: "🔴",
    title: "البث المباشر",
    description:
      "تابع جلسات السوق والتحليلات المباشرة بعد تسجيل الدخول إلى حسابك المجاني.",
    href: "/live",
    button: "الدخول إلى البث",
  },
  {
    icon: "📊",
    title: "فهم حركة السعر",
    description:
      "تعرّف على الاتجاهات ومناطق الدعم والمقاومة والشموع اليابانية بطريقة عملية.",
    href: "/academy",
    button: "استكشف الدروس",
  },
];

const learningSteps = [
  {
    number: "01",
    title: "تعلّم الأساسيات",
    text: "افهم سوق الفوركس، أزواج العملات، النقطة، السبريد والرافعة المالية.",
  },
  {
    number: "02",
    title: "اقرأ الشارت",
    text: "تعلّم الاتجاهات والدعم والمقاومة والشموع وأساسيات التحليل الفني.",
  },
  {
    number: "03",
    title: "أدر المخاطر",
    text: "حدّد حجم الصفقة ووقف الخسارة قبل الدخول، ولا تخاطر بما لا تستطيع تحمّل خسارته.",
  },
  {
    number: "04",
    title: "طوّر خطتك",
    text: "اختبر خطتك على حساب تجريبي وسجّل نتائجك قبل التفكير في التداول الحقيقي.",
  },
];
function HomeLiveTicker() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbols: [
        {
          proName: "OANDA:XAUUSD",
          title: "الذهب",
        },
        {
          proName: "OANDA:XAGUSD",
          title: "الفضة",
        },
        {
          proName: "OANDA:EURUSD",
          title: "EUR/USD",
        },
        {
          proName: "OANDA:GBPUSD",
          title: "GBP/USD",
        },
        {
          proName: "OANDA:USDJPY",
          title: "USD/JPY",
        },
        {
          proName: "BINANCE:BTCUSDT",
          title: "Bitcoin",
        },
        {
          proName: "BINANCE:ETHUSDT",
          title: "Ethereum",
        },
        {
          proName: "FOREXCOM:SPXUSD",
          title: "S&P 500",
        },
        {
          proName: "FOREXCOM:NSXUSD",
          title: "Nasdaq 100",
        },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });

    container.appendChild(widget);
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
  <section
    style={{
      width: "100%",
      height: "100px",
      padding: "0",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      background: "#080d13",
      borderTop: "1px solid rgba(231, 185, 79, 0.22)",
      borderBottom: "1px solid rgba(231, 185, 79, 0.22)",
      direction: "ltr",
    }}
  >
    <div
      ref={containerRef}
      className="tradingview-widget-container"
      style={{
        width: "100%",
        minHeight: "46px",
        display: "flex",
        alignItems: "center",
      }}
    />
  </section>
);
}

export default function HomePage() {
  return (
    
    <main className="site">
    <FloatingSocialMenu />
      {/* خلفية التصميم */}
      <div className="background-grid" aria-hidden="true" />
      <div className="glow glow-one" aria-hidden="true" />
      <div className="glow glow-two" aria-hidden="true" />

      {/* القائمة الرئيسية */}
   

      {/* شريط الأسعار */}
      <section className="market-ticker" aria-label="أسعار توضيحية">
      <HomeLiveTicker />
      </section>

      {/* القسم الرئيسي */}
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span>✦</span>
            تعلّم التداول بوعي وانضباط
          </div>

          <h1>
            افهم السوق قبل أن
            <span className="gold-text"> تتخذ قرارك</span>
          </h1>

          <p className="hero-description">
            منصّة عربية تساعدك على تعلّم أساسيات التداول، قراءة الشارت،
            إدارة المخاطر وبناء خطة تداول واضحة من خلال الأكاديمية المجانية
            والبث المباشر.
          </p>

          <div className="hero-buttons">
            <Link href="/academy" className="primary-button">
              ابدأ الأكاديمية مجانًا
              <span>←</span>
            </Link>

            <Link href="/live" className="secondary-button">
              <span className="play-icon">▶</span>
              مشاهدة البث
            </Link>
          </div>

          <div className="hero-points">
            <span>✓ محتوى عربي</span>
            <span>✓ تسجيل مجاني</span>
            <span>✓ مناسب للمبتدئين</span>
          </div>
        </div>

        {/* بطاقة الشارت */}
        <div className="trading-card">
          <div className="card-light" />

          <div className="chart-header">
            <div>
              <span className="pair-name">XAU / USD</span>
              <small>الذهب مقابل الدولار</small>
            </div>

            <div className="market-status">
              <span />
              MARKET
            </div>
          </div>

          <div className="price-row">
            <strong>2,034.70</strong>
            <span>+0.34%</span>
          </div>

          <div className="chart-area">
            <div className="chart-grid" />

            <div className="candles" aria-hidden="true">
              <i className="candle red c1" />
              <i className="candle green c2" />
              <i className="candle green c3" />
              <i className="candle red c4" />
              <i className="candle green c5" />
              <i className="candle green c6" />
              <i className="candle red c7" />
              <i className="candle green c8" />
              <i className="candle green c9" />
              <i className="candle red c10" />
              <i className="candle green c11" />
              <i className="candle green c12" />
            </div>

            <svg
              className="line-chart"
              viewBox="0 0 600 250"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e7b94f" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#e7b94f" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                className="area-path"
                d="M0,205 C45,198 60,170 100,180 C145,190 160,145 210,155 C255,165 270,115 320,130 C365,143 385,92 430,105 C475,118 500,58 600,42 L600,250 L0,250 Z"
              />

              <path
                className="chart-path"
                pathLength="1"
                d="M0,205 C45,198 60,170 100,180 C145,190 160,145 210,155 C255,165 270,115 320,130 C365,143 385,92 430,105 C475,118 500,58 600,42"
              />
            </svg>

            <div className="chart-price">2,034.70</div>
          </div>

          <div className="chart-footer">
            <span>1H</span>
            <span>4H</span>
            <span className="active">1D</span>
            <span>1W</span>
            <span>1M</span>
          </div>
        </div>
      </section>

      {/* الإحصائيات */}
      <section className="stats-section">
        <div className="stat">
          <strong>6</strong>
          <span>دورات تعليمية</span>
        </div>

        <div className="stat">
          <strong>30</strong>
          <span>فصلًا تعليميًا</span>
        </div>

        <div className="stat">
          <strong>100%</strong>
          <span>محتوى مجاني</span>
        </div>

        <div className="stat">
          <strong>24/7</strong>
          <span>وصول إلى الدروس</span>
        </div>
      </section>

      {/* المميزات */}
      <section className="section">
        <div className="section-heading">
          <span>ماذا ستجد في Forex4Ever؟</span>
          <h2>كل ما تحتاجه لبداية تعليمية منظّمة</h2>
          <p>
            تعلّم خطوة بخطوة، وركّز على الفهم وإدارة المخاطر بدل القرارات
            العشوائية.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <article className="feature-card" key={feature.title}>
              <div className="card-number">0{index + 1}</div>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>

              <Link href={feature.href}>
                {feature.button}
                <span>←</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* خطوات التعلم */}
      <section className="learning-section">
        <div className="learning-content">
          <div className="section-heading right-heading">
            <span>طريقك للتعلّم</span>
            <h2>ابدأ بخطة، وليس بصفقة عشوائية</h2>
            <p>
              التداول يحتاج إلى معرفة وتدريب وانضباط. اتبع مسارًا تدريجيًا
              واستخدم الحساب التجريبي قبل المخاطرة بأموال حقيقية.
            </p>
          </div>

          <Link href="/academy" className="primary-button small-button">
            تصفّح جميع الدورات
            <span>←</span>
          </Link>
        </div>

        <div className="steps-list">
          {learningSteps.map((step) => (
            <div className="learning-step" key={step.number}>
              <div className="step-number">{step.number}</div>

              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* الدعوة للتسجيل */}
      <section className="cta-section">
        <div className="cta-chart" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="cta-content">
          <span className="cta-label">ابدأ رحلتك التعليمية</span>
          <h2>أنشئ حسابك المجاني وتابع المحتوى والبث المباشر</h2>
          <p>
            لا توجد اشتراكات مدفوعة. أنشئ حسابًا وابدأ تعلّم أساسيات السوق
            وإدارة المخاطر.
          </p>

          <div className="cta-buttons">
            <Link href="/signup" className="primary-button">
              إنشاء حساب مجاني
              <span>←</span>
            </Link>

            <Link href="/login" className="text-button">
              لدي حساب بالفعل
            </Link>
          </div>
        </div>
      </section>

      {/* تحذير المخاطر */}
      <section className="risk-warning">
        <span className="warning-icon">!</span>

        <div>
          <strong>تنبيه مهم حول المخاطر</strong>
          <p>
            المحتوى الموجود على Forex4Ever تعليمي فقط ولا يُعد توصية مالية.
            التداول في الأسواق المالية ينطوي على مخاطر مرتفعة وقد يؤدي إلى
            خسارة جزء من رأس المال أو كله. استخدم حسابًا تجريبيًا ولا تتداول
            بأموال لا تستطيع تحمّل خسارتها.
          </p>
        </div>
      </section>

      {/* الفوتر */}
      <footer className="footer">
        <Link href="/" className="brand footer-brand">
          <span className="brand-chart" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>

          <span className="brand-name">
            Forex<span>4Ever</span>
          </span>
        </Link>

        <p>منصّة عربية للتعليم والتوعية بأساسيات التداول وإدارة المخاطر.</p>

        <div className="footer-links">
          <Link href="/">الرئيسية</Link>
          <Link href="/academy">الأكاديمية</Link>
          <Link href="/live">البث المباشر</Link>
          <Link href="/login">تسجيل الدخول</Link>
        </div>

        <div className="copyright">
          © {new Date().getFullYear()} Forex4Ever — جميع الحقوق محفوظة
        </div>
      </footer>

      <style jsx global>{`
        :root {
          --background: #070b10;
          --background-light: #0c121a;
          --card: rgba(15, 22, 31, 0.82);
          --border: rgba(255, 255, 255, 0.09);
          --gold: #e7b94f;
          --gold-light: #ffd978;
          --green: #25c997;
          --red: #ff6577;
          --text: #f4f6f8;
          --muted: #9ba7b5;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--background);
          color: var(--text);
          font-family: Tahoma, Arial, sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .site {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 80% 10%, rgba(231, 185, 79, 0.08), transparent 25%),
            linear-gradient(180deg, #070b10 0%, #090e14 50%, #070b10 100%);
        }

        .background-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.12;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 55px 55px;
          mask-image: linear-gradient(to bottom, black, transparent 80%);
        }

        .glow {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(110px);
          pointer-events: none;
          opacity: 0.11;
        }

        .glow-one {
          top: 100px;
          right: -180px;
          background: var(--gold);
        }

        .glow-two {
          top: 720px;
          left: -200px;
          background: #1b8bff;
        }

        .main-header {
          position: relative;
          z-index: 50;
          border-bottom: 1px solid var(--border);
          background: rgba(7, 11, 16, 0.82);
          backdrop-filter: blur(18px);
        }

        .header-container {
          width: min(1180px, calc(100% - 40px));
          min-height: 76px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          font-weight: 900;
        }

        .brand-name {
          font-size: 23px;
          direction: ltr;
        }

        .brand-name span {
          color: var(--gold);
        }

        .brand-chart {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 3px;
          padding: 7px;
          border-radius: 10px;
          border: 1px solid rgba(231, 185, 79, 0.28);
          background: rgba(231, 185, 79, 0.08);
        }

        .brand-chart i {
          width: 4px;
          border-radius: 4px 4px 1px 1px;
          background: var(--gold);
          animation: bars 2.4s ease-in-out infinite;
        }

        .brand-chart i:nth-child(1) {
          height: 9px;
        }

        .brand-chart i:nth-child(2) {
          height: 17px;
          animation-delay: 0.25s;
        }

        .brand-chart i:nth-child(3) {
          height: 13px;
          animation-delay: 0.5s;
        }

        .brand-chart i:nth-child(4) {
          height: 23px;
          animation-delay: 0.75s;
        }

        .main-nav {
          display: flex;
          align-items: center;
          gap: 28px;
          color: #c5ccd5;
          font-size: 14px;
          font-weight: 700;
        }

        .main-nav a {
          transition: color 0.25s ease;
        }

        .main-nav a:hover {
          color: var(--gold-light);
        }

        .live-link {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .live-dot,
        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--red);
          box-shadow: 0 0 0 0 rgba(255, 101, 119, 0.5);
          animation: pulse 1.8s infinite;
        }

        .account-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .login-button,
        .signup-button {
          padding: 11px 17px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 800;
          transition: 0.25s ease;
        }

        .login-button {
          color: #d4d9df;
          border: 1px solid var(--border);
        }

        .login-button:hover {
          border-color: rgba(231, 185, 79, 0.5);
          color: var(--gold-light);
        }

        .signup-button {
          color: #15120a;
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          box-shadow: 0 8px 25px rgba(231, 185, 79, 0.16);
        }

        .signup-button:hover,
        .primary-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 13px 35px rgba(231, 185, 79, 0.25);
        }

        .market-ticker {
          position: relative;
          z-index: 10;
          height: 45px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.018);
          overflow: hidden;
        }

        .ticker-label {
          height: 100%;
          min-width: 135px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #dce2e8;
          background: #0d131b;
          border-left: 1px solid var(--border);
          font-size: 12px;
          font-weight: 800;
          z-index: 3;
        }

        .ticker-window {
          flex: 1;
          overflow: hidden;
        }

        .ticker-track {
          width: max-content;
          display: flex;
          animation: ticker 28s linear infinite;
        }

        .ticker-item {
          height: 45px;
          min-width: 215px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          direction: ltr;
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 12px;
        }

        .ticker-item strong {
          color: #f1f3f5;
        }

        .ticker-item span {
          color: #aab3be;
        }

        .ticker-item em {
          font-style: normal;
          font-weight: 800;
        }

        .up {
          color: var(--green);
        }

        .down {
          color: var(--red);
        }

        .ticker-note {
          padding: 0 15px;
          color: #6f7a87;
          font-size: 10px;
          white-space: nowrap;
        }

        .hero {
          position: relative;
          z-index: 5;
          width: min(1180px, calc(100% - 40px));
          min-height: 650px;
          margin: auto;
          padding: 90px 0;
          display: grid;
          grid-template-columns: 1fr 0.95fr;
          align-items: center;
          gap: 70px;
        }

        .hero-content {
          animation: fadeUp 0.8s ease both;
        }

        .eyebrow,
        .cta-label {
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          color: var(--gold-light);
          border: 1px solid rgba(231, 185, 79, 0.2);
          border-radius: 50px;
          background: rgba(231, 185, 79, 0.07);
          font-size: 12px;
          font-weight: 800;
        }

        .eyebrow span {
          animation: rotateStar 5s linear infinite;
        }

        .hero h1 {
          max-width: 650px;
          margin: 22px 0;
          font-size: clamp(40px, 5vw, 70px);
          line-height: 1.2;
          letter-spacing: -2px;
        }

        .gold-text {
          display: block;
          color: transparent;
          background: linear-gradient(90deg, var(--gold), #fff0b5, var(--gold));
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          animation: goldMove 4s linear infinite;
        }

        .hero-description {
          max-width: 630px;
          margin: 0;
          color: var(--muted);
          font-size: 17px;
          line-height: 2;
        }

        .hero-buttons,
        .cta-buttons {
          margin-top: 32px;
          display: flex;
          align-items: center;
          gap: 13px;
          flex-wrap: wrap;
        }

        .primary-button,
        .secondary-button {
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 0 24px;
          border-radius: 11px;
          font-size: 14px;
          font-weight: 900;
          transition: 0.25s ease;
        }

        .primary-button {
          color: #17130a;
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          box-shadow: 0 10px 30px rgba(231, 185, 79, 0.17);
        }

        .secondary-button {
          color: #e7ebef;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.025);
        }

        .secondary-button:hover {
          border-color: rgba(231, 185, 79, 0.4);
          background: rgba(231, 185, 79, 0.05);
        }

        .play-icon {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          padding-left: 2px;
          color: var(--gold);
          border-radius: 50%;
          background: rgba(231, 185, 79, 0.11);
          font-size: 10px;
        }

        .hero-points {
          margin-top: 27px;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          color: #8995a2;
          font-size: 12px;
        }

        .hero-points span::first-letter {
          color: var(--green);
        }

        .trading-card {
          position: relative;
          min-width: 0;
          padding: 24px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 22px;
          background: linear-gradient(
            145deg,
            rgba(18, 27, 38, 0.94),
            rgba(9, 14, 20, 0.94)
          );
          box-shadow: 0 30px 100px rgba(0, 0, 0, 0.4);
          animation: cardFloat 5s ease-in-out infinite;
        }

        .trading-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(231, 185, 79, 0.45),
            transparent 35%,
            rgba(37, 201, 151, 0.2)
          );
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
        }

        .card-light {
          position: absolute;
          top: -120px;
          right: -100px;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: rgba(231, 185, 79, 0.12);
          filter: blur(75px);
        }

        .chart-header,
        .price-row,
        .chart-footer {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pair-name {
          display: block;
          direction: ltr;
          font-size: 15px;
          font-weight: 900;
        }

        .chart-header small {
          display: block;
          margin-top: 5px;
          color: #73808d;
          font-size: 11px;
        }

        .market-status {
          display: flex;
          align-items: center;
          gap: 7px;
          color: var(--green);
          font-size: 10px;
          font-weight: 900;
        }

        .market-status span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--green);
          animation: pulseGreen 2s infinite;
        }

        .price-row {
          margin-top: 23px;
          direction: ltr;
          justify-content: flex-start;
          gap: 13px;
        }

        .price-row strong {
          font-size: 30px;
        }

        .price-row span {
          padding: 5px 8px;
          color: var(--green);
          border-radius: 6px;
          background: rgba(37, 201, 151, 0.1);
          font-size: 11px;
          font-weight: 900;
        }

        .chart-area {
          position: relative;
          height: 260px;
          margin: 22px 0;
          overflow: hidden;
        }

        .chart-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.055) 1px, transparent 1px);
          background-size: 100% 52px, 75px 100%;
        }

        .line-chart {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .area-path {
          fill: url(#chartFill);
        }

        .chart-path {
          fill: none;
          stroke: var(--gold);
          stroke-width: 3;
          stroke-linecap: round;
          filter: drop-shadow(0 0 8px rgba(231, 185, 79, 0.55));
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: drawChart 2.8s ease forwards;
        }

        .chart-price {
          position: absolute;
          top: 31px;
          left: 0;
          padding: 5px 8px;
          color: #181309;
          background: var(--gold);
          border-radius: 5px;
          font-size: 10px;
          font-weight: 900;
          direction: ltr;
          animation: priceGlow 2s ease-in-out infinite;
        }

        .candles {
          position: absolute;
          inset: 0;
          opacity: 0.19;
        }

        .candle {
          position: absolute;
          width: 6px;
          border-radius: 2px;
          animation: candleMove 3s ease-in-out infinite alternate;
        }

        .candle::before {
          content: "";
          position: absolute;
          width: 1px;
          height: calc(100% + 18px);
          top: -9px;
          left: 50%;
          background: inherit;
        }

        .candle.green {
          background: var(--green);
        }

        .candle.red {
          background: var(--red);
        }

        .c1 { left: 5%; top: 68%; height: 20px; }
        .c2 { left: 13%; top: 60%; height: 29px; }
        .c3 { left: 21%; top: 54%; height: 21px; }
        .c4 { left: 29%; top: 59%; height: 27px; }
        .c5 { left: 37%; top: 45%; height: 35px; }
        .c6 { left: 45%; top: 39%; height: 24px; }
        .c7 { left: 53%; top: 45%; height: 30px; }
        .c8 { left: 61%; top: 31%; height: 28px; }
        .c9 { left: 69%; top: 26%; height: 33px; }
        .c10 { left: 77%; top: 31%; height: 25px; }
        .c11 { left: 85%; top: 17%; height: 31px; }
        .c12 { left: 93%; top: 10%; height: 24px; }

        .chart-footer {
          color: #66727f;
          font-size: 10px;
          direction: ltr;
        }

        .chart-footer span {
          padding: 6px 9px;
          border-radius: 5px;
        }

        .chart-footer .active {
          color: var(--gold-light);
          background: rgba(231, 185, 79, 0.1);
        }

        .stats-section {
          position: relative;
          z-index: 5;
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto 110px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.018);
        }

        .stat {
          padding: 28px 20px;
          text-align: center;
          border-left: 1px solid var(--border);
        }

        .stat:last-child {
          border-left: 0;
        }

        .stat strong {
          display: block;
          color: var(--gold-light);
          font-size: 28px;
          direction: ltr;
        }

        .stat span {
          display: block;
          margin-top: 8px;
          color: var(--muted);
          font-size: 12px;
        }

        .section {
          position: relative;
          z-index: 5;
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          padding-bottom: 120px;
        }

        .section-heading {
          max-width: 670px;
          margin: 0 auto 45px;
          text-align: center;
        }

        .section-heading > span {
          color: var(--gold);
          font-size: 12px;
          font-weight: 900;
        }

        .section-heading h2 {
          margin: 13px 0;
          font-size: clamp(29px, 4vw, 43px);
        }

        .section-heading p {
          margin: 0;
          color: var(--muted);
          line-height: 1.9;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .feature-card {
          position: relative;
          min-height: 310px;
          padding: 30px;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 17px;
          background: linear-gradient(
            145deg,
            rgba(18, 26, 36, 0.78),
            rgba(11, 16, 23, 0.8)
          );
          transition: 0.35s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          border-color: rgba(231, 185, 79, 0.3);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.22);
        }

        .feature-card::after {
          content: "";
          position: absolute;
          width: 130px;
          height: 130px;
          bottom: -75px;
          left: -55px;
          border-radius: 50%;
          background: rgba(231, 185, 79, 0.07);
          filter: blur(20px);
        }

        .card-number {
          position: absolute;
          top: 22px;
          left: 25px;
          color: rgba(255, 255, 255, 0.05);
          font-size: 42px;
          font-weight: 900;
        }

        .feature-icon {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          margin-bottom: 25px;
          border: 1px solid rgba(231, 185, 79, 0.18);
          border-radius: 12px;
          background: rgba(231, 185, 79, 0.07);
          font-size: 23px;
        }

        .feature-card h3 {
          margin: 0 0 14px;
          font-size: 20px;
        }

        .feature-card p {
          min-height: 78px;
          margin: 0 0 25px;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.9;
        }

        .feature-card a {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--gold-light);
          font-size: 13px;
          font-weight: 900;
        }

        .feature-card a span {
          transition: transform 0.25s ease;
        }

        .feature-card a:hover span {
          transform: translateX(-5px);
        }

        .learning-section {
          position: relative;
          z-index: 5;
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto 120px;
          padding: 60px;
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 65px;
          border: 1px solid var(--border);
          border-radius: 22px;
          background:
            radial-gradient(circle at 10% 20%, rgba(231, 185, 79, 0.08), transparent 25%),
            rgba(255, 255, 255, 0.018);
        }

        .right-heading {
          margin: 0;
          text-align: right;
        }

        .small-button {
          margin-top: 28px;
        }

        .steps-list {
          display: grid;
          gap: 12px;
        }

        .learning-step {
          padding: 19px;
          display: grid;
          grid-template-columns: 53px 1fr;
          gap: 17px;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.025);
          transition: 0.25s ease;
        }

        .learning-step:hover {
          transform: translateX(-7px);
          border-color: rgba(231, 185, 79, 0.22);
        }

        .step-number {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          color: var(--gold);
          border: 1px solid rgba(231, 185, 79, 0.18);
          border-radius: 11px;
          background: rgba(231, 185, 79, 0.06);
          font-size: 12px;
          font-weight: 900;
          direction: ltr;
        }

        .learning-step h3 {
          margin: 0 0 7px;
          font-size: 16px;
        }

        .learning-step p {
          margin: 0;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.7;
        }

        .cta-section {
          position: relative;
          z-index: 5;
          width: min(1180px, calc(100% - 40px));
          min-height: 350px;
          margin: 0 auto 45px;
          padding: 65px;
          display: flex;
          align-items: center;
          overflow: hidden;
          border: 1px solid rgba(231, 185, 79, 0.25);
          border-radius: 22px;
          background:
            linear-gradient(120deg, rgba(231, 185, 79, 0.1), transparent 50%),
            #0c1219;
        }

        .cta-content {
          position: relative;
          z-index: 3;
          max-width: 690px;
        }

        .cta-section h2 {
          margin: 17px 0;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.35;
        }

        .cta-section p {
          color: var(--muted);
          line-height: 1.8;
        }

        .text-button {
          padding: 14px 20px;
          color: #d5dbe1;
          font-size: 13px;
          font-weight: 800;
        }

        .cta-chart {
          position: absolute;
          left: 45px;
          bottom: 0;
          height: 90%;
          width: 33%;
          display: flex;
          align-items: flex-end;
          gap: 14px;
          opacity: 0.12;
          transform: skewX(-8deg);
        }

        .cta-chart span {
          flex: 1;
          border-radius: 8px 8px 0 0;
          background: var(--gold);
          animation: ctaBars 3s ease-in-out infinite alternate;
        }

        .cta-chart span:nth-child(1) { height: 20%; }
        .cta-chart span:nth-child(2) { height: 38%; animation-delay: 0.3s; }
        .cta-chart span:nth-child(3) { height: 31%; animation-delay: 0.6s; }
        .cta-chart span:nth-child(4) { height: 61%; animation-delay: 0.9s; }
        .cta-chart span:nth-child(5) { height: 85%; animation-delay: 1.2s; }

        .risk-warning {
          position: relative;
          z-index: 5;
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto 70px;
          padding: 22px;
          display: flex;
          gap: 16px;
          border: 1px solid rgba(255, 184, 77, 0.16);
          border-radius: 13px;
          background: rgba(255, 184, 77, 0.045);
        }

        .warning-icon {
          min-width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          color: var(--gold);
          border: 1px solid rgba(231, 185, 79, 0.3);
          border-radius: 50%;
          font-weight: 900;
        }

        .risk-warning strong {
          color: #e7cf96;
          font-size: 13px;
        }

        .risk-warning p {
          margin: 8px 0 0;
          color: #8d9299;
          font-size: 11px;
          line-height: 1.8;
        }

        .footer {
          position: relative;
          z-index: 5;
          padding: 50px 20px 25px;
          text-align: center;
          border-top: 1px solid var(--border);
          background: rgba(0, 0, 0, 0.12);
        }

        .footer-brand {
          justify-content: center;
        }

        .footer > p {
          color: var(--muted);
          font-size: 12px;
        }

        .footer-links {
          margin: 25px 0 35px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 25px;
          color: #a6afb9;
          font-size: 12px;
        }

        .footer-links a:hover {
          color: var(--gold);
        }

        .copyright {
          padding-top: 22px;
          color: #56606b;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 10px;
        }

        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(50%); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes cardFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes drawChart {
          to { stroke-dashoffset: 0; }
        }

        @keyframes pulse {
          70% { box-shadow: 0 0 0 8px rgba(255, 101, 119, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 101, 119, 0); }
        }

        @keyframes pulseGreen {
          50% { box-shadow: 0 0 0 7px rgba(37, 201, 151, 0); }
        }

        @keyframes bars {
          50% { transform: scaleY(0.65); opacity: 0.7; }
        }

        @keyframes goldMove {
          to { background-position: 200% center; }
        }

        @keyframes rotateStar {
          to { transform: rotate(360deg); }
        }

        @keyframes candleMove {
          to { transform: translateY(-5px); }
        }

        @keyframes priceGlow {
          50% { box-shadow: 0 0 18px rgba(231, 185, 79, 0.4); }
        }

        @keyframes ctaBars {
          to { transform: scaleY(0.65); }
        }

        @media (max-width: 980px) {
          .header-container {
            padding: 15px 0;
            flex-wrap: wrap;
          }

          .main-nav {
            order: 3;
            width: 100%;
            justify-content: center;
            padding-top: 13px;
            border-top: 1px solid var(--border);
          }

          .hero {
            grid-template-columns: 1fr;
            gap: 55px;
            padding-top: 65px;
          }

          .hero-content {
            text-align: center;
          }

          .hero-description,
          .eyebrow {
            margin-left: auto;
            margin-right: auto;
          }

          .hero-buttons,
          .hero-points {
            justify-content: center;
          }

          .trading-card {
            width: min(650px, 100%);
            margin: auto;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .feature-card {
            min-height: auto;
          }

          .feature-card p {
            min-height: auto;
          }

          .learning-section {
            grid-template-columns: 1fr;
            padding: 40px;
          }
        }

        @media (max-width: 680px) {
          .header-container,
          .hero,
          .section,
          .stats-section,
          .learning-section,
          .cta-section,
          .risk-warning {
            width: min(100% - 24px, 1180px);
          }

          .header-container {
            justify-content: center;
          }

          .brand {
            margin-left: auto;
          }

          .account-actions {
            gap: 6px;
          }

          .login-button,
          .signup-button {
            padding: 9px 10px;
            font-size: 10px;
          }

          .main-nav {
            gap: 16px;
            overflow-x: auto;
            justify-content: flex-start;
            font-size: 11px;
          }

          .main-nav a {
            white-space: nowrap;
          }

          .ticker-label {
            min-width: 105px;
          }

          .ticker-note {
            display: none;
          }

          .hero {
            min-height: auto;
            padding: 55px 0 70px;
          }

          .hero h1 {
            font-size: 39px;
            letter-spacing: -1px;
          }

          .hero-description {
            font-size: 14px;
          }

          .hero-buttons {
            flex-direction: column;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
          }

          .trading-card {
            padding: 17px;
          }

          .chart-area {
            height: 210px;
          }

          .stats-section {
            grid-template-columns: repeat(2, 1fr);
            margin-bottom: 80px;
          }

          .stat {
            border-bottom: 1px solid var(--border);
          }

          .section {
            padding-bottom: 85px;
          }

          .feature-card {
            padding: 25px;
          }

          .learning-section {
            margin-bottom: 85px;
            padding: 27px 18px;
            gap: 40px;
          }

          .learning-step {
            grid-template-columns: 45px 1fr;
            padding: 15px;
          }

          .step-number {
            width: 42px;
            height: 42px;
          }

          .cta-section {
            min-height: auto;
            padding: 40px 22px;
            text-align: center;
          }

          .cta-label {
            margin: auto;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .cta-chart {
            width: 80%;
            opacity: 0.05;
          }

          .risk-warning {
            align-items: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}
