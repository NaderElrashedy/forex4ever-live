"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const assetPresets = {
  gold: {
    name: "الذهب XAUUSD",
    contractSize: "100",
  },
  bitcoin: {
    name: "البيتكوين BTCUSD",
    contractSize: "1",
  },
  forex: {
    name: "الفوركس",
    contractSize: "100000",
  },
  custom: {
    name: "أصل مخصص",
    contractSize: "1",
  },
};

function convertToNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return 0;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatNumber(value, maximumFractionDigits = 4) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

function formatMoney(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function RiskCalculatorPage() {
  const [asset, setAsset] = useState("gold");
  const [balance, setBalance] = useState("10000");
  const [riskPercentage, setRiskPercentage] = useState("1");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [contractSize, setContractSize] = useState(
    assetPresets.gold.contractSize
  );

  const calculation = useMemo(() => {
    const accountBalance = convertToNumber(balance);
    const riskPercent = convertToNumber(riskPercentage);
    const entry = convertToNumber(entryPrice);
    const stop = convertToNumber(stopLoss);
    const target = convertToNumber(takeProfit);
    const contract = convertToNumber(contractSize);

    const errors = [];

    if (accountBalance <= 0) {
      errors.push("أدخل رصيد حساب أكبر من صفر.");
    }

    if (riskPercent <= 0) {
      errors.push("أدخل نسبة مخاطرة أكبر من صفر.");
    }

    if (entry <= 0) {
      errors.push("أدخل سعر دخول صحيحًا.");
    }

    if (stop <= 0) {
      errors.push("أدخل سعر وقف خسارة صحيحًا.");
    }

    if (entry > 0 && stop > 0 && entry === stop) {
      errors.push("لا يمكن أن يتساوى سعر الدخول مع وقف الخسارة.");
    }

    if (contract <= 0) {
      errors.push("يجب أن يكون حجم العقد أكبر من صفر.");
    }

    const riskAmount = accountBalance * (riskPercent / 100);
    const stopDistance =
      entry > 0 && stop > 0 ? Math.abs(entry - stop) : 0;

    const positionSize =
      riskAmount > 0 && stopDistance > 0 && contract > 0
        ? riskAmount / (stopDistance * contract)
        : 0;

    const tradedUnits = positionSize * contract;
    const expectedLoss = stopDistance * contract * positionSize;

    const targetDistance =
      target > 0 && entry > 0 ? Math.abs(target - entry) : 0;

    const expectedProfit =
      targetDistance > 0
        ? targetDistance * contract * positionSize
        : 0;

    const rewardRiskRatio =
      targetDistance > 0 && stopDistance > 0
        ? targetDistance / stopDistance
        : 0;

    let direction = "";

    if (entry > 0 && stop > 0) {
      direction = stop < entry ? "شراء" : "بيع";
    }

    let targetWarning = "";

    if (target > 0 && entry > 0 && stop > 0) {
      if (direction === "شراء" && target <= entry) {
        targetWarning =
          "في صفقة الشراء يُفترض أن يكون الهدف أعلى من سعر الدخول.";
      }

      if (direction === "بيع" && target >= entry) {
        targetWarning =
          "في صفقة البيع يُفترض أن يكون الهدف أقل من سعر الدخول.";
      }
    }

    return {
      errors,
      riskAmount,
      stopDistance,
      positionSize,
      tradedUnits,
      expectedLoss,
      expectedProfit,
      rewardRiskRatio,
      direction,
      targetWarning,
      hasTarget: target > 0,
      isReady: errors.length === 0,
    };
  }, [
    balance,
    riskPercentage,
    entryPrice,
    stopLoss,
    takeProfit,
    contractSize,
  ]);

  function handleAssetChange(event) {
    const selectedAsset = event.target.value;

    setAsset(selectedAsset);
    setContractSize(assetPresets[selectedAsset].contractSize);
  }

  function resetCalculator() {
    setAsset("gold");
    setBalance("10000");
    setRiskPercentage("1");
    setEntryPrice("");
    setStopLoss("");
    setTakeProfit("");
    setContractSize(assetPresets.gold.contractSize);
  }

  return (
    <main className="risk-page" dir="rtl">
      <div className="background-glow background-glow-one" />
      <div className="background-glow background-glow-two" />

      <div className="page-container">
        <div className="top-navigation">
          <Link href="/" className="home-link">
            <span aria-hidden="true">←</span>
            العودة إلى الرئيسية
          </Link>

          <span className="brand-name">Forex4Ever</span>
        </div>

        <section className="hero-section">
          <span className="section-badge">أداة مجانية للمتداولين</span>

          <h1>حاسبة إدارة المخاطر</h1>

          <p>
            احسب حجم صفقتك بناءً على رصيد الحساب ونسبة المخاطرة والمسافة
            بين سعر الدخول ووقف الخسارة.
          </p>
        </section>

        <div className="calculator-layout">
          <section className="calculator-card">
            <div className="card-heading">
              <div>
                <span className="heading-number">01</span>
                <h2>بيانات الصفقة</h2>
              </div>

              <button
                type="button"
                className="reset-button"
                onClick={resetCalculator}
              >
                إعادة ضبط
              </button>
            </div>

            <div className="form-grid">
              <div className="field-group full-width">
                <label htmlFor="asset">نوع الأصل</label>

                <select
                  id="asset"
                  value={asset}
                  onChange={handleAssetChange}
                >
                  {Object.entries(assetPresets).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label htmlFor="balance">رصيد الحساب</label>

                <div className="input-wrapper">
                  <input
                    id="balance"
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    value={balance}
                    onChange={(event) => setBalance(event.target.value)}
                    placeholder="10000"
                  />
                  <span>USD</span>
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="riskPercentage">نسبة المخاطرة</label>

                <div className="input-wrapper">
                  <input
                    id="riskPercentage"
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    value={riskPercentage}
                    onChange={(event) =>
                      setRiskPercentage(event.target.value)
                    }
                    placeholder="1"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="entryPrice">سعر الدخول</label>

                <input
                  id="entryPrice"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={entryPrice}
                  onChange={(event) => setEntryPrice(event.target.value)}
                  placeholder="مثال: 2350"
                />
              </div>

              <div className="field-group">
                <label htmlFor="stopLoss">وقف الخسارة</label>

                <input
                  id="stopLoss"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={stopLoss}
                  onChange={(event) => setStopLoss(event.target.value)}
                  placeholder="مثال: 2340"
                />
              </div>

              <div className="field-group">
                <label htmlFor="takeProfit">
                  سعر الهدف
                  <small>اختياري</small>
                </label>

                <input
                  id="takeProfit"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={takeProfit}
                  onChange={(event) => setTakeProfit(event.target.value)}
                  placeholder="مثال: 2370"
                />
              </div>

              <div className="field-group">
                <label htmlFor="contractSize">
                  حجم العقد
                  <small>قابل للتعديل</small>
                </label>

                <input
                  id="contractSize"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={contractSize}
                  onChange={(event) => setContractSize(event.target.value)}
                  placeholder="100"
                />
              </div>
            </div>

            {convertToNumber(riskPercentage) > 2 && (
              <div className="warning-message">
                <strong>تنبيه:</strong> نسبة المخاطرة المدخلة أعلى من 2% من
                رصيد الحساب.
              </div>
            )}

            {calculation.errors.length > 0 && (
              <div className="errors-box">
                <strong>أكمل البيانات التالية:</strong>

                <ul>
                  {calculation.errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="results-card">
            <div className="card-heading results-heading">
              <div>
                <span className="heading-number">02</span>
                <h2>نتيجة الحساب</h2>
              </div>

              {calculation.direction && (
                <span
                  className={`direction-badge ${
                    calculation.direction === "شراء" ? "buy" : "sell"
                  }`}
                >
                  {calculation.direction}
                </span>
              )}
            </div>

            <div className="main-result">
              <span>حجم الصفقة المقترح</span>

              <strong>
                {calculation.isReady
                  ? formatNumber(calculation.positionSize, 6)
                  : "—"}
              </strong>

              <small>لوت تقريبي</small>
            </div>

            <div className="results-grid">
              <div className="result-item">
                <span>مبلغ المخاطرة</span>
                <strong>
                  {calculation.isReady
                    ? formatMoney(calculation.riskAmount)
                    : "—"}
                </strong>
              </div>

              <div className="result-item">
                <span>المسافة إلى الوقف</span>
                <strong>
                  {calculation.isReady
                    ? formatNumber(calculation.stopDistance, 6)
                    : "—"}
                </strong>
              </div>

              <div className="result-item">
                <span>عدد الوحدات</span>
                <strong>
                  {calculation.isReady
                    ? formatNumber(calculation.tradedUnits, 4)
                    : "—"}
                </strong>
              </div>

              <div className="result-item">
                <span>الخسارة عند الوقف</span>
                <strong className="loss-value">
                  {calculation.isReady
                    ? formatMoney(calculation.expectedLoss)
                    : "—"}
                </strong>
              </div>

              <div className="result-item">
                <span>الربح المتوقع</span>
                <strong className="profit-value">
                  {calculation.isReady && calculation.hasTarget
                    ? formatMoney(calculation.expectedProfit)
                    : "—"}
                </strong>
              </div>

              <div className="result-item">
                <span>العائد مقابل المخاطرة</span>
                <strong>
                  {calculation.isReady && calculation.hasTarget
                    ? `1 : ${formatNumber(
                        calculation.rewardRiskRatio,
                        2
                      )}`
                    : "—"}
                </strong>
              </div>
            </div>

            {calculation.targetWarning && (
              <div className="target-warning">
                {calculation.targetWarning}
              </div>
            )}

            <div className="formula-box">
              <strong>طريقة الحساب</strong>
              <p>
                حجم الصفقة = مبلغ المخاطرة ÷ (المسافة إلى وقف الخسارة ×
                حجم العقد).
              </p>
            </div>
          </section>
        </div>

        <section className="information-section">
          <div className="information-card">
            <span className="information-icon">⚠️</span>

            <div>
              <h2>راجع مواصفات العقد لدى وسيطك</h2>

              <p>
                حجم العقد وقيمة حركة السعر قد يختلفان بين شركات الوساطة.
                النتائج تكون أدق عندما تكون حركة السعر محسوبة بعملة الحساب،
                مثل XAUUSD وBTCUSD وبعض أزواج الفوركس في حساب بالدولار.
              </p>
            </div>
          </div>

          <div className="information-card">
            <span className="information-icon">🛡️</span>

            <div>
              <h2>أداة تعليمية</h2>

              <p>
                الحاسبة لا تنفذ صفقات ولا تضمن الأرباح. راجع النتيجة
                ومواصفات الأصل قبل فتح أي صفقة حقيقية.
              </p>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
        }

        .risk-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 28px 20px 60px;
          color: #f6f2e8;
          background:
            radial-gradient(
              circle at top right,
              rgba(197, 154, 61, 0.13),
              transparent 32%
            ),
            linear-gradient(145deg, #080a0d 0%, #101318 55%, #08090c 100%);
          font-family: inherit;
        }

        .background-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.22;
        }

        .background-glow-one {
          width: 280px;
          height: 280px;
          top: 20%;
          right: -120px;
          background: #d6a94f;
        }

        .background-glow-two {
          width: 260px;
          height: 260px;
          bottom: 5%;
          left: -130px;
          background: #72541b;
        }

        .page-container {
          position: relative;
          z-index: 1;
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .top-navigation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 65px;
        }

        .home-link {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #d8d9dc;
          text-decoration: none;
          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .home-link:hover {
          color: #dfb85f;
          transform: translateX(3px);
        }

        .brand-name {
          color: #e0b757;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .hero-section {
          max-width: 750px;
          margin: 0 auto 42px;
          text-align: center;
        }

        .section-badge {
          display: inline-flex;
          padding: 8px 16px;
          border: 1px solid rgba(223, 184, 95, 0.3);
          border-radius: 999px;
          color: #e8c672;
          background: rgba(223, 184, 95, 0.08);
          font-size: 13px;
          font-weight: 700;
        }

        .hero-section h1 {
          margin: 20px 0 14px;
          font-size: clamp(34px, 6vw, 62px);
          line-height: 1.1;
          color: #ffffff;
        }

        .hero-section p {
          margin: 0;
          color: #a9adb5;
          font-size: 17px;
          line-height: 1.9;
        }

        .calculator-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(340px, 0.88fr);
          gap: 22px;
          align-items: start;
        }

        .calculator-card,
        .results-card {
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 28px;
          background: rgba(18, 21, 26, 0.86);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(16px);
        }

        .results-card {
          border-color: rgba(221, 177, 78, 0.18);
          background:
            linear-gradient(
              145deg,
              rgba(210, 165, 65, 0.08),
              transparent 42%
            ),
            rgba(16, 19, 23, 0.94);
        }

        .card-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 26px;
        }

        .card-heading > div {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .card-heading h2 {
          margin: 0;
          font-size: 21px;
        }

        .heading-number {
          color: #d9ac48;
          font-size: 12px;
          font-weight: 800;
        }

        .reset-button {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 9px 13px;
          color: #c9cbd0;
          background: rgba(255, 255, 255, 0.04);
          font-family: inherit;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .reset-button:hover {
          color: #ffffff;
          border-color: rgba(222, 180, 87, 0.45);
          background: rgba(222, 180, 87, 0.09);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .field-group label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #d7d8dc;
          font-size: 14px;
          font-weight: 700;
        }

        .field-group label small {
          color: #7f848e;
          font-size: 11px;
          font-weight: 500;
        }

        input,
        select {
          width: 100%;
          height: 49px;
          outline: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0 14px;
          color: #ffffff;
          background: #0c0f13;
          font-family: inherit;
          font-size: 15px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        select {
          cursor: pointer;
        }

        select option {
          color: #ffffff;
          background: #111419;
        }

        input:focus,
        select:focus {
          border-color: #c89c3e;
          box-shadow: 0 0 0 3px rgba(200, 156, 62, 0.12);
        }

        input::placeholder {
          color: #5f646d;
        }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper input {
          padding-left: 60px;
        }

        .input-wrapper span {
          position: absolute;
          top: 50%;
          left: 14px;
          color: #c9a34e;
          font-size: 12px;
          font-weight: 800;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .warning-message,
        .errors-box,
        .target-warning {
          margin-top: 20px;
          border-radius: 13px;
          padding: 14px 16px;
          font-size: 13px;
          line-height: 1.8;
        }

        .warning-message,
        .target-warning {
          border: 1px solid rgba(255, 185, 74, 0.25);
          color: #ffd58c;
          background: rgba(255, 185, 74, 0.08);
        }

        .errors-box {
          border: 1px solid rgba(255, 90, 90, 0.23);
          color: #ffb1b1;
          background: rgba(255, 76, 76, 0.07);
        }

        .errors-box ul {
          margin: 7px 0 0;
          padding-right: 20px;
        }

        .direction-badge {
          padding: 7px 13px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .direction-badge.buy {
          color: #71e2aa;
          background: rgba(45, 196, 125, 0.12);
        }

        .direction-badge.sell {
          color: #ff9898;
          background: rgba(239, 82, 82, 0.12);
        }

        .main-result {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 190px;
          margin-bottom: 18px;
          border: 1px solid rgba(221, 177, 78, 0.16);
          border-radius: 18px;
          text-align: center;
          background: rgba(218, 173, 73, 0.045);
        }

        .main-result span {
          color: #aeb1b8;
          font-size: 14px;
        }

        .main-result strong {
          margin: 7px 0 1px;
          color: #e7bd5e;
          font-size: clamp(38px, 5vw, 53px);
          line-height: 1.2;
        }

        .main-result small {
          color: #7f838c;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }

        .result-item {
          min-width: 0;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 14px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.025);
        }

        .result-item span,
        .result-item strong {
          display: block;
        }

        .result-item span {
          margin-bottom: 7px;
          color: #858a93;
          font-size: 12px;
        }

        .result-item strong {
          overflow-wrap: anywhere;
          color: #f1f2f4;
          font-size: 16px;
        }

        .result-item .loss-value {
          color: #ff8b8b;
        }

        .result-item .profit-value {
          color: #70dda7;
        }

        .formula-box {
          margin-top: 18px;
          border-right: 3px solid #c89e43;
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.025);
        }

        .formula-box strong {
          color: #ddb65d;
          font-size: 13px;
        }

        .formula-box p {
          margin: 5px 0 0;
          color: #888d95;
          font-size: 12px;
          line-height: 1.7;
        }

        .information-section {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 22px;
        }

        .information-card {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          padding: 21px;
          background: rgba(14, 17, 21, 0.7);
        }

        .information-icon {
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          border-radius: 12px;
          background: rgba(215, 172, 75, 0.1);
          font-size: 20px;
        }

        .information-card h2 {
          margin: 0 0 7px;
          color: #e8e9eb;
          font-size: 16px;
        }

        .information-card p {
          margin: 0;
          color: #8d9199;
          font-size: 13px;
          line-height: 1.8;
        }

        @media (max-width: 900px) {
          .calculator-layout {
            grid-template-columns: 1fr;
          }

          .results-card {
            order: 2;
          }
        }

        @media (max-width: 650px) {
          .risk-page {
            padding: 20px 13px 40px;
          }

          .top-navigation {
            margin-bottom: 45px;
          }

          .hero-section {
            margin-bottom: 30px;
          }

          .hero-section p {
            font-size: 15px;
          }

          .calculator-card,
          .results-card {
            padding: 20px 15px;
            border-radius: 19px;
          }

          .form-grid,
          .information-section {
            grid-template-columns: 1fr;
          }

          .full-width {
            grid-column: auto;
          }

          .card-heading {
            align-items: flex-start;
          }
        }

        @media (max-width: 390px) {
          .brand-name {
            font-size: 17px;
          }

          .home-link {
            font-size: 13px;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
