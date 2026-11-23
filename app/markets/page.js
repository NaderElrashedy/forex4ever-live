"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

function TradingViewWidget({
  script,
  config,
  className = "",
  minHeight = 500,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";

    const copyright = document.createElement("div");
    copyright.className = "tradingview-widget-copyright";
    copyright.innerHTML = `
      <a
        href="https://www.tradingview.com/"
        rel="noopener noreferrer nofollow"
        target="_blank"
      >
        بيانات السوق بواسطة TradingView
      </a>
    `;

    const widgetScript = document.createElement("script");
    widgetScript.type = "text/javascript";
    widgetScript.src = script;
    widgetScript.async = true;
    widgetScript.innerHTML = JSON.stringify(config);

    widgetContainer.appendChild(widget);
    widgetContainer.appendChild(copyright);
    widgetContainer.appendChild(widgetScript);
    container.appendChild(widgetContainer);

    return () => {
      container.innerHTML = "";
    };
  }, [script, JSON.stringify(config)]);

  return (
    <div
      ref={containerRef}
      className={`widget-host ${className}`}
      style={{ minHeight }}
    />
  );
}

const tickerConfig = {
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
};

const goldChartConfig = {
  autosize: true,
  symbol: "OANDA:XAUUSD",
  interval: "15",
  timezone: "Etc/UTC",
  theme: "dark",
  style: "1",
  locale: "en",
  backgroundColor: "rgba(8, 13, 19, 1)",
  gridColor: "rgba(255, 255, 255, 0.06)",
  hideTopToolbar: false,
  hideLegend: false,
  saveImage: true,
  calendar: false,
  hideVolume: true,
  supportHost: "https://www.tradingview.com",
  allowSymbolChange: true,
  details: true,
  hotlist: false,
  withdateranges: true,
};

const marketsConfig = {
  colorTheme: "dark",
  dateRange: "1D",
  showChart: true,
  locale: "en",
  width: "100%",
  height: "100%",
  largeChartUrl: "",
  isTransparent: true,
  showSymbolLogo: true,
  showFloatingTooltip: true,
  plotLineColorGrowing: "rgba(37, 201, 151, 1)",
  plotLineColorFalling: "rgba(255, 101, 119, 1)",
  gridLineColor: "rgba(255, 255, 255, 0.05)",
  scaleFontColor: "rgba(155, 167, 181, 1)",
  belowLineFillColorGrowing: "rgba(37, 201, 151, 0.12)",
  belowLineFillColorFalling: "rgba(255, 101, 119, 0.12)",
  belowLineFillColorGrowingBottom: "rgba(37, 201, 151, 0)",
  belowLineFillColorFallingBottom: "rgba(255, 101, 119, 0)",
  symbolActiveColor: "rgba(231, 185, 79, 0.12)",

  tabs: [
    {
      title: "العملات الرقمية",
      symbols: [
        {
          s: "BINANCE:BTCUSDT",
          d: "Bitcoin / USDT",
        },
        {
          s: "BINANCE:ETHUSDT",
          d: "Ethereum / USDT",
        },
        {
          s: "BINANCE:BNBUSDT",
          d: "BNB / USDT",
        },
        {
          s: "BINANCE:SOLUSDT",
          d: "Solana / USDT",
        },
        {
          s: "BINANCE:XRPUSDT",
          d: "XRP / USDT",
        },
        {
          s: "BINANCE:ADAUSDT",
          d: "Cardano / USDT",
        },
        {
          s: "BINANCE:DOGEUSDT",
          d: "Dogecoin / USDT",
        },
        {
          s: "BINANCE:AVAXUSDT",
          d: "Avalanche / USDT",
        },
      ],
    },
    {
      title: "المعادن",
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
          d: "Gold Futures",
        },
        {
          s: "TVC:SILVER",
          d: "Silver Futures",
        },
        {
          s: "NYMEX:PL1!",
          d: "Platinum Futures",
        },
        {
          s: "COMEX:HG1!",
          d: "Copper Futures",
        },
      ],
    },
    {
      title: "العملات",
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
          s: "OANDA:USDCHF",
          d: "USD / CHF",
        },
        {
          s: "OANDA:AUDUSD",
          d: "AUD / USD",
        },
        {
          s: "OANDA:USDCAD",
          d: "USD / CAD",
        },
        {
          s: "OANDA:NZDUSD",
          d: "NZD / USD",
        },
        {
          s: "OANDA:EURGBP",
          d: "EUR / GBP",
        },
      ],
    },
    {
      title: "البورصات",
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
        {
          s: "CAPITALCOM:UK100",
          d: "UK 100",
        },
        {
          s: "TVC:NI225",
          d: "Nikkei 225",
        },
      ],
    },
  ],
};

