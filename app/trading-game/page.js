"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./trading-game.module.css";

const STORAGE_KEY = "forex4ever-trading-adventure";

const levels = [
  {
    id: 1,
    title: "بوابة السوق",
    subtitle: "الشراء والبيع ببساطة",
    icon: "🚪",
    color: "#42d9ff",
    xp: 100,
    badge: {
      id: "market-starter",
      name: "مستكشف السوق",
      icon: "🧭",
    },
    lesson:
      "الشراء يعني أنك تتوقع ارتفاع السعر، والبيع يعني أنك تتوقع انخفاضه. لكن لا يوجد قرار مضمون.",
    mission:
      "السعر يتحرك في اتجاه صاعد، لكنك لم تحدد وقف الخسارة بعد. ما القرار الأكثر انضباطًا؟",
    hint: "لا يكفي أن تتوقع الاتجاه؛ يجب أن تعرف أين تخرج إذا كنت مخطئًا.",
    correctAnswer: "wait",
    answers: [
      {
        id: "buy",
        label: "شراء فورًا",
        icon: "📈",
        explanation:
          "الاتجاه صاعد، لكن الدخول دون تحديد وقف خسارة يجعل القرار غير مكتمل.",
      },
      {
        id: "sell",
        label: "بيع فورًا",
        icon: "📉",
        explanation:
          "البيع عكس الاتجاه الحالي يحتاج إلى سبب واضح، وهو غير موجود في هذا السيناريو.",
      },
      {
        id: "wait",
        label: "أنتظر وأحدد خطتي",
        icon: "🛡️",
        explanation:
          "ممتاز! الانتظار حتى تحديد الدخول ووقف الخسارة قرار أكثر انضباطًا.",
      },
    ],
    candles: [
      [18, 25, 30, 12],
      [25, 22, 31, 18],
      [22, 35, 40, 19],
      [35, 42, 48, 30],
      [42, 38, 50, 34],
      [38, 51, 56, 36],
      [51, 62, 67, 47],
      [62, 58, 70, 54],
      [58, 72, 78, 56],
      [72, 80, 86, 68],
    ],
  },
  {
    id: 2,
    title: "وادي الانتظار",
    subtitle: "ليس كل تحرك فرصة",
    icon: "⏳",
    color: "#a78bfa",
    xp: 120,
    badge: {
      id: "waiting-master",
      name: "سيّد الانتظار",
      icon: "⏳",
    },
    lesson:
      "المتداول المنضبط لا يدخل كل حركة. أحيانًا يكون الانتظار أفضل قرار يمكن اتخاذه.",
    mission:
      "السعر يتحرك بعشوائية شديدة، والشموع تتبدل سريعًا دون اتجاه واضح. ماذا تفعل؟",
    hint: "عدم وجود فرصة واضحة هو سبب كافٍ لعدم الدخول.",
    correctAnswer: "wait",
    answers: [
      {
        id: "buy",
        label: "أشتري بسبب آخر شمعة",
        icon: "🟢",
        explanation:
          "شمعة واحدة لا تكفي لتحديد الاتجاه، خصوصًا داخل سوق عشوائي.",
      },
      {
        id: "sell",
        label: "أبيع بسبب الخوف",
        icon: "🔴",
        explanation:
          "الخوف ليس خطة تداول، والقرار العاطفي قد يؤدي إلى أخطاء متكررة.",
      },
      {
        id: "wait",
        label: "أنتظر اتجاهًا واضحًا",
        icon: "👀",
        explanation:
          "رائع! الحفاظ على رأس المال أفضل من الدخول في فرصة غير واضحة.",
      },
    ],
    candles: [
      [45, 55, 64, 39],
      [55, 43, 61, 36],
      [43, 57, 65, 38],
      [57, 48, 66, 41],
      [48, 52, 62, 40],
      [52, 44, 60, 35],
      [44, 58, 67, 39],
      [58, 47, 65, 40],
      [47, 54, 62, 42],
      [54, 49, 64, 41],
    ],
  },
  {
    id: 3,
    title: "درع وقف الخسارة",
    subtitle: "احمِ خطتك",
    icon: "🛡️",
    color: "#48e0a4",
    xp: 140,
    badge: {
      id: "capital-guardian",
      name: "حامي رأس المال",
      icon: "🛡️",
    },
    lesson:
      "وقف الخسارة نقطة تحددها قبل الدخول، للخروج إذا تحرك السعر عكس توقعك.",
    mission:
      "قررت الشراء من منطقة دعم. أين يجب وضع وقف الخسارة بشكل منطقي؟",
    hint: "وقف الخسارة لا يوضع عشوائيًا ولا بعيدًا جدًا لمجرد تجنب الخسارة.",
    correctAnswer: "below-support",
    answers: [
      {
        id: "no-stop",
        label: "لن أضع وقف خسارة",
        icon: "⚠️",
        explanation:
          "عدم استخدام خطة واضحة للخروج قد يحول خطأ صغيرًا إلى خسارة أكبر.",
      },
      {
        id: "below-support",
        label: "أسفل منطقة الدعم",
        icon: "🛡️",
        explanation:
          "صحيح! كسر الدعم قد يعني أن فكرة الشراء لم تعد صالحة.",
      },
      {
        id: "very-far",
        label: "بعيد جدًا عن نقطة الدخول",
        icon: "🌪️",
        explanation:
          "الوقف البعيد جدًا قد يزيد حجم الخسارة ولا يعكس سببًا فنيًا واضحًا.",
      },
    ],
    candles: [
      [70, 64, 75, 60],
      [64, 56, 68, 51],
      [56, 49, 61, 44],
      [49, 42, 53, 37],
      [42, 46, 51, 38],
      [46, 53, 58, 42],
      [53, 61, 66, 49],
      [61, 68, 73, 57],
      [68, 74, 80, 64],
      [74, 81, 87, 70],
    ],
  },
  {
    id: 4,
    title: "جسر إدارة المخاطر",
    subtitle: "الخسارة الصغيرة أفضل",
    icon: "🌉",
    color: "#f6c85f",
    xp: 160,
    badge: {
      id: "risk-keeper",
      name: "حارس المخاطر",
      icon: "⚖️",
    },
    lesson:
      "إدارة المخاطر تعني ألا تضع جزءًا كبيرًا من رصيدك في قرار واحد، مهما بدت الفرصة قوية.",
    mission:
      "لديك 10,000 عملة تعليمية. ما نسبة المخاطرة الأكثر تحفظًا في قرار واحد؟",
    hint: "المتعلم المنضبط يفكر أولًا في حماية رصيده، وليس في الربح السريع.",
    correctAnswer: "one-percent",
    answers: [
      {
        id: "fifty-percent",
        label: "50% من الرصيد",
        icon: "💥",
        explanation:
          "هذه مخاطرة شديدة جدًا، وقد تؤدي إلى فقدان جزء كبير من الرصيد سريعًا.",
      },
      {
        id: "twenty-percent",
        label: "20% من الرصيد",
        icon: "🔥",
        explanation:
          "ما زالت نسبة مرتفعة جدًا بالنسبة إلى قرار واحد.",
      },
      {
        id: "one-percent",
        label: "نسبة صغيرة مثل 1%",
        icon: "⚖️",
        explanation:
          "أحسنت! استخدام نسبة صغيرة يساعد على البقاء والتعلم من عدة تجارب.",
      },
    ],
    candles: [
      [22, 28, 33, 18],
      [28, 36, 41, 24],
      [36, 31, 43, 27],
      [31, 45, 50, 29],
      [45, 54, 60, 41],
      [54, 48, 62, 44],
      [48, 63, 68, 46],
      [63, 70, 76, 59],
      [70, 65, 78, 61],
      [65, 82, 88, 62],
    ],
  },
  {
    id: 5,
    title: "قلعة الدعم والمقاومة",
    subtitle: "افهم مناطق السعر",
    icon: "🏰",
    color: "#ff9f43",
    xp: 180,
    badge: {
      id: "level-hunter",
      name: "صائد المناطق",
      icon: "🏰",
    },
    lesson:
      "الدعم منطقة ظهر عندها المشترون سابقًا، والمقاومة منطقة ظهر عندها البائعون. هي مناطق وليست خطوطًا مضمونة.",
    mission:
      "وصل السعر إلى مقاومة واضحة وتوقف عن الصعود، ولا توجد إشارة اختراق مؤكدة. ماذا تفعل؟",
    hint: "الوصول إلى المقاومة لا يعني البيع تلقائيًا، والاختراق غير المؤكد لا يعني الشراء.",
    correctAnswer: "observe",
    answers: [
      {
        id: "buy-fast",
        label: "أشتري قبل الاختراق",
        icon: "🚀",
        explanation:
          "الشراء قبل تأكيد الاختراق قد يعرضك لارتداد السعر من المقاومة.",
      },
      {
        id: "sell-blind",
        label: "أبيع بلا خطة",
        icon: "⬇️",
        explanation:
          "وجود مقاومة وحده لا يكفي للبيع دون تأكيد ووقف خسارة وخطة.",
      },
      {
        id: "observe",
        label: "أراقب التأكيد أولًا",
        icon: "🔍",
        explanation:
          "ممتاز! تنتظر الاختراق أو الارتداد الواضح قبل بناء خطة تعليمية.",
      },
    ],
    candles: [
      [25, 34, 39, 20],
      [34, 45, 50, 30],
      [45, 55, 61, 41],
      [55, 66, 72, 51],
      [66, 76, 82, 62],
      [76, 71, 84, 67],
      [71, 78, 83, 68],
      [78, 73, 84, 69],
      [73, 79, 83, 70],
      [79, 75, 85, 71],
    ],
  },
  {
    id: 6,
    title: "عرش المتداول المنضبط",
    subtitle: "التحدي النهائي",
    icon: "👑",
    color: "#ff5f6d",
    xp: 300,
    badge: {
      id: "disciplined-trader",
      name: "المتداول المنضبط",
      icon: "👑",
    },
    lesson:
      "النتيجة الجيدة لا تجعل القرار الخاطئ صحيحًا، والنتيجة السيئة لا تجعل الخطة المنضبطة خاطئة.",
    mission:
      "خسرت محاولتين متتاليتين وفق خطتك. تشعر بالغضب وتريد مضاعفة المخاطرة لتعويض الخسارة. ماذا تفعل؟",
    hint: "محاولة الانتقام من السوق من أخطر القرارات العاطفية.",
    correctAnswer: "stop",
    answers: [
      {
        id: "double",
        label: "أضاعف المخاطرة",
        icon: "💣",
        explanation:
          "مضاعفة المخاطرة تحت تأثير الغضب قد تزيد الخسارة ولا تضمن التعويض.",
      },
      {
        id: "random",
        label: "أدخل صفقة عشوائية",
        icon: "🎲",
        explanation:
          "القرار العشوائي ليس تداولًا منضبطًا، حتى إذا حقق نتيجة جيدة بالصدفة.",
      },
      {
        id: "stop",
        label: "أتوقف وأراجع خطتي",
        icon: "🧘",
        explanation:
          "قرار ممتاز! التوقف عند التأثر العاطفي يحميك من التداول الانتقامي.",
      },
    ],
    candles: [
      [75, 67, 80, 62],
      [67, 58, 72, 53],
      [58, 64, 69, 54],
      [64, 51, 67, 46],
      [51, 43, 56, 38],
      [43, 48, 53, 39],
      [48, 39, 51, 34],
      [39, 45, 50, 35],
      [45, 37, 48, 31],
      [37, 42, 47, 33],
    ],
  },
];

