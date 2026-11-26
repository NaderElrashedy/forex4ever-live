"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ALL_STAGES,
  TOTAL_STAGES,
  WORLDS,
} from "./gameData";
import {
  DEFAULT_PROGRESS,
  completeStage,
  evaluateStage,
  getAccuracy,
  getPlayerLevel,
  getRank,
  getWorldCompletion,
  isStageCompleted,
  isStageUnlocked,
  loadProgress,
  registerWrongAnswer,
  resetProgress,
  saveProgress,
} from "./gameEngine";
import styles from "./trading-game.module.css";

const ROBOT_MESSAGES = {
  welcome:
    "مرحبًا! أنا فوري. أمامك 8 عوالم و40 مرحلة. سأرافقك حتى عرش المتداول المنضبط.",
  select:
    "اختر إحدى المراحل المفتوحة من الخريطة. المراحل الذهبية هي مواجهات الزعماء.",
  correct:
    "رائع جدًا! قرار منضبط. حصلت على نقاط خبرة وعملات تعليمية.",
  wrong:
    "لا تقلق! الخطأ هنا جزء من التعلم. اقرأ الدرس وحاول مرة أخرى.",
  locked:
    "هذه المرحلة ما زالت مغلقة. أكمل المرحلة السابقة أولًا.",
  completed:
    "لقد أنهيت هذه المرحلة من قبل، ويمكنك إعادتها للتدريب دون نقاط إضافية.",
};

const chartPatterns = {
  bullish: [35, 42, 39, 48, 45, 57, 54, 64, 61, 73],
  rejection: [40, 45, 50, 59, 76, 55, 48, 45, 42, 40],
  range: [42, 66, 45, 67, 44, 65, 46, 66, 47, 64],
  trend: [27, 37, 33, 46, 40, 54, 49, 63, 57, 73],
  support: [71, 62, 54, 43, 31, 40, 49, 58, 66, 73],
  news: [42, 45, 43, 48, 85, 28, 71, 39, 58, 52],
  emotion: [30, 42, 53, 48, 60, 51, 65, 58, 70, 63],
  final: [30, 39, 48, 57, 68, 59, 51, 43, 50, 61],
};

function createInitialValue(stage) {
  if (!stage) return null;
  if (stage.kind === "sequence") return [];
  if (stage.kind === "slider") return stage.initial;
  return null;
}

function SoundManager({ enabledRef }) {
  const audioContextRef = useRef(null);

  useEffect(() => {
    window.__f4ePlaySound = (type) => {
      if (!enabledRef.current) return;

      try {
        const AudioContext =
          window.AudioContext || window.webkitAudioContext;

        if (!AudioContext) return;

        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }

        const context = audioContextRef.current;
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.type = type === "correct" ? "sine" : "triangle";
        oscillator.frequency.setValueAtTime(
          type === "correct" ? 520 : 180,
          context.currentTime
        );

        if (type === "correct") {
          oscillator.frequency.exponentialRampToValueAtTime(
            880,
            context.currentTime + 0.22
          );
        }

        gain.gain.setValueAtTime(0.08, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          context.currentTime + 0.3
        );

        oscillator.start();
        oscillator.stop(context.currentTime + 0.3);
      } catch {
        // تستمر اللعبة دون صوت إذا كان المتصفح يمنعه.
      }
    };

    return () => {
      delete window.__f4ePlaySound;
    };
  }, [enabledRef]);

  return null;
}

function AnimatedChart({ pattern = "bullish" }) {
  const values = chartPatterns[pattern] || chartPatterns.bullish;

  return (
    <div className={styles.chart} aria-hidden="true">
      <div className={styles.chartGrid} />

      <svg
        className={styles.chartLine}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polyline
          points={values
            .map(
              (value, index) =>
                `${index * (100 / (values.length - 1))},${100 - value}`
            )
            .join(" ")}
        />
      </svg>

      <div className={styles.candles}>
        {values.map((value, index) => {
          const previous = values[Math.max(0, index - 1)];
          const rising = value >= previous;
          const height = Math.max(18, Math.abs(value - previous) + 20);

          return (
            <span
              key={`${value}-${index}`}
              className={`${styles.candle} ${
                rising ? styles.rising : styles.falling
              }`}
              style={{
                height: `${height}%`,
                bottom: `${Math.max(5, value - height / 2)}%`,
                animationDelay: `${index * 60}ms`,
              }}
            />
          );
        })}
      </div>

      <div className={styles.scanLine} />
    </div>
  );
}

