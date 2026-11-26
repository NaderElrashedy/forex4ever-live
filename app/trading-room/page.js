"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./trading-room.module.css";

const checklistItems = [
  "حددت الاتجاه العام للسوق",
  "لدي منطقة دخول واضحة",
  "وضعت وقف خسارة منطقي",
  "راجعت الأخبار الاقتصادية",
  "الصفقة متوافقة مع خطتي",
  "أنا مستعد لتقبّل الخسارة دون انتقام",
];

const marketSessions = [
  {
    name: "سيدني",
    city: "Sydney",
    openUTC: 21,
    closeUTC: 6,
    icon: "◈",
    color: "#42d9ff",
  },
  {
    name: "طوكيو",
    city: "Tokyo",
    openUTC: 0,
    closeUTC: 9,
    icon: "◆",
    color: "#a78bfa",
  },
  {
    name: "لندن",
    city: "London",
    openUTC: 7,
    closeUTC: 16,
    icon: "▲",
    color: "#f6c85f",
  },
  {
    name: "نيويورك",
    city: "New York",
    openUTC: 13,
    closeUTC: 22,
    icon: "●",
    color: "#48e0a4",
  },
];

const backgroundCandles = [
  { x: 4, y: 30, h: 72, body: 30, delay: 0.2, type: "up" },
  { x: 10, y: 45, h: 95, body: 42, delay: 1.1, type: "down" },
  { x: 16, y: 22, h: 80, body: 36, delay: 0.5, type: "up" },
  { x: 22, y: 48, h: 108, body: 48, delay: 1.7, type: "up" },
  { x: 28, y: 35, h: 70, body: 26, delay: 0.8, type: "down" },
  { x: 34, y: 18, h: 120, body: 55, delay: 2.1, type: "up" },
  { x: 40, y: 42, h: 84, body: 32, delay: 1.4, type: "down" },
  { x: 46, y: 28, h: 106, body: 46, delay: 0.3, type: "up" },
  { x: 52, y: 52, h: 78, body: 30, delay: 1.9, type: "down" },
  { x: 58, y: 24, h: 116, body: 52, delay: 0.7, type: "up" },
  { x: 64, y: 38, h: 92, body: 40, delay: 2.4, type: "up" },
  { x: 70, y: 17, h: 76, body: 28, delay: 1.2, type: "down" },
  { x: 76, y: 46, h: 112, body: 50, delay: 0.6, type: "up" },
  { x: 82, y: 27, h: 88, body: 34, delay: 1.6, type: "down" },
  { x: 88, y: 41, h: 105, body: 44, delay: 2.2, type: "up" },
  { x: 94, y: 21, h: 82, body: 31, delay: 0.9, type: "up" },
];

