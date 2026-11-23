"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const features = [
  {
    number: "01",
    icon: "🎓",
    title: "أكاديمية التداول",
    description:
      "تعلّم أساسيات الفوركس والتحليل الفني وإدارة المخاطر من خلال محتوى عربي منظم ومناسب للمبتدئين.",
    link: "/academy",
    linkText: "ابدأ التعلّم",
  },
  {
    number: "02",
    icon: "📡",
    title: "البث المباشر",
    description:
      "تابع جلسات السوق والتحليلات المباشرة، وشاهد أهم التحركات والفرص أثناء ساعات التداول.",
    link: "/live",
    linkText: "مشاهدة البث",
  },
  {
    number: "03",
    icon: "📊",
    title: "تحليل الأسواق",
    description:
      "طوّر قدرتك على قراءة الرسوم البيانية وفهم الاتجاهات ومستويات الدعم والمقاومة بصورة عملية.",
    link: "/academy",
    linkText: "استكشف المحتوى",
  },
];

const learningSteps = [
  {
    number: "01",
    title: "ابدأ من الأساسيات",
    description: "تعرّف على سوق الفوركس والمصطلحات الأساسية وطريقة تحرك الأسعار.",
  },
  {
    number: "02",
    title: "تعلّم قراءة الشارت",
    description: "افهم الاتجاهات والشموع اليابانية ومستويات الدعم والمقاومة.",
  },
  {
    number: "03",
    title: "طبّق إدارة المخاطر",
    description: "تعلّم حماية رأس المال وتحديد حجم الصفقة ووقف الخسارة.",
  },
  {
    number: "04",
    title: "طوّر خطتك",
    description: "أنشئ خطة تداول واضحة وسجّل نتائجك وطوّر أداءك باستمرار.",
  },
];