const defaultProgress = {
  xp: 0,
  unlockedLevel: 1,
  completedLevels: [],
  badges: [],
};

export default function TradingGamePage() {
  const [progress, setProgress] = useState(defaultProgress);
  const [activeLevelId, setActiveLevelId] = useState(1);
  const [answerResult, setAnswerResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [robotMessage, setRobotMessage] = useState(
    "مرحبًا! أنا فوري، وسأرافقك في مغامرة تعلم التداول."
  );

  const activeLevel = useMemo(
    () => levels.find((level) => level.id === activeLevelId) || levels[0],
    [activeLevelId]
  );

  const completedCount = progress.completedLevels.length;
  const progressPercent = Math.round(
    (completedCount / levels.length) * 100
  );

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);

      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);

        setProgress({
          xp: Number(parsed.xp) || 0,
          unlockedLevel: Math.min(
            Math.max(Number(parsed.unlockedLevel) || 1, 1),
            levels.length
          ),
          completedLevels: Array.isArray(parsed.completedLevels)
            ? parsed.completedLevels
            : [],
          badges: Array.isArray(parsed.badges) ? parsed.badges : [],
        });
      }
    } catch (error) {
      console.error("Could not load game progress:", error);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Could not save game progress:", error);
    }
  }, [progress, isReady]);

  function openLevel(level) {
    if (level.id > progress.unlockedLevel) {
      setRobotMessage("هذا المستوى ما زال مغلقًا. أكمل المستوى السابق أولًا.");
      return;
    }

    setActiveLevelId(level.id);
    setAnswerResult(null);
    setShowHint(false);
    setRobotMessage(`مهمتك الآن: ${level.title}`);
  }

  function chooseAnswer(answer) {
    if (answerResult?.isCorrect) return;

    const isCorrect = answer.id === activeLevel.correctAnswer;

    setAnswerResult({
      selectedId: answer.id,
      isCorrect,
      explanation: answer.explanation,
    });

    if (!isCorrect) {
      setRobotMessage(
        "لا بأس! الأخطاء جزء من التعلم. اقرأ التفسير وحاول مرة أخرى."
      );
      return;
    }

    setRobotMessage("قرار منضبط! حصلت على نقاط خبرة وشارة جديدة.");

    setProgress((currentProgress) => {
      const alreadyCompleted =
        currentProgress.completedLevels.includes(activeLevel.id);

      if (alreadyCompleted) {
        return currentProgress;
      }

      const nextLevel = Math.min(activeLevel.id + 1, levels.length);

      return {
        xp: currentProgress.xp + activeLevel.xp,
        unlockedLevel: Math.max(
          currentProgress.unlockedLevel,
          nextLevel
        ),
        completedLevels: [
          ...currentProgress.completedLevels,
          activeLevel.id,
        ],
        badges: currentProgress.badges.includes(activeLevel.badge.id)
          ? currentProgress.badges
          : [...currentProgress.badges, activeLevel.badge.id],
      };
    });
  }

  function tryAgain() {
    setAnswerResult(null);
    setRobotMessage("ممتاز، فكّر بهدوء ثم اختر قرارك مرة أخرى.");
  }

  function goToNextLevel() {
    const nextLevelId = Math.min(activeLevel.id + 1, levels.length);

    setActiveLevelId(nextLevelId);
    setAnswerResult(null);
    setShowHint(false);

    if (activeLevel.id === levels.length) {
      setRobotMessage("أكملت المغامرة! أنت الآن بطل الانضباط.");
    } else {
      setRobotMessage("أحسنت! لنبدأ التحدي التالي.");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetGame() {
    const confirmed = window.confirm(
      "هل تريد حذف التقدم والبدء من المستوى الأول؟"
    );

    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEY);
    setProgress(defaultProgress);
    setActiveLevelId(1);
    setAnswerResult(null);
    setShowHint(false);
    setRobotMessage("بدأنا مغامرة جديدة. هيا نتعلم خطوة بخطوة!");
  }

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGrid} />
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />

      <div className={styles.stars} aria-hidden="true">
        {Array.from({ length: 28 }).map((_, index) => (
          <span
            key={index}
            style={{
              "--star-x": `${(index * 37) % 100}%`,
              "--star-y": `${(index * 61) % 100}%`,
              "--star-delay": `${(index % 8) * 0.4}s`,
            }}
          />
        ))}
      </div>

      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>F4E</span>

          <span>
            <strong>Forex4Ever</strong>
            <small>التعليم أولًا</small>
          </span>
        </Link>

        <nav className={styles.headerActions}>
          <Link href="/trading-room" className={styles.secondaryLink}>
            غرفة التداول
          </Link>

          <Link href="/" className={styles.homeLink}>
            الرئيسية
          </Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.liveDot} />
            مغامرة تعليمية تفاعلية
          </div>

          <h1>
            مغامرة
            <span> المتداول</span>
          </h1>

          <p>
            تعلّم الشراء والبيع وإدارة المخاطر من خلال تحديات بسيطة،
            دون أموال حقيقية ودون تعقيدات.
          </p>

          <div className={styles.heroStats}>
            <div>
              <span>⭐</span>
              <strong>{progress.xp}</strong>
              <small>نقطة خبرة</small>
            </div>

            <div>
              <span>🏆</span>
              <strong>
                {completedCount}/{levels.length}
              </strong>
              <small>مراحل مكتملة</small>
            </div>

            <div>
              <span>🎖️</span>
              <strong>{progress.badges.length}</strong>
              <small>شارات</small>
            </div>
          </div>
        </div>

        <div className={styles.robotScene}>
          <div className={styles.robotMessage}>{robotMessage}</div>

          <div className={styles.robot}>
            <div className={styles.antenna}>
              <span />
            </div>

            <div className={styles.robotHead}>
              <div className={styles.robotScreen}>
                <span className={styles.robotEye} />
                <span className={styles.robotEye} />
              </div>
            </div>

            <div className={styles.robotBody}>
              <span>F4E</span>
              <div className={styles.robotCore} />
            </div>

            <div className={styles.robotShadow} />
          </div>
        </div>
      </section>

      <section className={styles.progressSection}>
        <div className={styles.progressHeading}>
          <div>
            <span>تقدم المغامرة</span>
            <strong>{progressPercent}%</strong>
          </div>

          <button type="button" onClick={resetGame}>
            إعادة البداية
          </button>
        </div>

        <div className={styles.progressTrack}>
          <span style={{ width: `${progressPercent}%` }} />
        </div>
      </section>

      <section className={styles.mapSection}>
        <div className={styles.sectionTitle}>
          <span>🗺️</span>

          <div>
            <small>خريطة الرحلة</small>
            <h2>اختر مستواك</h2>
          </div>
        </div>

        <div className={styles.levelMap}>
          <div className={styles.mapLine} />

          {levels.map((level) => {
            const isLocked = level.id > progress.unlockedLevel;
            const isCompleted = progress.completedLevels.includes(level.id);
            const isActive = activeLevel.id === level.id;

            return (
              <button
                type="button"
                key={level.id}
                className={`${styles.levelNode} ${
                  isActive ? styles.activeNode : ""
                } ${isCompleted ? styles.completedNode : ""} ${
                  isLocked ? styles.lockedNode : ""
                }`}
                style={{ "--level-color": level.color }}
                onClick={() => openLevel(level)}
              >
                <span className={styles.levelNumber}>
                  {isLocked ? "🔒" : isCompleted ? "✓" : level.id}
                </span>

                <span className={styles.levelIcon}>{level.icon}</span>

                <strong>{level.title}</strong>
                <small>{level.subtitle}</small>
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.gameArena}>
        <div className={styles.arenaHeader}>
          <div>
            <span>
              المستوى {activeLevel.id} من {levels.length}
            </span>
            <h2>{activeLevel.title}</h2>
            <p>{activeLevel.subtitle}</p>
          </div>

          <div
            className={styles.levelReward}
            style={{ "--reward-color": activeLevel.color }}
          >
            <small>مكافأة المستوى</small>
            <strong>+{activeLevel.xp} XP</strong>
          </div>
        </div>

        <div className={styles.arenaGrid}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div>
                <span className={styles.chartStatus} />
                <strong>محاكاة تعليمية</strong>
              </div>

              <span>بيانات افتراضية</span>
            </div>

            <div className={styles.chart}>
              <div className={styles.chartGrid} />

              <div className={styles.priceLabels}>
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              <div className={styles.candles}>
                {activeLevel.candles.map((candle, index) => {
                  const [open, close, high, low] = candle;
                  const rising = close >= open;
                  const bodyBottom = Math.min(open, close);
                  const bodyHeight = Math.max(Math.abs(close - open), 4);

                  return (
                    <div
                      className={styles.candleColumn}
                      key={`${activeLevel.id}-${index}`}
                      style={{
                        "--candle-delay": `${index * 0.08}s`,
                      }}
                    >
                      <span
                        className={`${styles.wick} ${
                          rising ? styles.greenCandle : styles.redCandle
                        }`}
                        style={{
                          bottom: `${low}%`,
                          height: `${high - low}%`,
                        }}
                      />

                      <span
                        className={`${styles.candleBody} ${
                          rising ? styles.greenCandle : styles.redCandle
                        }`}
                        style={{
                          bottom: `${bodyBottom}%`,
                          height: `${bodyHeight}%`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              <div className={styles.chartScanner} />
            </div>

            <div className={styles.chartFooter}>
              <span>لا تمثل أسعارًا حقيقية</span>
              <span>للتعليم فقط</span>
            </div>
          </div>

          <div className={styles.missionCard}>
            <div className={styles.lessonBox}>
              <span>💡 درس سريع</span>
              <p>{activeLevel.lesson}</p>
            </div>

            <div className={styles.missionTitle}>
              <span>🎯</span>

              <div>
                <small>مهمتك</small>
                <h3>{activeLevel.mission}</h3>
              </div>
            </div>

            <div className={styles.answers}>
              {activeLevel.answers.map((answer) => {
                const isSelected =
                  answerResult?.selectedId === answer.id;
                const isCorrectAnswer =
                  answer.id === activeLevel.correctAnswer;

                let answerClass = "";

                if (answerResult && isSelected) {
                  answerClass = answerResult.isCorrect
                    ? styles.correctAnswer
                    : styles.wrongAnswer;
                }

                if (
                  answerResult?.isCorrect &&
                  isCorrectAnswer &&
                  !isSelected
                ) {
                  answerClass = styles.correctAnswer;
                }

                return (
                  <button
                    type="button"
                    key={answer.id}
                    className={`${styles.answerButton} ${answerClass}`}
                    onClick={() => chooseAnswer(answer)}
                    disabled={answerResult?.isCorrect}
                  >
                    <span>{answer.icon}</span>
                    <strong>{answer.label}</strong>
                    <small>اختيار</small>
                  </button>
                );
              })}
            </div>

            {!answerResult && (
              <button
                type="button"
                className={styles.hintButton}
                onClick={() => setShowHint((current) => !current)}
              >
                🧠 {showHint ? "إخفاء التلميح" : "أحتاج إلى تلميح"}
              </button>
            )}

            {showHint && !answerResult && (
              <div className={styles.hintBox}>{activeLevel.hint}</div>
            )}

            {answerResult && (
              <div
                className={`${styles.feedbackBox} ${
                  answerResult.isCorrect
                    ? styles.successFeedback
                    : styles.errorFeedback
                }`}
              >
                <div className={styles.feedbackIcon}>
                  {answerResult.isCorrect ? "🎉" : "🤔"}
                </div>

                <div>
                  <strong>
                    {answerResult.isCorrect
                      ? "قرار ممتاز!"
                      : "فكّر مرة أخرى"}
                  </strong>

                  <p>{answerResult.explanation}</p>
                </div>

                {answerResult.isCorrect ? (
                  <button type="button" onClick={goToNextLevel}>
                    {activeLevel.id === levels.length
                      ? "مشاهدة الإنجاز"
                      : "المستوى التالي"}
                  </button>
                ) : (
                  <button type="button" onClick={tryAgain}>
                    حاول مجددًا
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={styles.badgesSection}>
        <div className={styles.sectionTitle}>
          <span>🏆</span>

          <div>
            <small>قاعة الإنجازات</small>
            <h2>شارات المغامرة</h2>
          </div>
        </div>

        <div className={styles.badgesGrid}>
          {levels.map((level) => {
            const unlocked = progress.badges.includes(level.badge.id);

            return (
              <article
                key={level.badge.id}
                className={`${styles.badgeCard} ${
                  unlocked ? styles.unlockedBadge : ""
                }`}
              >
                <div className={styles.badgeIcon}>
                  {unlocked ? level.badge.icon : "🔒"}
                </div>

                <strong>
                  {unlocked ? level.badge.name : "شارة مغلقة"}
                </strong>

                <small>
                  {unlocked
                    ? `تم فتحها في المستوى ${level.id}`
                    : `أكمل المستوى ${level.id} لفتحها`}
                </small>
              </article>
            );
          })}
        </div>
      </section>

      {completedCount === levels.length && (
        <section className={styles.finalCertificate}>
          <div className={styles.certificateGlow} />

          <span className={styles.crown}>👑</span>

          <small>Forex4Ever يمنحك</small>
          <h2>وسام المتداول المنضبط</h2>

          <p>
            لقد أكملت جميع تحديات مغامرة المتداول وتعلمت أن حماية رأس
            المال والانضباط أهم من مطاردة الربح السريع.
          </p>

          <div className={styles.finalStats}>
            <span>{progress.xp} XP</span>
            <span>{progress.badges.length} شارات</span>
            <span>{levels.length} مستويات</span>
          </div>
        </section>
      )}

      <section className={styles.safetyNotice}>
        <span>🛡️</span>

        <div>
          <strong>مساحة تعليمية آمنة</strong>

          <p>
            جميع الأسعار والعملات داخل اللعبة افتراضية. هذه الصفحة
            مخصصة للتعليم فقط، ولا تقدم توصيات استثمارية ولا تضمن أي
            نتائج. التداول الحقيقي قد يؤدي إلى خسارة رأس المال.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <strong>Forex4Ever</strong>
        <span>تعلّم أولًا، وتدرّب بهدوء، واحمِ قراراتك.</span>
      </footer>
    </main>
  );
}
