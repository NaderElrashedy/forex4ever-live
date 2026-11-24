"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const AUTO_REFRESH_TIME = 5 * 60 * 1000;

export default function EgyptPricesPage() {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadPrices = useCallback(async (manualRefresh = false) => {
    try {
      if (manualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch("/api/egypt-prices", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "تعذر الحصول على الأسعار حاليًا."
        );
      }

      setPrices(result);
    } catch (requestError) {
      setError(
        requestError.message ||
          "حدث خطأ أثناء تحميل الأسعار. حاول مرة أخرى."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPrices(false);

    const interval = setInterval(() => {
      loadPrices(true);
    }, AUTO_REFRESH_TIME);

    return () => clearInterval(interval);
  }, [loadPrices]);

  function formatMoney(value, maximumFractionDigits = 2) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "—";
    }

    return new Intl.NumberFormat("ar-EG", {
      minimumFractionDigits: 2,
      maximumFractionDigits,
    }).format(number);
  }

  function formatDate(value) {
    if (!value) return "غير متاح";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "غير متاح";
    }

    return new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  return (
    <main className="egyptPricesPage" dir="rtl">
      <div className="backgroundGlow glowOne" />
      <div className="backgroundGlow glowTwo" />

      <div className="pageContainer">
        <section className="heroSection">
          <div className="heroTop">
            <Link href="/" className="homeLink">
              <span>←</span>
              العودة إلى الرئيسية
            </Link>

            <div className="liveBadge">
              <span className="liveDot" />
              تحديث تلقائي
            </div>
          </div>

          <div className="heroContent">
            <div className="heroIcon">🇪🇬</div>

            <div>
              <p className="eyebrow">FOREX4EVER MARKET DATA</p>

              <h1>
                أسعار الذهب والعملات
                <span> في مصر</span>
              </h1>

              <p className="heroDescription">
                تابع أسعار الذهب بمختلف العيارات وأسعار السبائك
                والعملات الأجنبية مقابل الجنيه المصري في مكان واحد.
              </p>
            </div>
          </div>

          <div className="heroStatus">
            <div className="statusItem">
              <span className="statusLabel">آخر تحديث</span>
              <strong>
                {prices ? formatDate(prices.fetchedAt) : "جاري التحميل..."}
              </strong>
            </div>

            <div className="statusItem">
              <span className="statusLabel">تحديث البيانات</span>
              <strong>كل 5 دقائق</strong>
            </div>

            <button
              type="button"
              className="refreshButton"
              onClick={() => loadPrices(true)}
              disabled={refreshing || loading}
            >
              <span className={refreshing ? "spin" : ""}>↻</span>
              {refreshing ? "جاري التحديث..." : "تحديث الأسعار"}
            </button>
          </div>
        </section>

        {loading && !prices && (
          <section className="loadingState">
            <div className="loader" />
            <h2>جاري تحميل أحدث الأسعار</h2>
            <p>يتم الآن الاتصال بمصادر البيانات...</p>
          </section>
        )}

        {error && (
          <section className="errorState">
            <div className="errorIcon">!</div>

            <div>
              <h2>تعذر تحديث الأسعار</h2>
              <p>{error}</p>
            </div>

            <button type="button" onClick={() => loadPrices(true)}>
              إعادة المحاولة
            </button>
          </section>
        )}

        {prices && (
          <>
            <section className="summaryGrid">
              <article className="summaryCard featured">
                <div className="summaryCardHeader">
                  <span className="summaryIcon">🥇</span>
                  <span className="cardTag">الأكثر متابعة</span>
                </div>

                <p>جرام الذهب عيار 21</p>

                <div className="largePrice">
                  {formatMoney(
                    prices.gold.karats.find(
                      (item) => item.karat === 21
                    )?.price
                  )}
                  <span>جنيه</span>
                </div>

                <small>سعر استرشادي قبل المصنعية</small>
              </article>

              <article className="summaryCard">
                <div className="summaryCardHeader">
                  <span className="summaryIcon">💵</span>
                  <span className="currencyCode">USD</span>
                </div>

                <p>الدولار الأمريكي</p>

                <div className="largePrice">
                  {formatMoney(
                    prices.currencies.find(
                      (currency) => currency.code === "USD"
                    )?.rate,
                    4
                  )}
                  <span>جنيه</span>
                </div>

                <small>قيمة دولار واحد مقابل الجنيه</small>
              </article>

              <article className="summaryCard">
                <div className="summaryCardHeader">
                  <span className="summaryIcon">🪙</span>
                  <span className="currencyCode">XAU</span>
                </div>

                <p>أونصة الذهب عالميًا</p>

                <div className="largePrice">
                  {formatMoney(prices.gold.ounceUsd)}
                  <span>دولار</span>
                </div>

                <small>
                  ما يعادل {formatMoney(prices.gold.ounceEgp)} جنيه
                </small>
              </article>

              <article className="summaryCard">
                <div className="summaryCardHeader">
                  <span className="summaryIcon">🏅</span>
                  <span className="currencyCode">8G</span>
                </div>

                <p>الجنيه الذهب</p>

                <div className="largePrice">
                  {formatMoney(prices.gold.goldPound)}
                  <span>جنيه</span>
                </div>

                <small>8 جرامات من الذهب عيار 21</small>
              </article>
            </section>

            <section className="contentSection">
              <div className="sectionHeading">
                <div>
                  <span className="sectionLabel">أسعار اليوم</span>
                  <h2>أسعار الذهب حسب العيار</h2>
                  <p>
                    السعر التقديري لجرام الذهب بالجنيه المصري قبل
                    المصنعية.
                  </p>
                </div>

                <div className="headingIcon">✦</div>
              </div>

              <div className="goldGrid">
                {prices.gold.karats.map((gold) => (
                  <article
                    className={`goldCard ${
                      gold.karat === 21 ? "popularGold" : ""
                    }`}
                    key={gold.karat}
                  >
                    {gold.karat === 21 && (
                      <span className="popularLabel">الأكثر تداولًا</span>
                    )}

                    <div className="karatCircle">
                      <strong>{gold.karat}</strong>
                      <span>قيراط</span>
                    </div>

                    <div className="goldCardContent">
                      <h3>{gold.label}</h3>
                      <p>نقاء الذهب {gold.purity}</p>

                      <div className="goldPrice">
                        {formatMoney(gold.price)}
                        <span>جنيه / جرام</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="contentSection">
              <div className="sectionHeading">
                <div>
                  <span className="sectionLabel">ذهب عيار 24</span>
                  <h2>أسعار السبائك الذهبية</h2>
                  <p>
                    أسعار تقديرية محسوبة حسب وزن السبيكة دون إضافة
                    المصنعية أو هامش التاجر.
                  </p>
                </div>

                <div className="headingIcon">▰</div>
              </div>

              <div className="tableWrapper">
                <table className="pricesTable">
                  <thead>
                    <tr>
                      <th>وزن السبيكة</th>
                      <th>العيار</th>
                      <th>السعر الاسترشادي</th>
                    </tr>
                  </thead>

                  <tbody>
                    {prices.gold.bars.map((bar) => (
                      <tr key={bar.weight}>
                        <td>
                          <div className="tableName">
                            <span className="miniGoldBar">◆</span>
                            <strong>{bar.label}</strong>
                          </div>
                        </td>

                        <td>
                          <span className="tableBadge">عيار 24</span>
                        </td>

                        <td className="tablePrice">
                          {formatMoney(bar.price)}
                          <span> جنيه</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="contentSection">
              <div className="sectionHeading">
                <div>
                  <span className="sectionLabel">سوق العملات</span>
                  <h2>العملات مقابل الجنيه المصري</h2>
                  <p>
                    قيمة وحدة واحدة من كل عملة مقابل الجنيه المصري.
                  </p>
                </div>

                <div className="headingIcon">⇄</div>
              </div>

              <div className="currenciesGrid">
                {prices.currencies.map((currency) => (
                  <article className="currencyCard" key={currency.code}>
                    <div className="currencyIdentity">
                      <span className="flag">{currency.flag}</span>

                      <div>
                        <h3>{currency.name}</h3>
                        <span>{currency.code} / EGP</span>
                      </div>
                    </div>

                    <div className="currencyValue">
                      <strong>
                        {formatMoney(currency.rate, 4)}
                      </strong>
                      <span>جنيه مصري</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="sourcesSection">
              <div className="sourceIcon">i</div>

              <div className="sourceContent">
                <h2>مصادر البيانات وتنبيه الأسعار</h2>

                <p>
                  مصدر الذهب: <strong>{prices.sources.gold}</strong>
                  {" — "}
                  مصدر العملات:{" "}
                  <strong>{prices.sources.currencies}</strong>
                </p>

                <p>
                  الأسعار المعروضة استرشادية، وقد تختلف عن أسعار السوق
                  المحلي ومحلات الصاغة والبنوك بسبب المصنعية وهامش
                  التاجر وفروق أسعار الشراء والبيع.
                </p>

                <span>
                  آخر جلب للبيانات: {formatDate(prices.fetchedAt)}
                </span>
              </div>
            </section>
          </>
        )}
      </div>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          background: #070907;
          color: #ffffff;
        }

        .egyptPricesPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 38px 20px 70px;
          background:
            radial-gradient(
              circle at 90% 5%,
              rgba(197, 156, 62, 0.15),
              transparent 28%
            ),
            radial-gradient(
              circle at 5% 55%,
              rgba(197, 156, 62, 0.08),
              transparent 25%
            ),
            linear-gradient(180deg, #090b09 0%, #050605 100%);
          font-family: Arial, Tahoma, sans-serif;
        }

        .backgroundGlow {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(211, 172, 78, 0.08);
          filter: blur(90px);
          pointer-events: none;
        }

        .glowOne {
          top: 250px;
          right: -100px;
        }

        .glowTwo {
          bottom: 300px;
          left: -120px;
        }

        .pageContainer {
          position: relative;
          z-index: 1;
          width: min(1220px, 100%);
          margin: 0 auto;
        }

        .heroSection {
          position: relative;
          overflow: hidden;
          padding: 28px 32px;
          border: 1px solid rgba(220, 181, 88, 0.25);
          border-radius: 28px;
          background:
            linear-gradient(
              130deg,
              rgba(31, 32, 25, 0.96),
              rgba(10, 12, 10, 0.96)
            );
          box-shadow:
            0 25px 80px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .heroSection::before {
          position: absolute;
          top: -120px;
          left: -80px;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: rgba(209, 169, 76, 0.1);
          filter: blur(30px);
          content: "";
        }

        .heroTop,
        .heroContent,
        .heroStatus {
          position: relative;
          z-index: 1;
        }

        .heroTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .homeLink {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #d7d9d5;
          font-size: 14px;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .homeLink:hover {
          color: #e1bd64;
        }

        .liveBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid rgba(84, 205, 131, 0.2);
          border-radius: 999px;
          color: #a9e7bd;
          background: rgba(47, 151, 86, 0.08);
          font-size: 12px;
        }

        .liveDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4bd17c;
          box-shadow: 0 0 12px #4bd17c;
        }

        .heroContent {
          display: flex;
          align-items: center;
          gap: 22px;
          padding: 46px 0 36px;
        }

        .heroIcon {
          display: grid;
          flex: 0 0 86px;
          width: 86px;
          height: 86px;
          place-items: center;
          border: 1px solid rgba(220, 181, 88, 0.24);
          border-radius: 25px;
          background: rgba(220, 181, 88, 0.08);
          font-size: 40px;
        }

        .eyebrow,
        .sectionLabel {
          margin: 0 0 10px;
          color: #d6ae52;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .heroContent h1 {
          margin: 0;
          color: #ffffff;
          font-size: clamp(32px, 5vw, 58px);
          line-height: 1.15;
        }

        .heroContent h1 span {
          color: #dfb959;
        }

        .heroDescription {
          max-width: 740px;
          margin: 18px 0 0;
          color: #afb3ac;
          font-size: 16px;
          line-height: 1.9;
        }

        .heroStatus {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          align-items: center;
          gap: 16px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .statusItem {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .statusLabel {
          color: #858a83;
          font-size: 12px;
        }

        .statusItem strong {
          color: #e4e5e2;
          font-size: 14px;
        }

        .refreshButton,
        .errorState button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 44px;
          padding: 0 19px;
          border: 1px solid #d5ad50;
          border-radius: 12px;
          color: #11130f;
          background: linear-gradient(135deg, #efcc73, #bc8d2e);
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .refreshButton:hover,
        .errorState button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(211, 170, 72, 0.2);
        }

        .refreshButton:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spin {
          display: inline-block;
          animation: spin 0.8s linear infinite;
        }

        .loadingState {
          display: flex;
          min-height: 360px;
          margin-top: 25px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.025);
          text-align: center;
        }

        .loader {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(222, 184, 89, 0.15);
          border-top-color: #dfb959;
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }

        .loadingState h2 {
          margin: 22px 0 8px;
          font-size: 21px;
        }

        .loadingState p {
          margin: 0;
          color: #949991;
        }

        .errorState {
          display: flex;
          margin-top: 25px;
          padding: 22px;
          align-items: center;
          gap: 18px;
          border: 1px solid rgba(229, 89, 89, 0.25);
          border-radius: 18px;
          background: rgba(150, 30, 30, 0.08);
        }

        .errorIcon {
          display: grid;
          flex: 0 0 42px;
          width: 42px;
          height: 42px;
          place-items: center;
          border-radius: 50%;
          color: #ffc3c3;
          background: rgba(219, 70, 70, 0.16);
          font-weight: 900;
        }

        .errorState div:nth-child(2) {
          flex: 1;
        }

        .errorState h2 {
          margin: 0 0 6px;
          font-size: 17px;
        }

        .errorState p {
          margin: 0;
          color: #d3aaa8;
          font-size: 14px;
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 24px;
        }

        .summaryCard {
          position: relative;
          overflow: hidden;
          min-height: 185px;
          padding: 22px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          background: linear-gradient(
            145deg,
            rgba(24, 27, 23, 0.96),
            rgba(12, 14, 12, 0.96)
          );
          box-shadow: 0 16px 35px rgba(0, 0, 0, 0.18);
          transition: 0.25s ease;
        }

        .summaryCard:hover {
          transform: translateY(-4px);
          border-color: rgba(217, 177, 81, 0.28);
        }

        .summaryCard.featured {
          border-color: rgba(220, 180, 84, 0.32);
          background:
            radial-gradient(
              circle at 0 0,
              rgba(221, 180, 81, 0.13),
              transparent 55%
            ),
            linear-gradient(
              145deg,
              rgba(30, 29, 21, 0.98),
              rgba(13, 14, 11, 0.98)
            );
        }

        .summaryCardHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .summaryIcon {
          font-size: 26px;
        }

        .cardTag,
        .currencyCode,
        .tableBadge {
          padding: 5px 9px;
          border-radius: 999px;
          color: #d9b760;
          background: rgba(215, 179, 91, 0.09);
          font-size: 10px;
          font-weight: 800;
        }

        .summaryCard > p {
          margin: 22px 0 8px;
          color: #a3a79f;
          font-size: 14px;
        }

        .largePrice {
          display: flex;
          align-items: baseline;
          gap: 7px;
          color: #f3f3ef;
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 900;
        }

        .largePrice span {
          color: #caaa57;
          font-size: 12px;
        }

        .summaryCard small {
          display: block;
          margin-top: 11px;
          color: #70766e;
          font-size: 11px;
        }

        .contentSection {
          margin-top: 64px;
        }

        .sectionHeading {
          display: flex;
          margin-bottom: 22px;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
        }

        .sectionHeading h2 {
          margin: 0;
          color: #f3f4f1;
          font-size: clamp(25px, 4vw, 35px);
        }

        .sectionHeading p {
          margin: 11px 0 0;
          color: #8e948c;
          font-size: 14px;
          line-height: 1.8;
        }

        .headingIcon {
          display: grid;
          flex: 0 0 52px;
          width: 52px;
          height: 52px;
          place-items: center;
          border: 1px solid rgba(215, 177, 83, 0.2);
          border-radius: 15px;
          color: #ddb654;
          background: rgba(215, 177, 83, 0.07);
          font-size: 25px;
        }

        .goldGrid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }

        .goldCard {
          position: relative;
          display: flex;
          min-height: 225px;
          padding: 22px 18px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          background: rgba(17, 19, 16, 0.9);
          text-align: center;
          transition: 0.25s ease;
        }

        .goldCard:hover {
          transform: translateY(-5px);
          border-color: rgba(222, 182, 87, 0.35);
          background: rgba(24, 24, 18, 0.95);
        }

        .popularGold {
          border-color: rgba(222, 182, 87, 0.35);
          background:
            radial-gradient(
              circle at 50% 0,
              rgba(215, 175, 78, 0.12),
              transparent 55%
            ),
            rgba(20, 21, 16, 0.95);
        }

        .popularLabel {
          position: absolute;
          top: 0;
          right: 50%;
          padding: 5px 12px;
          border-radius: 0 0 10px 10px;
          color: #1b180f;
          background: #d7ae4e;
          font-size: 9px;
          font-weight: 900;
          transform: translateX(50%);
        }

        .karatCircle {
          display: flex;
          width: 68px;
          height: 68px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          border: 1px solid rgba(223, 184, 88, 0.25);
          border-radius: 50%;
          color: #e3bd5f;
          background: rgba(223, 184, 88, 0.07);
        }

        .karatCircle strong {
          font-size: 22px;
        }

        .karatCircle span {
          color: #9e874f;
          font-size: 9px;
        }

        .goldCardContent h3 {
          margin: 14px 0 4px;
          font-size: 16px;
        }

        .goldCardContent p {
          margin: 0;
          color: #777d75;
          font-size: 11px;
        }

        .goldPrice {
          margin-top: 17px;
          color: #e9eae7;
          font-size: 19px;
          font-weight: 900;
        }

        .goldPrice span {
          display: block;
          margin-top: 6px;
          color: #aa8d49;
          font-size: 10px;
          font-weight: 500;
        }

        .tableWrapper {
          overflow-x: auto;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          background: rgba(14, 16, 14, 0.94);
        }

        .pricesTable {
          width: 100%;
          min-width: 650px;
          border-collapse: collapse;
        }

        .pricesTable th {
          padding: 18px 22px;
          color: #8e938b;
          background: rgba(255, 255, 255, 0.025);
          font-size: 12px;
          text-align: right;
        }

        .pricesTable td {
          padding: 18px 22px;
          border-top: 1px solid rgba(255, 255, 255, 0.055);
          color: #d8dad5;
          font-size: 14px;
        }

        .pricesTable tbody tr {
          transition: 0.2s ease;
        }

        .pricesTable tbody tr:hover {
          background: rgba(215, 176, 80, 0.035);
        }

        .tableName {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .miniGoldBar {
          color: #dab459;
        }

        .tablePrice {
          color: #e7c36d !important;
          font-size: 16px !important;
          font-weight: 900;
        }

        .tablePrice span {
          color: #8f7944;
          font-size: 11px;
        }

        .currenciesGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .currencyCard {
          display: flex;
          min-height: 108px;
          padding: 20px;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background: linear-gradient(
            145deg,
            rgba(20, 23, 19, 0.95),
            rgba(12, 14, 12, 0.95)
          );
          transition: 0.2s ease;
        }

        .currencyCard:hover {
          transform: translateY(-3px);
          border-color: rgba(214, 176, 82, 0.25);
        }

        .currencyIdentity {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .flag {
          display: grid;
          width: 48px;
          height: 48px;
          place-items: center;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          font-size: 26px;
        }

        .currencyIdentity h3 {
          margin: 0 0 7px;
          font-size: 15px;
        }

        .currencyIdentity span {
          color: #727870;
          font-size: 11px;
        }

        .currencyValue {
          text-align: left;
        }

        .currencyValue strong {
          display: block;
          color: #e8c268;
          font-size: 21px;
        }

        .currencyValue span {
          display: block;
          margin-top: 6px;
          color: #70766e;
          font-size: 10px;
        }

        .sourcesSection {
          display: flex;
          margin-top: 55px;
          padding: 24px;
          align-items: flex-start;
          gap: 17px;
          border: 1px solid rgba(216, 177, 83, 0.17);
          border-radius: 18px;
          background: rgba(215, 176, 80, 0.035);
        }

        .sourceIcon {
          display: grid;
          flex: 0 0 38px;
          width: 38px;
          height: 38px;
          place-items: center;
          border-radius: 50%;
          color: #dcb75c;
          background: rgba(216, 177, 83, 0.1);
          font-family: serif;
          font-weight: 900;
        }

        .sourceContent h2 {
          margin: 0 0 10px;
          font-size: 16px;
        }

        .sourceContent p {
          margin: 7px 0;
          color: #969b94;
          font-size: 13px;
          line-height: 1.8;
        }

        .sourceContent strong {
          color: #d5b45e;
        }

        .sourceContent > span {
          display: block;
          margin-top: 12px;
          color: #656a64;
          font-size: 11px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1050px) {
          .summaryGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .goldGrid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 720px) {
          .egyptPricesPage {
            padding: 18px 13px 50px;
          }

          .heroSection {
            padding: 20px 17px;
            border-radius: 22px;
          }

          .heroContent {
            align-items: flex-start;
            padding: 34px 0 28px;
            flex-direction: column;
          }

          .heroIcon {
            width: 68px;
            height: 68px;
            flex-basis: 68px;
            border-radius: 19px;
            font-size: 31px;
          }

          .heroContent h1 {
            font-size: 34px;
          }

          .heroDescription {
            font-size: 14px;
          }

          .heroStatus {
            grid-template-columns: 1fr 1fr;
          }

          .refreshButton {
            grid-column: 1 / -1;
          }

          .summaryGrid {
            grid-template-columns: 1fr;
          }

          .summaryCard {
            min-height: 165px;
          }

          .contentSection {
            margin-top: 48px;
          }

          .sectionHeading {
            align-items: flex-start;
          }

          .headingIcon {
            width: 44px;
            height: 44px;
            flex-basis: 44px;
          }

          .goldGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .currenciesGrid {
            grid-template-columns: 1fr;
          }

          .currencyCard {
            padding: 17px 14px;
          }

          .errorState {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .errorState button {
            width: 100%;
          }
        }

        @media (max-width: 440px) {
          .heroTop {
            align-items: flex-start;
            flex-direction: column;
          }

          .heroStatus {
            grid-template-columns: 1fr;
          }

          .refreshButton {
            grid-column: auto;
          }

          .goldGrid {
            grid-template-columns: 1fr;
          }

          .goldCard {
            min-height: 205px;
          }

          .currencyValue strong {
            font-size: 18px;
          }

          .flag {
            width: 42px;
            height: 42px;
            font-size: 22px;
          }

          .sourcesSection {
            padding: 18px;
          }
        }
      `}</style>
    </main>
  );
}