function HomeLiveTicker() {
  const tickerRef = useRef(null);

  useEffect(() => {
    const container = tickerRef.current;

    if (!container) {
      return undefined;
    }

    container.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    container.appendChild(widgetContainer);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbols: [
        {
          proName: "OANDA:XAUUSD",
          title: "Gold / USD",
        },
        {
          proName: "OANDA:XAGUSD",
          title: "Silver / USD",
        },
        {
          proName: "OANDA:EURUSD",
          title: "EUR / USD",
        },
        {
          proName: "OANDA:GBPUSD",
          title: "GBP / USD",
        },
        {
          proName: "OANDA:USDJPY",
          title: "USD / JPY",
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

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="ticker-window">
      <div
        ref={tickerRef}
        className="tradingview-widget-container ticker-widget"
      >
        <div className="ticker-loading">جارٍ تحميل أسعار الأسواق...</div>
      </div>
    </div>
  );
}

function HomeMarketsCard() {
  const marketsRef = useRef(null);

  useEffect(() => {
    const container = marketsRef.current;

    if (!container) {
      return undefined;
    }

    container.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    container.appendChild(widgetContainer);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "1D",
      showChart: true,
      locale: "en",
      largeChartUrl: "",
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      width: "100%",
      height: "100%",
      plotLineColorGrowing: "rgba(37, 201, 151, 1)",
      plotLineColorFalling: "rgba(255, 101, 119, 1)",
      gridLineColor: "rgba(255, 255, 255, 0.06)",
      scaleFontColor: "rgba(155, 167, 181, 1)",
      belowLineFillColorGrowing: "rgba(37, 201, 151, 0.10)",
      belowLineFillColorFalling: "rgba(255, 101, 119, 0.10)",
      belowLineFillColorGrowingBottom: "rgba(37, 201, 151, 0)",
      belowLineFillColorFallingBottom: "rgba(255, 101, 119, 0)",
      symbolActiveColor: "rgba(231, 185, 79, 0.12)",
      tabs: [
        {
          title: "Metals",
          symbols: [
            {
              s: "OANDA:XAUUSD",
              d: "Gold / USD",
            },
            {
              s: "OANDA:XAGUSD",
              d: "Silver / USD",
            },
            {
              s: "TVC:GOLD",
              d: "Gold",
            },
            {
              s: "TVC:SILVER",
              d: "Silver",
            },
          ],
          originalTitle: "Metals",
        },
        {
          title: "Forex",
          symbols: [
            {
              s: "OANDA:EURUSD",
              d: "EUR / USD",
            },
            {
              s: "OANDA:GBPUSD",
              d: "GBP / USD",
            },
            {
              s: "OANDA:USDJPY",
              d: "USD / JPY",
            },
            {
              s: "OANDA:AUDUSD",
              d: "AUD / USD",
            },
          ],
          originalTitle: "Forex",
        },
        {
          title: "Crypto",
          symbols: [
            {
              s: "BINANCE:BTCUSDT",
              d: "Bitcoin",
            },
            {
              s: "BINANCE:ETHUSDT",
              d: "Ethereum",
            },
            {
              s: "BINANCE:BNBUSDT",
              d: "BNB",
            },
            {
              s: "BINANCE:SOLUSDT",
              d: "Solana",
            },
          ],
          originalTitle: "Crypto",
        },
        {
          title: "Indices",
          symbols: [
            {
              s: "FOREXCOM:SPXUSD",
              d: "S&P 500",
            },
            {
              s: "FOREXCOM:NSXUSD",
              d: "Nasdaq 100",
            },
            {
              s: "FOREXCOM:DJI",
              d: "Dow Jones",
            },
            {
              s: "CAPITALCOM:DE40",
              d: "Germany 40",
            },
          ],
          originalTitle: "Indices",
        },
      ],
    });

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="trading-card">
      <div className="market-card-header">
        <div>
          <span className="live-market-label">
            <span className="live-market-dot" />
            متابعة الأسواق
          </span>

          <h2>حركة الأسواق العالمية</h2>

          <p>
            تابع الذهب والعملات والعملات الرقمية والمؤشرات من بطاقة واحدة.
          </p>
        </div>

        <div className="market-status">
          <span />
          بيانات السوق
        </div>
      </div>

      <div className="market-widget-frame">
        <div
          ref={marketsRef}
          className="tradingview-widget-container markets-widget"
        >
          <div className="markets-loading">
            <span className="loading-mark">F4</span>
            <strong>جارٍ تحميل بيانات الأسواق...</strong>
            <small>قد يستغرق تحميل الأسعار بضع ثوانٍ</small>
          </div>
        </div>
      </div>

      <div className="market-card-footer">
        <span>البيانات مقدمة بواسطة TradingView</span>
        <span>قد تتأخر الأسعار حسب السوق ومصدر البيانات</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="home-page">
      <div className="background-grid" />
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <header className="main-header">
        <div className="header-container">
          <Link href="/" className="brand" aria-label="Forex4Ever الرئيسية">
            <span className="brand-mark">F4</span>

            <span className="brand-text">
              <strong>Forex4Ever</strong>
              <small>Trading Academy</small>
            </span>
          </Link>

          <nav className="main-nav" aria-label="التنقل الرئيسي">
            <Link href="/">الرئيسية</Link>
            <Link href="/academy">الأكاديمية</Link>
            <Link href="/live">البث المباشر</Link>
          </nav>

          <div className="account-actions">
            <Link href="/login" className="login-button">
              تسجيل الدخول
            </Link>

            <Link href="/signup" className="signup-button">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </header>

      <section className="market-ticker" aria-label="شريط أسعار الأسواق">
        <div className="ticker-label">
          <span className="ticker-live-dot" />

          <span>
            <strong>الأسواق</strong>
            <small className="ticker-note">متابعة مباشرة</small>
          </span>
        </div>

        <HomeLiveTicker />
      </section>

      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            تعلّم، تابع، وطوّر قراراتك
          </div>

          <h1>
            طريقك لفهم
            <span> الأسواق المالية</span>
            يبدأ من هنا
          </h1>

          <p className="hero-description">
            منصة عربية تساعدك على تعلّم التداول ومتابعة تحركات الأسواق
            والتحليلات، من خلال محتوى واضح وتجربة بسيطة تناسب جميع الأجهزة.
          </p>

          <div className="hero-buttons">
            <Link href="/signup" className="primary-button">
              ابدأ مجانًا
              <span>←</span>
            </Link>

            <Link href="/academy" className="secondary-button">
              <span className="play-icon">▶</span>
              استكشف الأكاديمية
            </Link>
          </div>

          <div className="hero-points">
            <span>
              <i>✓</i>
              محتوى عربي
            </span>

            <span>
              <i>✓</i>
              تسجيل مجاني
            </span>

            <span>
              <i>✓</i>
              متوافق مع الهاتف
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <HomeMarketsCard />
        </div>
      </section>

      <section className="stats-section" aria-label="مميزات المنصة">
        <div className="stat">
          <strong>مجاني</strong>
          <span>إنشاء الحساب</span>
        </div>

        <div className="stat">
          <strong>عربي</strong>
          <span>المحتوى التعليمي</span>
        </div>

        <div className="stat">
          <strong>متعدد</strong>
          <span>الأسواق المتاحة</span>
        </div>

        <div className="stat">
          <strong>24/7</strong>
          <span>الوصول إلى الأكاديمية</span>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span>ماذا نقدم؟</span>
          <h2>كل ما تحتاجه لتطوير معرفتك</h2>
          <p>
            أدوات تعليمية ومتابعة للأسواق تساعدك على بناء أساس واضح قبل اتخاذ
            قرارات التداول.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="card-number">{feature.number}</span>
              <div className="feature-icon">{feature.icon}</div>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>

              <Link href={feature.link}>
                {feature.linkText}
                <span>←</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="learning-section">
        <div className="section-heading right-heading">
          <span>خطوات واضحة</span>
          <h2>تعلّم التداول خطوة بخطوة</h2>

          <p>
            لا تحتاج إلى خبرة سابقة. ابدأ بالمفاهيم الأساسية، ثم انتقل تدريجيًا
            إلى التحليل وإدارة المخاطر وبناء خطة التداول.
          </p>

          <Link href="/academy" className="primary-button small-button">
            الدخول إلى الأكاديمية
            <span>←</span>
          </Link>
        </div>

        <div className="steps-list">
          {learningSteps.map((step) => (
            <article className="learning-step" key={step.number}>
              <span className="step-number">{step.number}</span>

              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <span className="cta-label">ابدأ الآن</span>

          <h2>أنشئ حسابك وابدأ رحلتك التعليمية مجانًا</h2>

          <p>
            سجّل بالبريد الإلكتروني وكلمة المرور للوصول إلى صفحات المنصة
            ومتابعة المحتوى والبث المباشر.
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

        <div className="cta-chart" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="risk-warning">
        <span className="warning-icon">!</span>

        <div>
          <strong>تنبيه مخاطر مهم</strong>

          <p>
            التداول في الأسواق المالية ينطوي على درجة مرتفعة من المخاطر، وقد
            يؤدي إلى خسارة جزء من رأس المال أو كله. المحتوى الموجود في المنصة
            تعليمي فقط ولا يُعد نصيحة أو توصية استثمارية.
          </p>
        </div>
      </section>

      <footer className="footer">
        <Link href="/" className="brand footer-brand">
          <span className="brand-mark">F4</span>

          <span className="brand-text">
            <strong>Forex4Ever</strong>
            <small>Trading Academy</small>
          </span>
        </Link>

        <p>منصة عربية لتعلّم التداول ومتابعة الأسواق المالية.</p>

        <div className="footer-links">
          <Link href="/">الرئيسية</Link>
          <Link href="/academy">الأكاديمية</Link>
          <Link href="/live">البث المباشر</Link>
          <Link href="/login">تسجيل الدخول</Link>
        </div>

        <div className="copyright">
          © {new Date().getFullYear()} Forex4Ever. جميع الحقوق محفوظة.
        </div>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          background: #070b10;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        .home-page {
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

          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(
              circle at 85% 5%,
              rgba(231, 185, 79, 0.07),
              transparent 24%
            ),
            linear-gradient(180deg, #070b10 0%, #090e14 48%, #070b10 100%);
          direction: rtl;
          font-family:
            Arial, "Segoe UI", Tahoma, sans-serif;
        }

        .background-grid {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.2;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px
            );
          background-size: 45px 45px;
          mask-image: linear-gradient(to bottom, black, transparent 80%);
        }

        .background-glow {
          position: absolute;
          z-index: 0;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(145px);
          pointer-events: none;
          opacity: 0.08;
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
          z-index: 20;
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
          flex-shrink: 0;
        }

        .brand-mark {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          color: #0a0d11;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          box-shadow: 0 10px 30px rgba(231, 185, 79, 0.18);
          font-size: 14px;
          font-weight: 950;
          direction: ltr;
        }

        .brand-text {
          display: grid;
          gap: 2px;
        }

        .brand-text strong {
          font-size: 17px;
          letter-spacing: 0.1px;
          direction: ltr;
        }

        .brand-text small {
          color: var(--muted);
          font-size: 8px;
          letter-spacing: 1px;
          text-transform: uppercase;
          direction: ltr;
        }

        .main-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 31px;
          color: #bcc5ce;
          font-size: 13px;
          font-weight: 700;
        }

        .main-nav a {
          transition: color 0.25s ease;
        }

        .main-nav a:hover {
          color: var(--gold-light);
        }

        .account-actions {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;
        }

        .login-button,
        .signup-button {
          padding: 10px 14px;
          border-radius: 9px;
          font-size: 11px;
          font-weight: 850;
          transition: 0.25s ease;
        }

        .login-button {
          color: #d5dbe1;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.025);
        }

        .login-button:hover {
          border-color: rgba(231, 185, 79, 0.3);
          color: var(--gold-light);
        }

        .signup-button {
          color: #111;
          border: 1px solid var(--gold);
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
        }

        .signup-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(231, 185, 79, 0.2);
        }

        .market-ticker {
          position: relative;
          z-index: 15;
          height: 48px;
          display: flex;
          align-items: center;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
          background: rgba(9, 14, 20, 0.94);
          direction: ltr;
        }

        .ticker-label {
          position: relative;
          z-index: 5;
          min-width: 135px;
          height: 48px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          color: var(--text);
          border-right: 1px solid var(--border);
          background: #0d131b;
          direction: rtl;
        }

        .ticker-label > span:last-child {
          display: grid;
          gap: 2px;
        }

        .ticker-label strong {
          font-size: 11px;
        }

        .ticker-note {
          color: var(--muted);
          font-size: 8px;
        }

        .ticker-live-dot {
          width: 7px;
          height: 7px;
          flex: 0 0 7px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 0 0 rgba(37, 201, 151, 0.45);
          animation: pulseGreen 2s infinite;
        }

        .ticker-window {
          flex: 1;
          min-width: 0;
          height: 48px;
          overflow: hidden;
          direction: ltr;
        }

        .ticker-widget {
          width: 100%;
          height: 48px;
          overflow: hidden;
        }

        .ticker-widget :global(.tradingview-widget-container__widget) {
          width: 100%;
          height: 48px;
        }

        .ticker-widget :global(iframe) {
          display: block;
          width: 100% !important;
          height: 48px !important;
          border: 0 !important;
        }

        .ticker-loading {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          font-size: 10px;
          direction: rtl;
        }

        .hero {
          position: relative;
          z-index: 5;
          width: min(1180px, calc(100% - 40px));
          min-height: 650px;
          margin: auto;
          padding: 75px 0 90px;
          display: grid;
          grid-template-columns: 1fr 0.95fr;
          gap: 70px;
          align-items: center;
        }

        .hero-content {
          animation: fadeUp 0.8s ease both;
        }

        .eyebrow {
          width: fit-content;
          margin-bottom: 20px;
          padding: 9px 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #d8c795;
          border: 1px solid rgba(231, 185, 79, 0.18);
          border-radius: 100px;
          background: rgba(231, 185, 79, 0.055);
          font-size: 10px;
          font-weight: 850;
        }

        .eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 13px rgba(231, 185, 79, 0.7);
        }

        .hero h1 {
          max-width: 650px;
          margin: 0;
          font-size: clamp(42px, 5.4vw, 69px);
          line-height: 1.16;
          letter-spacing: -2px;
        }

        .hero h1 span {
          display: block;
          color: transparent;
          background: linear-gradient(
            90deg,
            var(--gold),
            var(--gold-light),
            #c68c27,
            var(--gold)
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          animation: goldMove 5s linear infinite;
        }

        .hero-description {
          max-width: 600px;
          margin: 25px 0 0;
          color: var(--muted);
          font-size: 16px;
          line-height: 2;
        }

        .hero-buttons,
        .cta-buttons {
          margin-top: 30px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .primary-button,
        .secondary-button {
          min-height: 49px;
          padding: 0 21px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          border-radius: 11px;
          font-size: 12px;
          font-weight: 900;
          transition: 0.25s ease;
        }

        .primary-button {
          color: #111;
          border: 1px solid var(--gold);
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          box-shadow: 0 13px 35px rgba(231, 185, 79, 0.14);
        }

        .primary-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(231, 185, 79, 0.24);
        }

        .secondary-button {
          color: #e8ecf0;
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
          color: var(--gold);
          border: 1px solid rgba(231, 185, 79, 0.22);
          border-radius: 50%;
          font-size: 8px;
        }

        .hero-points {
          margin-top: 27px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          color: #909ba7;
          font-size: 10px;
        }

        .hero-points span {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .hero-points i {
          width: 17px;
          height: 17px;
          display: grid;
          place-items: center;
          color: var(--green);
          border: 1px solid rgba(37, 201, 151, 0.2);
          border-radius: 50%;
          font-size: 9px;
          font-style: normal;
        }

        .hero-visual {
          min-width: 0;
          animation: fadeUp 0.9s 0.12s ease both;
        }

        .trading-card {
          position: relative;
          width: 100%;
          padding: 24px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 22px;
          background:
            radial-gradient(
              circle at 80% 0%,
              rgba(231, 185, 79, 0.08),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              rgba(17, 25, 35, 0.96),
              rgba(9, 14, 20, 0.98)
            );
          box-shadow: 0 30px 100px rgba(0, 0, 0, 0.4);
          animation: cardFloat 5s ease-in-out infinite;
        }

        .market-card-header {
          min-height: 88px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .live-market-label {
          display: flex;
          align-items: center;
          gap: 7px;
          color: var(--gold-light);
          font-size: 9px;
          font-weight: 900;
        }

        .live-market-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--green);
          animation: pulseGreen 2s infinite;
        }

        .market-card-header h2 {
          margin: 9px 0 5px;
          font-size: 20px;
        }

        .market-card-header p {
          margin: 0;
          color: var(--muted);
          font-size: 10px;
          line-height: 1.6;
        }

        .market-status {
          padding: 8px 10px;
          display: flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap;
          color: #9da8b3;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.025);
          font-size: 8px;
        }

        .market-status span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green);
        }

        .market-widget-frame {
          height: 520px;
          margin-top: 14px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          background: rgba(5, 8, 12, 0.55);
          direction: ltr;
        }

        .markets-widget {
          width: 100%;
          height: 100%;
        }

        .markets-widget :global(.tradingview-widget-container__widget) {
          width: 100%;
          height: 100%;
        }

        .markets-widget :global(iframe) {
          display: block;
          width: 100% !important;
          height: 100% !important;
          border: 0 !important;
        }

        .markets-loading {
          height: 100%;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 9px;
          color: var(--muted);
          text-align: center;
          direction: rtl;
        }

        .markets-loading strong {
          color: #d8dee5;
          font-size: 12px;
        }

        .markets-loading small {
          font-size: 9px;
        }

        .loading-mark {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          margin-bottom: 5px;
          color: #111;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          font-size: 12px;
          font-weight: 950;
          direction: ltr;
        }

        .market-card-footer {
          padding-top: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          color: #687481;
          font-size: 8px;
          direction: rtl;
        }

        .stats-section {
          position: relative;
          z-index: 5;
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto 120px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.018);
        }

        .stat {
          min-height: 120px;
          padding: 25px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-align: center;
          border-left: 1px solid var(--border);
        }

        .stat:last-child {
          border-left: 0;
        }

        .stat strong {
          color: var(--gold-light);
          font-size: 24px;
        }

        .stat span {
          color: var(--muted);
          font-size: 10px;
        }

        .section {
          position: relative;
          z-index: 5;
          width: min(1180px, calc(100% - 40px));
          margin: auto;
          padding-bottom: 120px;
        }

        .section-heading {
          max-width: 650px;
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
            radial-gradient(
              circle at 10% 20%,
              rgba(231, 185, 79, 0.08),
              transparent 25%
            ),
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
            linear-gradient(
              120deg,
              rgba(231, 185, 79, 0.1),
              transparent 50%
            ),
            #0c1219;
        }

        .cta-content {
          position: relative;
          z-index: 3;
          max-width: 690px;
        }

        .cta-label {
          width: fit-content;
          padding: 7px 11px;
          display: block;
          color: var(--gold-light);
          border: 1px solid rgba(231, 185, 79, 0.2);
          border-radius: 100px;
          background: rgba(231, 185, 79, 0.06);
          font-size: 9px;
          font-weight: 900;
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

        .text-button:hover {
          color: var(--gold-light);
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

        .cta-chart span:nth-child(1) {
          height: 20%;
        }

        .cta-chart span:nth-child(2) {
          height: 38%;
          animation-delay: 0.3s;
        }

        .cta-chart span:nth-child(3) {
          height: 31%;
          animation-delay: 0.6s;
        }

        .cta-chart span:nth-child(4) {
          height: 61%;
          animation-delay: 0.9s;
        }

        .cta-chart span:nth-child(5) {
          height: 85%;
          animation-delay: 1.2s;
        }

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

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulseGreen {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 201, 151, 0.38);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(37, 201, 151, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 201, 151, 0);
          }
        }

        @keyframes goldMove {
          to {
            background-position: 200% center;
          }
        }

        @keyframes ctaBars {
          to {
            transform: scaleY(0.65);
          }
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
            width: min(700px, 100%);
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
            padding: 0 9px;
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
            padding: 15px;
            animation: none;
          }

          .market-card-header {
            min-height: auto;
          }

          .market-card-header h2 {
            font-size: 17px;
          }

          .market-card-header p {
            max-width: 230px;
          }

          .market-status {
            display: none;
          }

          .market-widget-frame {
            height: 500px;
          }

          .market-card-footer {
            align-items: flex-start;
            flex-direction: column;
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

        @media (max-width: 390px) {
          .brand-text {
            display: none;
          }

          .hero h1 {
            font-size: 34px;
          }

          .market-widget-frame {
            height: 470px;
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