const marketCards = [
  {
    icon: "🟡",
    title: "الذهب والمعادن",
    description:
      "تابع حركة الذهب والفضة والنحاس والبلاتين من مصادر بيانات متعددة.",
  },
  {
    icon: "₿",
    title: "العملات الرقمية",
    description:
      "تابع Bitcoin وEthereum وأشهر العملات الرقمية مقابل USDT.",
  },
  {
    icon: "💱",
    title: "سوق العملات",
    description:
      "راقب أزواج العملات الرئيسية مثل EUR/USD وGBP/USD وUSD/JPY.",
  },
  {
    icon: "📊",
    title: "البورصات العالمية",
    description:
      "تابع أهم المؤشرات العالمية مثل S&P 500 وNasdaq وDow Jones.",
  },
];

export default function MarketsPage() {
  return (
    <main className="markets-page">
      <div className="markets-grid-background" aria-hidden="true" />
      <div className="markets-glow gold-glow" aria-hidden="true" />
      <div className="markets-glow blue-glow" aria-hidden="true" />

      {/* عنوان الصفحة */}
      <section className="markets-hero">
        <div className="markets-breadcrumb">
          <Link href="/">الرئيسية</Link>
          <span>/</span>
          <strong>الأسواق</strong>
        </div>

        <div className="hero-label">
          <i />
          متابعة الأسواق المالية
        </div>

        <h1>
          شارت الذهب وأسعار
          <span> الأسواق العالمية</span>
        </h1>

        <p>
          تابع حركة الذهب والعملات الرقمية والمعادن وأزواج العملات ومؤشرات
          البورصات العالمية من خلال أدوات TradingView.
        </p>

        <div className="market-status-row">
          <div className="market-status">
            <span className="status-dot" />
            البيانات تتحدث تلقائيًا
          </div>

          <div className="market-time">
            المصدر: TradingView ومزودو البيانات المتاحون
          </div>
        </div>
      </section>

      {/* شريط الأسعار */}
      <section className="ticker-section">
        <TradingViewWidget
          script="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
          config={tickerConfig}
          minHeight={74}
        />
      </section>

      {/* شارت الذهب */}
      <section className="markets-container">
        <div className="section-title">
          <div>
            <span className="small-title">GOLD MARKET</span>
            <h2>شارت الذهب مقابل الدولار</h2>
            <p>
              يمكنك تغيير الإطار الزمني وإضافة المؤشرات الفنية وتغيير الرمز
              من داخل الشارت.
            </p>
          </div>

          <div className="gold-symbol">
            <span className="gold-icon">Au</span>

            <div>
              <strong>XAU/USD</strong>
              <small>الذهب مقابل الدولار</small>
            </div>
          </div>
        </div>

        <div className="gold-chart-card">
          <div className="chart-top-line">
            <div className="chart-live">
              <span />
              LIVE MARKET
            </div>

            <p>اختر الإطار الزمني المناسب من شريط أدوات الشارت</p>
          </div>

          <TradingViewWidget
            script="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
            config={goldChartConfig}
            className="gold-widget"
            minHeight={650}
          />
        </div>
      </section>

      {/* معلومات أنواع الأسواق */}
      <section className="markets-container cards-section">
        <div className="section-title center-title">
          <div>
            <span className="small-title">GLOBAL MARKETS</span>
            <h2>راقب أهم الأسواق في مكان واحد</h2>
            <p>
              استخدم الأقسام التالية للتنقل بين العملات الرقمية والمعادن
              والفوركس ومؤشرات البورصات.
            </p>
          </div>
        </div>

        <div className="market-cards">
          {marketCards.map((item, index) => (
            <article className="market-card" key={item.title}>
              <div className="card-index">0{index + 1}</div>
              <div className="market-card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* جدول جميع الأسواق */}
      <section className="markets-container overview-section">
        <div className="section-title">
          <div>
            <span className="small-title">MARKET OVERVIEW</span>
            <h2>نظرة عامة على الأسواق</h2>
            <p>
              اختر القسم المطلوب من التبويبات لمتابعة السعر ونسبة التغير
              والرسم البياني المصغر.
            </p>
          </div>

          <div className="auto-update">
            <span>↻</span>
            تحديث تلقائي
          </div>
        </div>

        <div className="overview-card">
          <TradingViewWidget
            script="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
            config={marketsConfig}
            className="overview-widget"
            minHeight={720}
          />
        </div>
      </section>

      {/* إرشادات */}
      <section className="markets-container guide-section">
        <div className="guide-content">
          <span className="small-title">قبل استخدام البيانات</span>
          <h2>كيف تستفيد من صفحة الأسواق؟</h2>

          <p>
            استخدم الأسعار والشارتات للتعلم والتحليل، ولا تعتمد على حركة السعر
            وحدها لاتخاذ قرار مالي.
          </p>

          <Link href="/academy" className="academy-button">
            تعلّم التحليل في الأكاديمية
            <span>←</span>
          </Link>
        </div>

        <div className="guide-points">
          <div className="guide-point">
            <span>01</span>
            <div>
              <strong>حدّد الاتجاه</strong>
              <p>راقب الاتجاه العام على إطار زمني كبير قبل تحليل التفاصيل.</p>
            </div>
          </div>

          <div className="guide-point">
            <span>02</span>
            <div>
              <strong>راقب مناطق السعر</strong>
              <p>حدّد الدعم والمقاومة بدل اتخاذ القرار بناءً على شمعة واحدة.</p>
            </div>
          </div>

          <div className="guide-point">
            <span>03</span>
            <div>
              <strong>أدر المخاطر</strong>
              <p>حدّد وقف الخسارة وحجم المخاطرة قبل أي صفقة تجريبية.</p>
            </div>
          </div>
        </div>
      </section>

      {/* تحذير البيانات والمخاطر */}
      <section className="markets-container disclaimer">
        <div className="warning-mark">!</div>

        <div>
          <strong>تنبيه البيانات ومخاطر التداول</strong>

          <p>
            الأسعار والرسوم البيانية مقدمة من TradingView ومزودي البيانات
            المرتبطين بها. قد تكون بعض بيانات البورصات والمؤشرات متأخرة حسب
            السوق ومصدر البيانات. المحتوى للأغراض التعليمية فقط ولا يمثل
            توصية بالشراء أو البيع. التداول ينطوي على مخاطر وقد يؤدي إلى خسارة
            رأس المال.
          </p>
        </div>
      </section>

      <style jsx global>{`
        :root {
          --markets-bg: #070b10;
          --markets-card: #0d141d;
          --markets-card-light: #111a25;
          --markets-border: rgba(255, 255, 255, 0.09);
          --markets-gold: #e7b94f;
          --markets-gold-light: #ffdc7b;
          --markets-text: #f5f7f9;
          --markets-muted: #98a4b2;
          --markets-green: #25c997;
          --markets-red: #ff6577;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--markets-bg);
          color: var(--markets-text);
          font-family: Tahoma, Arial, sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .markets-page {
          position: relative;
          min-height: 100vh;
          padding-bottom: 80px;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 80% 8%,
              rgba(231, 185, 79, 0.08),
              transparent 28%
            ),
            linear-gradient(180deg, #070b10, #090e14 55%, #070b10);
        }

        .markets-grid-background {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.12;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
          background-size: 55px 55px;
          mask-image: linear-gradient(to bottom, black, transparent 70%);
        }

        .markets-glow {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.1;
          pointer-events: none;
        }

        .gold-glow {
          top: 220px;
          right: -200px;
          background: var(--markets-gold);
        }

        .blue-glow {
          top: 1200px;
          left: -230px;
          background: #177cff;
        }

        .markets-hero,
        .markets-container {
          position: relative;
          z-index: 2;
          width: min(1180px, calc(100% - 40px));
          margin-left: auto;
          margin-right: auto;
        }

        .markets-hero {
          padding: 75px 0 55px;
          text-align: center;
        }

        .markets-breadcrumb {
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #707b87;
          font-size: 11px;
        }

        .markets-breadcrumb a:hover {
          color: var(--markets-gold);
        }

        .markets-breadcrumb strong {
          color: #abb4be;
          font-weight: 700;
        }

        .hero-label {
          width: fit-content;
          margin: auto;
          padding: 8px 14px;
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--markets-gold-light);
          border: 1px solid rgba(231, 185, 79, 0.22);
          border-radius: 50px;
          background: rgba(231, 185, 79, 0.07);
          font-size: 11px;
          font-weight: 800;
        }

        .hero-label i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--markets-green);
          box-shadow: 0 0 0 0 rgba(37, 201, 151, 0.5);
          animation: marketsPulse 1.8s infinite;
        }

        .markets-hero h1 {
          max-width: 850px;
          margin: 22px auto 18px;
          font-size: clamp(38px, 6vw, 68px);
          line-height: 1.25;
          letter-spacing: -2px;
        }

        .markets-hero h1 span {
          display: block;
          color: transparent;
          background: linear-gradient(
            90deg,
            var(--markets-gold),
            #fff0b5,
            var(--markets-gold)
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          animation: goldTextMove 4s linear infinite;
        }

        .markets-hero > p {
          max-width: 720px;
          margin: auto;
          color: var(--markets-muted);
          font-size: 15px;
          line-height: 1.9;
        }

        .market-status-row {
          margin-top: 25px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 18px;
          color: #7d8894;
          font-size: 10px;
        }

        .market-status {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--markets-green);
          font-weight: 800;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--markets-green);
          animation: marketsPulse 1.8s infinite;
        }

        .ticker-section {
          position: relative;
          z-index: 5;
          min-height: 74px;
          margin-bottom: 70px;
          overflow: hidden;
          border-top: 1px solid var(--markets-border);
          border-bottom: 1px solid var(--markets-border);
          background: rgba(255, 255, 255, 0.015);
        }

        .widget-host,
        .tradingview-widget-container,
        .tradingview-widget-container__widget {
          width: 100%;
          height: 100%;
        }

        .tradingview-widget-copyright {
          padding: 5px 8px;
          color: #697684;
          background: #080d13;
          text-align: left;
          font-size: 9px;
          direction: ltr;
        }

        .tradingview-widget-copyright a {
          color: #8d9baa;
        }

        .section-title {
          margin-bottom: 25px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
        }

        .small-title {
          display: block;
          margin-bottom: 9px;
          color: var(--markets-gold);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
          direction: ltr;
        }

        .section-title h2 {
          margin: 0 0 10px;
          font-size: clamp(27px, 4vw, 39px);
        }

        .section-title p {
          max-width: 650px;
          margin: 0;
          color: var(--markets-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .gold-symbol {
          min-width: 220px;
          padding: 13px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(231, 185, 79, 0.18);
          border-radius: 12px;
          background: rgba(231, 185, 79, 0.05);
          direction: ltr;
        }

        .gold-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          color: #191307;
          border-radius: 10px;
          background: linear-gradient(
            135deg,
            var(--markets-gold-light),
            var(--markets-gold)
          );
          font-size: 14px;
          font-weight: 900;
        }

        .gold-symbol strong,
        .gold-symbol small {
          display: block;
        }

        .gold-symbol strong {
          font-size: 14px;
        }

        .gold-symbol small {
          margin-top: 5px;
          color: #77838f;
          font-size: 9px;
        }

        .gold-chart-card,
        .overview-card {
          overflow: hidden;
          border: 1px solid var(--markets-border);
          border-radius: 19px;
          background: #080d13;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.25);
        }

        .gold-chart-card {
          position: relative;
          padding: 15px;
        }

        .gold-chart-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(231, 185, 79, 0.4),
            transparent 35%,
            rgba(37, 201, 151, 0.16)
          );
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          z-index: 4;
        }

        .chart-top-line {
          min-height: 45px;
          padding: 0 8px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          border-bottom: 1px solid var(--markets-border);
        }

        .chart-top-line p {
          margin: 0;
          color: #6e7985;
          font-size: 10px;
        }

        .chart-live {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--markets-green);
          font-size: 10px;
          font-weight: 900;
          direction: ltr;
        }

        .chart-live span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--markets-green);
          animation: marketsPulse 1.8s infinite;
        }

        .gold-widget {
          height: 650px;
          margin-top: 15px;
        }

        .cards-section {
          padding-top: 110px;
        }

        .center-title {
          justify-content: center;
          text-align: center;
        }

        .center-title p {
          margin: auto;
        }

        .market-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .market-card {
          position: relative;
          min-height: 230px;
          padding: 25px;
          overflow: hidden;
          border: 1px solid var(--markets-border);
          border-radius: 16px;
          background: linear-gradient(
            145deg,
            rgba(17, 26, 37, 0.8),
            rgba(10, 15, 22, 0.85)
          );
          transition: 0.3s ease;
        }

        .market-card:hover {
          transform: translateY(-7px);
          border-color: rgba(231, 185, 79, 0.3);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .card-index {
          position: absolute;
          top: 16px;
          left: 18px;
          color: rgba(255, 255, 255, 0.05);
          font-size: 34px;
          font-weight: 900;
        }

        .market-card-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          margin-bottom: 22px;
          color: var(--markets-gold-light);
          border: 1px solid rgba(231, 185, 79, 0.18);
          border-radius: 11px;
          background: rgba(231, 185, 79, 0.07);
          font-size: 21px;
          font-weight: 900;
        }

        .market-card h3 {
          margin: 0 0 12px;
          font-size: 17px;
        }

        .market-card p {
          margin: 0;
          color: var(--markets-muted);
          font-size: 12px;
          line-height: 1.8;
        }

        .overview-section {
          padding-top: 110px;
        }

        .auto-update {
          padding: 9px 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--markets-green);
          border: 1px solid rgba(37, 201, 151, 0.18);
          border-radius: 50px;
          background: rgba(37, 201, 151, 0.05);
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .auto-update span {
          font-size: 17px;
          animation: updateRotate 4s linear infinite;
        }

        .overview-card {
          min-height: 720px;
          padding: 12px;
        }

        .overview-widget {
          height: 720px;
        }

        .guide-section {
          margin-top: 110px;
          padding: 55px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 60px;
          border: 1px solid var(--markets-border);
          border-radius: 20px;
          background:
            radial-gradient(
              circle at 5% 20%,
              rgba(231, 185, 79, 0.08),
              transparent 30%
            ),
            rgba(255, 255, 255, 0.018);
        }

        .guide-content h2 {
          margin: 10px 0 15px;
          font-size: clamp(27px, 4vw, 40px);
        }

        .guide-content p {
          margin: 0;
          color: var(--markets-muted);
          font-size: 13px;
          line-height: 1.9;
        }

        .academy-button {
          min-height: 49px;
          margin-top: 25px;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #171207;
          border-radius: 10px;
          background: linear-gradient(
            135deg,
            var(--markets-gold-light),
            var(--markets-gold)
          );
          font-size: 12px;
          font-weight: 900;
          transition: 0.25s ease;
        }

        .academy-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(231, 185, 79, 0.2);
        }

        .guide-points {
          display: grid;
          gap: 12px;
        }

        .guide-point {
          padding: 18px;
          display: grid;
          grid-template-columns: 46px 1fr;
          gap: 15px;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
        }

        .guide-point > span {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          color: var(--markets-gold);
          border: 1px solid rgba(231, 185, 79, 0.18);
          border-radius: 10px;
          background: rgba(231, 185, 79, 0.06);
          font-size: 10px;
          font-weight: 900;
        }

        .guide-point strong {
          font-size: 14px;
        }

        .guide-point p {
          margin: 6px 0 0;
          color: var(--markets-muted);
          font-size: 11px;
          line-height: 1.7;
        }

        .disclaimer {
          margin-top: 35px;
          padding: 22px;
          display: flex;
          gap: 15px;
          border: 1px solid rgba(231, 185, 79, 0.15);
          border-radius: 13px;
          background: rgba(231, 185, 79, 0.04);
        }

        .warning-mark {
          min-width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          color: var(--markets-gold);
          border: 1px solid rgba(231, 185, 79, 0.3);
          border-radius: 50%;
          font-weight: 900;
        }

        .disclaimer strong {
          color: #e6ce96;
          font-size: 13px;
        }

        .disclaimer p {
          margin: 8px 0 0;
          color: #8d949c;
          font-size: 11px;
          line-height: 1.8;
        }

        @keyframes marketsPulse {
          70% {
            box-shadow: 0 0 0 8px rgba(37, 201, 151, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 201, 151, 0);
          }
        }

        @keyframes goldTextMove {
          to {
            background-position: 200% center;
          }
        }

        @keyframes updateRotate {
          to {
            transform: rotate(-360deg);
          }
        }

        @media (max-width: 950px) {
          .market-cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .guide-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .markets-hero,
          .markets-container {
            width: min(100% - 24px, 1180px);
          }

          .markets-hero {
            padding-top: 50px;
          }

          .markets-hero h1 {
            font-size: 39px;
            letter-spacing: -1px;
          }

          .section-title {
            align-items: flex-start;
            flex-direction: column;
          }

          .gold-symbol {
            width: 100%;
          }

          .gold-chart-card {
            padding: 7px;
            border-radius: 13px;
          }

          .chart-top-line {
            align-items: flex-start;
            flex-direction: column;
            padding: 10px;
          }

          .gold-widget {
            height: 530px;
            min-height: 530px !important;
          }

          .market-cards {
            grid-template-columns: 1fr;
          }

          .market-card {
            min-height: auto;
          }

          .overview-card {
            min-height: 680px;
            padding: 5px;
          }

          .overview-widget {
            height: 680px;
            min-height: 680px !important;
          }

          .guide-section {
            padding: 30px 18px;
            gap: 40px;
          }

          .academy-button {
            width: 100%;
            justify-content: center;
          }

          .disclaimer {
            align-items: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </main>
  );
}