const initialPlan = {
  asset: "",
  direction: "شراء",
  reason: "",
  invalidation: "",
  notes: "",
};

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return "0.00";

  return new Intl.NumberFormat("ar-EG", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function getSessionState(session, date) {
  if (!date) {
    return {
      isOpen: false,
      progress: 0,
    };
  }

  const current =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600;

  const { openUTC, closeUTC } = session;

  if (openUTC < closeUTC) {
    const isOpen = current >= openUTC && current < closeUTC;
    const duration = closeUTC - openUTC;
    const progress = isOpen ? ((current - openUTC) / duration) * 100 : 0;

    return { isOpen, progress };
  }

  const isOpen = current >= openUTC || current < closeUTC;
  const duration = 24 - openUTC + closeUTC;

  let elapsed = 0;

  if (isOpen) {
    elapsed =
      current >= openUTC
        ? current - openUTC
        : 24 - openUTC + current;
  }

  return {
    isOpen,
    progress: isOpen ? (elapsed / duration) * 100 : 0,
  };
}

export default function TradingRoomPage() {
  const [balance, setBalance] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [entry, setEntry] = useState(2350);
  const [stop, setStop] = useState(2335);
  const [target, setTarget] = useState(2380);

  const [trend, setTrend] = useState("");
  const [emotion, setEmotion] = useState("هادئ");
  const [checklist, setChecklist] = useState(
    checklistItems.map(() => false)
  );

  const [currentTime, setCurrentTime] = useState(null);
  const [plan, setPlan] = useState(initialPlan);
  const [saveMessage, setSaveMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    try {
      const savedPlan = localStorage.getItem("forex4ever-trading-plan");

      if (savedPlan) {
        setPlan(JSON.parse(savedPlan));
      }
    } catch (error) {
      console.warn("تعذر تحميل الخطة المحفوظة:", error);
    }

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entryItem) => {
          if (entryItem.isIntersecting) {
            entryItem.target.classList.add(styles.visible);
            observer.unobserve(entryItem.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const calculations = useMemo(() => {
    const safeBalance = Math.max(Number(balance) || 0, 0);
    const safeRisk = Math.max(Number(riskPercent) || 0, 0);
    const safeEntry = Number(entry) || 0;
    const safeStop = Number(stop) || 0;
    const safeTarget = Number(target) || 0;

    const riskAmount = safeBalance * (safeRisk / 100);
    const stopDistance = Math.abs(safeEntry - safeStop);
    const rewardDistance = Math.abs(safeTarget - safeEntry);

    const riskReward =
      stopDistance > 0 ? rewardDistance / stopDistance : 0;

    const stopPercentage =
      safeEntry > 0 ? (stopDistance / safeEntry) * 100 : 0;

    return {
      riskAmount,
      stopDistance,
      rewardDistance,
      riskReward,
      stopPercentage,
    };
  }, [balance, riskPercent, entry, stop, target]);

  const completedChecks = checklist.filter(Boolean).length;

  const score = useMemo(() => {
    let result = 0;

    if (calculations.stopDistance > 0) result += 20;

    if (calculations.riskReward >= 2) {
      result += 25;
    } else if (calculations.riskReward >= 1.5) {
      result += 20;
    } else if (calculations.riskReward >= 1) {
      result += 12;
    }

    result += (completedChecks / checklistItems.length) * 35;

    if (trend) result += 10;

    if (emotion === "هادئ") {
      result += 10;
    } else if (emotion === "متردد") {
      result += 5;
    }

    return Math.min(Math.round(result), 100);
  }, [
    calculations.stopDistance,
    calculations.riskReward,
    completedChecks,
    trend,
    emotion,
  ]);

  const scoreStatus = useMemo(() => {
    if (score >= 85) {
      return {
        title: "انضباط قوي",
        text: "خطتك تبدو منظمة، لكن القرار النهائي مسؤوليتك.",
        color: "#48e0a4",
      };
    }

    if (score >= 65) {
      return {
        title: "تحتاج مراجعة بسيطة",
        text: "راجع العناصر غير المكتملة قبل اتخاذ القرار.",
        color: "#f6c85f",
      };
    }

    if (score >= 40) {
      return {
        title: "الخطة غير مكتملة",
        text: "لا تتعجل. ما زالت هناك نقاط مهمة تحتاج إلى تحديد.",
        color: "#ff9f43",
      };
    }

    return {
      title: "توقف وراجع قرارك",
      text: "الدخول دون خطة واضحة قد يعرّضك لمخاطر غير محسوبة.",
      color: "#ff5f6d",
    };
  }, [score]);

  const emotionalWarning =
    emotion === "غاضب" ||
    emotion === "أحاول تعويض خسارة" ||
    emotion === "متحمس جدًا";

  const riskWarning = Number(riskPercent) > 2;

  const formattedClock = mounted
    ? new Intl.DateTimeFormat("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(currentTime)
    : "--:--:--";

  const formattedDate = mounted
    ? new Intl.DateTimeFormat("ar-EG", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(currentTime)
    : "جاري تحميل التاريخ";

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();

    event.currentTarget.style.setProperty(
      "--mouse-x",
      `${event.clientX - rect.left}px`
    );

    event.currentTarget.style.setProperty(
      "--mouse-y",
      `${event.clientY - rect.top}px`
    );
  }

  function toggleChecklist(index) {
    setChecklist((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? !item : item
      )
    );
  }

  function updatePlan(field, value) {
    setPlan((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function savePlan() {
    try {
      localStorage.setItem(
        "forex4ever-trading-plan",
        JSON.stringify(plan)
      );

      setSaveMessage("تم حفظ خطة الصفقة على جهازك بنجاح ✓");

      setTimeout(() => {
        setSaveMessage("");
      }, 3500);
    } catch (error) {
      setSaveMessage("تعذر حفظ الخطة على هذا الجهاز.");
    }
  }

  function clearPlan() {
    setPlan(initialPlan);

    try {
      localStorage.removeItem("forex4ever-trading-plan");
    } catch (error) {
      console.warn("تعذر حذف الخطة:", error);
    }

    setSaveMessage("تم مسح الخطة المحفوظة.");

    setTimeout(() => {
      setSaveMessage("");
    }, 2500);
  }

  return (
    <main
      className={styles.page}
      onMouseMove={handleMouseMove}
      dir="rtl"
    >
      <div className={styles.mouseGlow} />

      <div className={styles.gridBackground} />
      <div className={styles.noise} />
      <div className={styles.orbOne} />
      <div className={styles.orbTwo} />
      <div className={styles.orbThree} />

      <div className={styles.candles} aria-hidden="true">
        {backgroundCandles.map((candle, index) => (
          <span
            key={index}
            className={`${styles.candle} ${
              candle.type === "up" ? styles.candleUp : styles.candleDown
            }`}
            style={{
              "--x": `${candle.x}%`,
              "--y": `${candle.y}px`,
              "--height": `${candle.h}px`,
              "--body": `${candle.body}px`,
              "--delay": `${candle.delay}s`,
            }}
          />
        ))}
      </div>

      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.liveDot} />
          FOREX4EVER DECISION SYSTEM
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>غرفة قرار المتداول</p>

            <h1>
              لا تدخل السوق
              <span> قبل أن ترى قرارك بوضوح</span>
            </h1>

            <p className={styles.heroDescription}>
              حوّل فكرة التداول إلى خطة قابلة للقياس. احسب مخاطرتك،
              اختبر انضباطك، راقب حالتك النفسية ثم قرر بعقل لا بعاطفة.
            </p>

            <div className={styles.heroActions}>
              <a href="#decision-engine" className={styles.primaryButton}>
                <span>ابدأ تحليل الصفقة</span>
                <b>←</b>
              </a>

              <a href="#sessions" className={styles.secondaryButton}>
                جلسات الأسواق
              </a>
            </div>

            <div className={styles.heroStats}>
              <div>
                <strong>6</strong>
                <span>اختبارات انضباط</span>
              </div>

              <div>
                <strong>4</strong>
                <span>جلسات عالمية</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>تفاعلية</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.radarHalo} />
            <div className={styles.radarHaloTwo} />

            <div className={styles.terminalCard}>
              <div className={styles.terminalHeader}>
                <div>
                  <span className={styles.terminalDotRed} />
                  <span className={styles.terminalDotYellow} />
                  <span className={styles.terminalDotGreen} />
                </div>

                <span>DECISION TERMINAL</span>
              </div>

              <div className={styles.terminalChart}>
                <svg
                  viewBox="0 0 600 240"
                  role="img"
                  aria-label="رسم توضيحي متحرك للسوق"
                >
                  <defs>
                    <linearGradient
                      id="chartGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#f6c85f"
                        stopOpacity="0.5"
                      />
                      <stop
                        offset="100%"
                        stopColor="#f6c85f"
                        stopOpacity="0"
                      />
                    </linearGradient>

                    <filter id="chartGlow">
                      <feGaussianBlur
                        stdDeviation="4"
                        result="coloredBlur"
                      />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <path
                    className={styles.chartArea}
                    d="M0 205 L35 190 L70 200 L105 160 L140 172 L175 130 L210 145 L245 105 L280 120 L315 72 L350 98 L385 62 L420 80 L455 42 L490 65 L525 30 L565 48 L600 18 L600 240 L0 240 Z"
                    fill="url(#chartGradient)"
                  />

                  <path
                    className={styles.chartLine}
                    d="M0 205 L35 190 L70 200 L105 160 L140 172 L175 130 L210 145 L245 105 L280 120 L315 72 L350 98 L385 62 L420 80 L455 42 L490 65 L525 30 L565 48 L600 18"
                    fill="none"
                    stroke="#f6c85f"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#chartGlow)"
                  />
                </svg>

                <div className={styles.chartScan} />
              </div>

              <div className={styles.terminalMetrics}>
                <div>
                  <span>حالة النظام</span>
                  <strong className={styles.positiveText}>جاهز</strong>
                </div>

                <div>
                  <span>التحليل</span>
                  <strong>تفاعلي</strong>
                </div>

                <div>
                  <span>القرار</span>
                  <strong className={styles.goldText}>لك وحدك</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <span />
          مرّر لاكتشاف غرفة القرار
        </div>
      </section>

      <section
        id="decision-engine"
        className={styles.section}
        data-reveal
      >
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.sectionNumber}>01</span>
            <p>محرك القرار</p>
            <h2>ضع أرقام الصفقة أمامك</h2>
          </div>

          <p>
            أدخل بياناتك الأساسية ليتم حساب المخاطرة والعائد بصورة
            تقديرية قبل اتخاذ أي قرار.
          </p>
        </div>

        <div className={styles.decisionGrid}>
          <div className={styles.glassCard}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.cardIcon}>⌁</span>
                <div>
                  <p>Risk Engine</p>
                  <h3>حاسبة المخاطر</h3>
                </div>
              </div>

              <span className={styles.systemOnline}>
                <i />
                نشط
              </span>
            </div>

            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>رصيد الحساب</span>
                <div className={styles.inputShell}>
                  <input
                    type="number"
                    min="0"
                    value={balance}
                    onChange={(event) => setBalance(event.target.value)}
                  />
                  <b>$</b>
                </div>
              </label>

              <label className={styles.field}>
                <span>نسبة المخاطرة</span>
                <div className={styles.inputShell}>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={riskPercent}
                    onChange={(event) =>
                      setRiskPercent(event.target.value)
                    }
                  />
                  <b>%</b>
                </div>
              </label>

              <label className={styles.field}>
                <span>سعر الدخول</span>
                <div className={styles.inputShell}>
                  <input
                    type="number"
                    step="any"
                    value={entry}
                    onChange={(event) => setEntry(event.target.value)}
                  />
                  <b>IN</b>
                </div>
              </label>

              <label className={styles.field}>
                <span>وقف الخسارة</span>
                <div className={styles.inputShell}>
                  <input
                    type="number"
                    step="any"
                    value={stop}
                    onChange={(event) => setStop(event.target.value)}
                  />
                  <b>SL</b>
                </div>
              </label>

              <label className={`${styles.field} ${styles.fullField}`}>
                <span>الهدف المتوقع</span>
                <div className={styles.inputShell}>
                  <input
                    type="number"
                    step="any"
                    value={target}
                    onChange={(event) => setTarget(event.target.value)}
                  />
                  <b>TP</b>
                </div>
              </label>
            </div>

            {riskWarning && (
              <div className={styles.warningBox}>
                <span>!</span>
                <p>
                  نسبة المخاطرة المدخلة تتجاوز 2%. تأكد أن هذه النسبة
                  مناسبة لخطة إدارة رأس مالك.
                </p>
              </div>
            )}
          </div>

          <div className={styles.resultsPanel}>
            <div className={styles.resultMain}>
              <span>المبلغ المعرّض للمخاطرة</span>

              <strong>
                {formatNumber(calculations.riskAmount)}
                <small>$</small>
              </strong>

              <div className={styles.pulseLine}>
                <i />
              </div>
            </div>

            <div className={styles.resultCards}>
              <div>
                <span>مسافة الوقف</span>
                <strong>
                  {formatNumber(calculations.stopDistance, 4)}
                </strong>
              </div>

              <div>
                <span>مسافة الهدف</span>
                <strong>
                  {formatNumber(calculations.rewardDistance, 4)}
                </strong>
              </div>

              <div>
                <span>نسبة الوقف</span>
                <strong>
                  {formatNumber(calculations.stopPercentage)}%
                </strong>
              </div>

              <div className={styles.highlightResult}>
                <span>العائد للمخاطرة</span>
                <strong>
                  1 : {formatNumber(calculations.riskReward)}
                </strong>
              </div>
            </div>

            <p className={styles.calculatorNote}>
              هذه الحسابات تقديرية ولا تحسب حجم العقد؛ لأن قيمة النقطة
              ومواصفات العقود تختلف حسب الأصل وشركة الوساطة.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section} data-reveal>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.sectionNumber}>02</span>
            <p>اختبار الانضباط</p>
            <h2>هل الصفقة تستحق الدخول؟</h2>
          </div>

          <p>
            اكمل قائمة الفحص وحدد اتجاهك وحالتك النفسية، وسيتم تحديث
            مؤشر جودة الخطة مباشرة.
          </p>
        </div>

        <div className={styles.qualityGrid}>
          <div className={styles.scoreCard}>
            <div
              className={styles.scoreRing}
              style={{
                "--score": score,
                "--score-color": scoreStatus.color,
              }}
            >
              <div className={styles.scoreRingInner}>
                <span>جودة الخطة</span>
                <strong>{score}</strong>
                <small>/ 100</small>
              </div>
            </div>

            <div className={styles.scoreText}>
              <span
                className={styles.scoreSignal}
                style={{ backgroundColor: scoreStatus.color }}
              />

              <div>
                <h3 style={{ color: scoreStatus.color }}>
                  {scoreStatus.title}
                </h3>
                <p>{scoreStatus.text}</p>
              </div>
            </div>

            <div className={styles.scoreProgress}>
              <span>
                <i
                  style={{
                    width: `${score}%`,
                    backgroundColor: scoreStatus.color,
                  }}
                />
              </span>
            </div>
          </div>

          <div className={styles.checklistCard}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.cardIcon}>✓</span>
                <div>
                  <p>Discipline Check</p>
                  <h3>قائمة ما قبل التداول</h3>
                </div>
              </div>

              <b className={styles.completedCount}>
                {completedChecks}/{checklistItems.length}
              </b>
            </div>

            <div className={styles.checklist}>
              {checklistItems.map((item, index) => (
                <button
                  type="button"
                  key={item}
                  className={`${styles.checkItem} ${
                    checklist[index] ? styles.checkedItem : ""
                  }`}
                  onClick={() => toggleChecklist(index)}
                >
                  <span className={styles.customCheckbox}>
                    {checklist[index] ? "✓" : ""}
                  </span>

                  <p>{item}</p>

                  <small>{String(index + 1).padStart(2, "0")}</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.mindGrid}>
          <div className={styles.mindCard}>
            <span className={styles.miniLabel}>اتجاه التحليل</span>
            <h3>ما هو اتجاهك الواضح؟</h3>

            <div className={styles.choiceGroup}>
              {["صاعد", "هابط", "عرضي"].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setTrend(item)}
                  className={trend === item ? styles.activeChoice : ""}
                >
                  <span>
                    {item === "صاعد"
                      ? "↗"
                      : item === "هابط"
                      ? "↘"
                      : "↔"}
                  </span>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.mindCard}>
            <span className={styles.miniLabel}>الحالة النفسية</span>
            <h3>كيف تشعر قبل الصفقة؟</h3>

            <select
              className={styles.emotionSelect}
              value={emotion}
              onChange={(event) => setEmotion(event.target.value)}
            >
              <option>هادئ</option>
              <option>متردد</option>
              <option>متحمس جدًا</option>
              <option>خائف</option>
              <option>غاضب</option>
              <option>أحاول تعويض خسارة</option>
            </select>
          </div>
        </div>

        {emotionalWarning && (
          <div className={styles.emotionalAlert}>
            <div className={styles.alertPulse}>!</div>

            <div>
              <span>تنبيه نفسي</span>
              <h3>التوقف الآن قد يكون أفضل قرار تداول تتخذه اليوم.</h3>
              <p>
                القرارات الناتجة عن الغضب أو الحماس الزائد أو محاولة
                تعويض الخسارة قد لا تكون متوافقة مع خطتك.
              </p>
            </div>
          </div>
        )}
      </section>

      <section
        id="sessions"
        className={styles.section}
        data-reveal
      >
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.sectionNumber}>03</span>
            <p>نبض الأسواق</p>
            <h2>الجلسات العالمية</h2>
          </div>

          <div className={styles.liveClock}>
            <span>{formattedDate}</span>
            <strong>{formattedClock}</strong>
            <small>توقيت جهازك</small>
          </div>
        </div>

        <div className={styles.sessionsGrid}>
          {marketSessions.map((session) => {
            const sessionState = getSessionState(
              session,
              currentTime
            );

            return (
              <article
                className={`${styles.sessionCard} ${
                  sessionState.isOpen ? styles.openSession : ""
                }`}
                key={session.name}
                style={{ "--session-color": session.color }}
              >
                <div className={styles.sessionGlow} />

                <div className={styles.sessionTop}>
                  <span className={styles.sessionIcon}>
                    {session.icon}
                  </span>

                  <span
                    className={
                      sessionState.isOpen
                        ? styles.openBadge
                        : styles.closedBadge
                    }
                  >
                    <i />
                    {sessionState.isOpen ? "مفتوحة" : "مغلقة"}
                  </span>
                </div>

                <div className={styles.sessionName}>
                  <p>{session.city}</p>
                  <h3>{session.name}</h3>
                </div>

                <div className={styles.sessionHours}>
                  <span>
                    {String(session.openUTC).padStart(2, "0")}:00
                  </span>
                  <i>→</i>
                  <span>
                    {String(session.closeUTC).padStart(2, "0")}:00
                  </span>
                  <small>UTC</small>
                </div>

                <div className={styles.sessionProgress}>
                  <span>
                    <i
                      style={{
                        width: `${sessionState.progress}%`,
                      }}
                    />
                  </span>

                  <small>
                    {sessionState.isOpen
                      ? "الجلسة نشطة الآن"
                      : "في انتظار الافتتاح"}
                  </small>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.sessionsNotice}>
          <span>i</span>
          <p>
            مواعيد الجلسات المعروضة تقريبية بتوقيت UTC، وقد تتغير بسبب
            التوقيت الصيفي والعطلات الرسمية واختلاف ساعات تداول كل أصل.
          </p>
        </div>
      </section>

      <section className={styles.section} data-reveal>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.sectionNumber}>04</span>
            <p>سجل القرار</p>
            <h2>اكتب خطتك قبل تنفيذها</h2>
          </div>

          <p>
            يتم حفظ الخطة محليًا على جهازك فقط، ولا يتم إرسالها إلى
            قاعدة بيانات أو مشاركتها مع أي جهة.
          </p>
        </div>

        <div className={styles.planContainer}>
          <div className={styles.planVisual}>
            <span className={styles.planOrbit} />
            <span className={styles.planOrbitTwo} />

            <div className={styles.planCore}>
              <span>PLAN</span>
              <strong>01</strong>
              <small>وضوح قبل التنفيذ</small>
            </div>

            <div className={styles.floatingDataOne}>
              <span>RISK</span>
              <strong>{formatNumber(Number(riskPercent) || 0)}%</strong>
            </div>

            <div className={styles.floatingDataTwo}>
              <span>SCORE</span>
              <strong>{score}</strong>
            </div>

            <div className={styles.floatingDataThree}>
              <span>R:R</span>
              <strong>
                1:{formatNumber(calculations.riskReward)}
              </strong>
            </div>
          </div>

          <div className={styles.planForm}>
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>الأصل أو السوق</span>
                <div className={styles.inputShell}>
                  <input
                    type="text"
                    value={plan.asset}
                    placeholder="مثال: الذهب أو EUR/USD"
                    onChange={(event) =>
                      updatePlan("asset", event.target.value)
                    }
                  />
                  <b>⌕</b>
                </div>
              </label>

              <label className={styles.field}>
                <span>نوع الصفقة</span>
                <select
                  value={plan.direction}
                  onChange={(event) =>
                    updatePlan("direction", event.target.value)
                  }
                >
                  <option>شراء</option>
                  <option>بيع</option>
                  <option>مراقبة فقط</option>
                </select>
              </label>

              <label className={`${styles.field} ${styles.fullField}`}>
                <span>سبب الدخول</span>
                <textarea
                  value={plan.reason}
                  placeholder="ما السبب الفني أو الأساسي وراء هذه الفكرة؟"
                  onChange={(event) =>
                    updatePlan("reason", event.target.value)
                  }
                />
              </label>

              <label className={`${styles.field} ${styles.fullField}`}>
                <span>متى تصبح الفكرة غير صالحة؟</span>
                <input
                  type="text"
                  value={plan.invalidation}
                  placeholder="حدد نقطة إلغاء الفكرة بوضوح"
                  onChange={(event) =>
                    updatePlan("invalidation", event.target.value)
                  }
                />
              </label>

              <label className={`${styles.field} ${styles.fullField}`}>
                <span>ملاحظات إضافية</span>
                <textarea
                  value={plan.notes}
                  placeholder="سجّل أي ملاحظات تريد الرجوع إليها لاحقًا"
                  onChange={(event) =>
                    updatePlan("notes", event.target.value)
                  }
                />
              </label>
            </div>

            <div className={styles.planActions}>
              <button
                type="button"
                className={styles.saveButton}
                onClick={savePlan}
              >
                <span>حفظ الخطة على الجهاز</span>
                <b>✓</b>
              </button>

              <button
                type="button"
                className={styles.clearButton}
                onClick={clearPlan}
              >
                مسح الخطة
              </button>
            </div>

            {saveMessage && (
              <div className={styles.saveMessage}>{saveMessage}</div>
            )}
          </div>
        </div>
      </section>

      <section className={styles.finalSection} data-reveal>
        <div className={styles.finalGlow} />

        <span className={styles.finalIcon}>F4E</span>

        <p>FOREX4EVER TRADING DISCIPLINE</p>

        <h2>
          أفضل صفقة ليست دائمًا التي تدخلها،
          <span> بل أحيانًا التي تقرر تجنبها.</span>
        </h2>

        <a href="#decision-engine">أعد تقييم قرارك ↑</a>

        <div className={styles.disclaimer}>
          <strong>تنبيه مخاطر:</strong>
          هذه الصفحة أداة تعليمية وتنظيمية فقط، ولا تقدم توصية شراء أو
          بيع ولا تضمن نتائج أو أرباحًا. التداول ينطوي على مخاطر وقد
          يؤدي إلى خسارة رأس المال. تحمّل مسؤولية قراراتك واستعن بجهة
          مالية مؤهلة عند الحاجة.
        </div>
      </section>
    </main>
  );
}