function ZoneChallenge({ stage, value, onChange, disabled }) {
  return (
    <div className={styles.zoneChallenge}>
      <AnimatedChart pattern={stage.pattern} />

      <div className={styles.zoneButtons}>
        {stage.zones.map((zone) => (
          <button
            key={zone.id}
            type="button"
            disabled={disabled}
            className={`${styles.zoneButton} ${
              styles[`zone${zone.position}`]
            } ${value === zone.id ? styles.zoneSelected : ""}`}
            onClick={() => onChange(zone.id)}
          >
            <span>{zone.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SequenceChallenge({ stage, value, onChange, disabled }) {
  const selected = Array.isArray(value) ? value : [];
  const remaining = stage.items.filter(
    (item) => !selected.includes(item.id)
  );

  function addItem(id) {
    if (disabled || selected.includes(id)) return;
    onChange([...selected, id]);
  }

  function removeItem(id) {
    if (disabled) return;
    onChange(selected.filter((item) => item !== id));
  }

  return (
    <div className={styles.sequence}>
      <div className={styles.sequenceResult}>
        {selected.length === 0 ? (
          <p>اضغط الخطوات بالترتيب الصحيح</p>
        ) : (
          selected.map((id, index) => {
            const item = stage.items.find((entry) => entry.id === id);

            return (
              <button
                key={id}
                type="button"
                disabled={disabled}
                onClick={() => removeItem(id)}
                className={styles.selectedStep}
              >
                <span>{index + 1}</span>
                {item?.label}
              </button>
            );
          })
        )}
      </div>

      <div className={styles.sequenceOptions}>
        {remaining.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => addItem(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {selected.length > 0 && !disabled && (
        <button
          type="button"
          className={styles.clearSequence}
          onClick={() => onChange([])}
        >
          إعادة الترتيب
        </button>
      )}
    </div>
  );
}

function SliderChallenge({ stage, value, onChange, disabled }) {
  const percentage =
    ((Number(value) - stage.min) / (stage.max - stage.min)) * 100;

  return (
    <div className={styles.sliderChallenge}>
      <div className={styles.sliderValue}>
        <strong>{value}</strong>
        <span>{stage.unit}</span>
      </div>

      <input
        type="range"
        min={stage.min}
        max={stage.max}
        step={stage.step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--slider-progress": `${percentage}%` }}
        aria-label={stage.prompt}
      />

      <div className={styles.sliderLimits}>
        <span>
          {stage.min}
          {stage.unit}
        </span>
        <span>
          {stage.max}
          {stage.unit}
        </span>
      </div>
    </div>
  );
}

function ChoiceChallenge({ stage, value, onChange, disabled }) {
  return (
    <div className={styles.answers}>
      {stage.options.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(item.id)}
          className={`${styles.answerButton} ${
            value === item.id ? styles.answerSelected : ""
          }`}
        >
          <span className={styles.answerIcon}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function Confetti({ active }) {
  if (!active) return null;

  return (
    <div className={styles.confetti} aria-hidden="true">
      {Array.from({ length: 24 }).map((_, index) => (
        <span
          key={index}
          style={{
            "--x": `${(index % 12) * 8 - 44}vw`,
            "--delay": `${(index % 6) * 0.05}s`,
            "--color":
              index % 3 === 0
                ? "#f6c85f"
                : index % 3 === 1
                ? "#48e0a4"
                : "#42d9ff",
          }}
        />
      ))}
    </div>
  );
}

export default function TradingGamePage() {
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);
  const [activeStageId, setActiveStageId] = useState(ALL_STAGES[0].id);
  const [value, setValue] = useState(
    createInitialValue(ALL_STAGES[0])
  );
  const [result, setResult] = useState(null);
  const [robotMessage, setRobotMessage] = useState(
    ROBOT_MESSAGES.welcome
  );
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const saved = loadProgress();
    setProgress(saved);

    const nextStage =
      ALL_STAGES.find(
        (stage) =>
          stage.number === saved.unlockedStage &&
          !saved.completedStages.includes(stage.id)
      ) ||
      ALL_STAGES.find(
        (stage) => !saved.completedStages.includes(stage.id)
      ) ||
      ALL_STAGES[TOTAL_STAGES - 1];

    setActiveStageId(nextStage.id);
    setValue(createInitialValue(nextStage));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveProgress(progress);
  }, [progress, loaded]);

  const activeStage = useMemo(
    () =>
      ALL_STAGES.find((stage) => stage.id === activeStageId) ||
      ALL_STAGES[0],
    [activeStageId]
  );

  const activeWorld = WORLDS[activeStage.worldIndex];
  const completedCount = progress.completedStages.length;
  const gamePercentage = Math.round(
    (completedCount / TOTAL_STAGES) * 100
  );
  const playerLevel = getPlayerLevel(progress.xp);
  const rank = getRank(progress.xp);
  const accuracy = getAccuracy(progress);
  const gameFinished = completedCount === TOTAL_STAGES;

  function playSound(type) {
    if (typeof window !== "undefined" && window.__f4ePlaySound) {
      window.__f4ePlaySound(type);
    }
  }

  function selectStage(stage) {
    if (!isStageUnlocked(stage, progress)) {
      setRobotMessage(ROBOT_MESSAGES.locked);
      playSound("wrong");
      return;
    }

    setActiveStageId(stage.id);
    setValue(createInitialValue(stage));
    setResult(null);
    setShowConfetti(false);

    if (isStageCompleted(stage, progress)) {
      setRobotMessage(ROBOT_MESSAGES.completed);
    } else {
      setRobotMessage(
        `${stage.worldIcon} أنت الآن في مرحلة «${stage.title}». اقرأ الدرس ثم نفّذ التحدي.`
      );
    }

    window.setTimeout(() => {
      document
        .getElementById("challenge-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function submitAnswer() {
    if (
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0)
    ) {
      setRobotMessage("اختر إجابة أو أكمل التحدي أولًا.");
      return;
    }

    const correct = evaluateStage(activeStage, value);

    if (correct) {
      const alreadyCompleted = isStageCompleted(
        activeStage,
        progress
      );

      setProgress((current) =>
        completeStage(current, activeStage)
      );

      setResult("correct");
      setRobotMessage(
        alreadyCompleted
          ? ROBOT_MESSAGES.completed
          : ROBOT_MESSAGES.correct
      );
      setShowConfetti(true);
      playSound("correct");

      window.setTimeout(() => setShowConfetti(false), 1800);
    } else {
      setProgress((current) => registerWrongAnswer(current));
      setResult("wrong");
      setRobotMessage(ROBOT_MESSAGES.wrong);
      playSound("wrong");
    }
  }

  function retryStage() {
    setValue(createInitialValue(activeStage));
    setResult(null);
    setRobotMessage(
      "محاولة جديدة! ركّز على الدرس ولا تتعجل."
    );
  }

  function openNextStage() {
    const next = ALL_STAGES.find(
      (stage) => stage.number === activeStage.number + 1
    );

    if (next && isStageUnlocked(next, progress)) {
      selectStage(next);
    }
  }

  function confirmReset() {
    resetProgress();
    setProgress(DEFAULT_PROGRESS);
    setActiveStageId(ALL_STAGES[0].id);
    setValue(createInitialValue(ALL_STAGES[0]));
    setResult(null);
    setRobotMessage(ROBOT_MESSAGES.welcome);
    setShowReset(false);
  }

  function renderChallenge() {
    const disabled = result === "correct";

    if (
      activeStage.kind === "choice" ||
      activeStage.kind === "scenario"
    ) {
      return (
        <ChoiceChallenge
          stage={activeStage}
          value={value}
          onChange={setValue}
          disabled={disabled}
        />
      );
    }

    if (activeStage.kind === "zone") {
      return (
        <ZoneChallenge
          stage={activeStage}
          value={value}
          onChange={setValue}
          disabled={disabled}
        />
      );
    }

    if (activeStage.kind === "sequence") {
      return (
        <SequenceChallenge
          stage={activeStage}
          value={value}
          onChange={setValue}
          disabled={disabled}
        />
      );
    }

    if (activeStage.kind === "slider") {
      return (
        <SliderChallenge
          stage={activeStage}
          value={value}
          onChange={setValue}
          disabled={disabled}
        />
      );
    }

    return null;
  }

  return (
    <main
      className={styles.page}
      dir="rtl"
      style={{ "--active-color": activeWorld.color }}
    >
      <SoundManager enabledRef={soundEnabledRef} />
      <Confetti active={showConfetti} />

      <div className={styles.background}>
        <span />
        <span />
        <span />
      </div>

      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <strong>Forex4Ever</strong>
          <span>مغامرة المتداول</span>
        </Link>

        <nav className={styles.headerNav}>
          <Link href="/trading-room">غرفة التداول</Link>
          <Link href="/">الرئيسية</Link>

          <button
            type="button"
            onClick={() => setSoundEnabled((current) => !current)}
            aria-label={soundEnabled ? "إيقاف الصوت" : "تشغيل الصوت"}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            8 عوالم • 40 مرحلة • مغامرة تعليمية
          </span>

          <h1>
            مغامرة <span>المتداول</span>
          </h1>

          <p>
            تعلّم قراءة السوق وإدارة المخاطر والتحكم في المشاعر
            من خلال تحديات تفاعلية متدرجة.
          </p>

          <div className={styles.heroButtons}>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("world-map")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              ابدأ المغامرة
            </button>

            <button
              type="button"
              className={styles.resetButton}
              onClick={() => setShowReset(true)}
            >
              إعادة التقدم
            </button>
          </div>
        </div>

        <div className={styles.robotScene}>
          <div className={styles.robotHalo} />

          <div className={styles.robot}>
            <div className={styles.robotAntenna}>
              <span />
            </div>

            <div className={styles.robotHead}>
              <div className={styles.robotScreen}>
                <i />
                <i />
              </div>
            </div>

            <div className={styles.robotBody}>
              <span>F</span>
              <div />
            </div>

            <div className={styles.robotArmLeft} />
            <div className={styles.robotArmRight} />
          </div>

          <div className={styles.robotMessage}>
            <strong>فوري 🤖</strong>
            <p>{robotMessage}</p>
          </div>
        </div>
      </section>

      <section className={styles.dashboard}>
        <article>
          <span>مستوى اللاعب</span>
          <strong>{playerLevel}</strong>
          <small>{rank}</small>
        </article>

        <article>
          <span>نقاط الخبرة</span>
          <strong>{progress.xp}</strong>
          <small>XP</small>
        </article>

        <article>
          <span>العملات التعليمية</span>
          <strong>{progress.coins}</strong>
          <small>🪙 عملة</small>
        </article>

        <article>
          <span>المراحل المكتملة</span>
          <strong>
            {completedCount}/{TOTAL_STAGES}
          </strong>
          <small>{gamePercentage}% من المغامرة</small>
        </article>

        <article>
          <span>دقة القرارات</span>
          <strong>{accuracy}%</strong>
          <small>تتحسن مع التدريب</small>
        </article>
      </section>

      <section className={styles.progressSection}>
        <div className={styles.progressText}>
          <span>تقدم المغامرة</span>
          <strong>{gamePercentage}%</strong>
        </div>

        <div className={styles.progressTrack}>
          <span style={{ width: `${gamePercentage}%` }} />
        </div>
      </section>

      <section id="world-map" className={styles.mapSection}>
        <div className={styles.sectionHeading}>
          <span>الخريطة الكبرى</span>
          <h2>اختر عالمك التالي</h2>
          <p>
            أكمل المراحل بالترتيب وافتح شارة جديدة عند هزيمة
            زعيم كل عالم.
          </p>
        </div>

        <div className={styles.worlds}>
          {WORLDS.map((world, worldIndex) => {
            const completion = getWorldCompletion(world, progress);

            return (
              <article
                key={world.id}
                className={`${styles.worldCard} ${
                  completion.finished ? styles.worldCompleted : ""
                }`}
                style={{
                  "--world-color": world.color,
                  animationDelay: `${worldIndex * 80}ms`,
                }}
              >
                <div className={styles.worldHeader}>
                  <span className={styles.worldIcon}>{world.icon}</span>

                  <div>
                    <small>العالم {worldIndex + 1}</small>
                    <h3>{world.name}</h3>
                    <p>{world.subtitle}</p>
                  </div>

                  {completion.finished && (
                    <span className={styles.trophy}>🏆</span>
                  )}
                </div>

                <div className={styles.worldProgress}>
                  <span
                    style={{ width: `${completion.percentage}%` }}
                  />
                </div>

                <div className={styles.stagePath}>
                  {world.stages.map((stage) => {
                    const unlocked = isStageUnlocked(
                      stage,
                      progress
                    );
                    const completed = isStageCompleted(
                      stage,
                      progress
                    );
                    const active = activeStage.id === stage.id;

                    return (
                      <button
                        key={stage.id}
                        type="button"
                        title={stage.title}
                        className={`${styles.stageNode} ${
                          completed ? styles.stageCompleted : ""
                        } ${active ? styles.stageActive : ""} ${
                          stage.boss ? styles.bossStage : ""
                        }`}
                        onClick={() => selectStage(stage)}
                      >
                        <span>
                          {!unlocked
                            ? "🔒"
                            : completed
                            ? "✓"
                            : stage.boss
                            ? "👑"
                            : stage.stageIndex + 1}
                        </span>

                        <small>{stage.title}</small>
                      </button>
                    );
                  })}
                </div>

                <div className={styles.worldReward}>
                  <span>{world.badge.icon}</span>
                  <div>
                    <small>شارة العالم</small>
                    <strong>{world.badge.name}</strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="challenge-panel"
        className={styles.challengeSection}
      >
        <div className={styles.challengeTop}>
          <div>
            <span>
              {activeStage.worldIcon} {activeStage.worldName}
            </span>
            <h2>{activeStage.title}</h2>
          </div>

          <div className={styles.rewardPreview}>
            <span>+{activeStage.xp} XP</span>
            <span>+{activeStage.coins} 🪙</span>
          </div>
        </div>

        <div className={styles.lessonBox}>
          <span>💡 درس المرحلة</span>
          <p>{activeStage.lesson}</p>
        </div>

        <div className={styles.mission}>
          <span>المهمة</span>
          <h3>{activeStage.prompt}</h3>
        </div>

        {activeStage.kind !== "zone" && (
          <AnimatedChart
            pattern={
              activeWorld.id === "news-lab"
                ? "news"
                : activeWorld.id === "trend-kingdom"
                ? "trend"
                : "bullish"
            }
          />
        )}

        {renderChallenge()}

        {result && (
          <div
            className={`${styles.resultBox} ${
              result === "correct"
                ? styles.correctResult
                : styles.wrongResult
            }`}
          >
            <span>{result === "correct" ? "🎉" : "💡"}</span>

            <div>
              <strong>
                {result === "correct"
                  ? "إجابة صحيحة!"
                  : "الإجابة غير صحيحة"}
              </strong>
              <p>{activeStage.explanation}</p>
            </div>
          </div>
        )}

        <div className={styles.challengeActions}>
          {result !== "correct" && (
            <button
              type="button"
              className={styles.submitButton}
              onClick={submitAnswer}
            >
              {result === "wrong"
                ? "تحقق من المحاولة الجديدة"
                : "تأكيد القرار"}
            </button>
          )}

          {result === "wrong" && (
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={retryStage}
            >
              إعادة المحاولة
            </button>
          )}

          {result === "correct" &&
            activeStage.number < TOTAL_STAGES && (
              <button
                type="button"
                className={styles.nextButton}
                onClick={openNextStage}
              >
                المرحلة التالية ←
              </button>
            )}
        </div>
      </section>

      <section className={styles.badgesSection}>
        <div className={styles.sectionHeading}>
          <span>خزينة الإنجازات</span>
          <h2>الشارات والكؤوس</h2>
        </div>

        <div className={styles.badgesGrid}>
          {WORLDS.map((world) => {
            const unlocked = progress.badges.includes(
              world.badge.id
            );

            return (
              <article
                key={world.badge.id}
                className={unlocked ? styles.badgeUnlocked : ""}
                style={{ "--badge-color": world.color }}
              >
                <span>{unlocked ? world.badge.icon : "🔒"}</span>
                <strong>
                  {unlocked ? world.badge.name : "شارة مغلقة"}
                </strong>
                <small>
                  {unlocked
                    ? `تم اجتياز ${world.name}`
                    : `أكمل ${world.name}`}
                </small>
              </article>
            );
          })}
        </div>
      </section>

      {gameFinished && (
        <section className={styles.certificate}>
          <div className={styles.certificateGlow} />

          <span className={styles.crown}>👑</span>
          <small>Forex4Ever</small>
          <h2>وسام المتداول المنضبط</h2>
          <p>
            أتممت عوالم مغامرة المتداول التعليمية وعددها 8
            عوالم و40 مرحلة.
          </p>

          <div>
            <span>
              <strong>{progress.xp}</strong>
              XP
            </span>

            <span>
              <strong>{progress.badges.length}</strong>
              شارات
            </span>

            <span>
              <strong>{accuracy}%</strong>
              دقة
            </span>
          </div>

          <em>
            هذا الوسام تعليمي داخل اللعبة ولا يمثل اعتمادًا مهنيًا.
          </em>
        </section>
      )}

      <footer className={styles.disclaimer}>
        <strong>تنبيه تعليمي مهم</strong>
        <p>
          جميع الرسوم والأسعار والأرصدة داخل اللعبة افتراضية
          ومخصصة للتعليم فقط. اللعبة لا تقدم توصيات استثمارية،
          ولا تضمن أرباحًا أو نتائج. التداول الحقيقي قد يؤدي إلى
          خسارة رأس المال.
        </p>
      </footer>

      {showReset && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <span>⚠️</span>
            <h2>إعادة تقدم اللعبة؟</h2>
            <p>
              سيتم حذف المراحل المكتملة والنقاط والشارات المحفوظة
              على هذا الجهاز.
            </p>

            <div>
              <button type="button" onClick={confirmReset}>
                نعم، ابدأ من جديد
              </button>

              <button
                type="button"
                onClick={() => setShowReset(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
