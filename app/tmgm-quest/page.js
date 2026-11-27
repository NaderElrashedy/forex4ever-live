"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./tmgm-quest.module.css";
import { ALL_STAGES, TOTAL_STAGES, WORLDS } from "./questData";
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
  markBoxOpened,
  registerWrongAnswer,
  resetProgress,
  saveProgress,
} from "./questEngine";

const MESSAGES = {
  welcome:
    "Welcome to TMGM Market City. Drive through six districts, complete every mission and unlock the Golden Mystery Box.",
  select:
    "Choose carefully. A disciplined decision is more powerful than a fast decision.",
  correct:
    "Mission complete! Your discipline reduced Risk Heat and unlocked the next route.",
  wrong:
    "Risk Heat increased. Review the mission hint and try again without rushing.",
  locked:
    "This route is protected. Complete the previous mission to unlock it.",
  final:
    "The Golden Castle is open. Enter the vault and unlock the Mystery Box.",
};

function playTone(type, soundEnabled) {
  if (!soundEnabled || typeof window === "undefined") return;

  try {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.type = type === "success" ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(
      type === "success" ? 520 : 170,
      context.currentTime
    );

    if (type === "success") {
      oscillator.frequency.exponentialRampToValueAtTime(
        960,
        context.currentTime + 0.28
      );
    }

    gain.gain.setValueAtTime(0.06, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + 0.4
    );

    oscillator.start();
    oscillator.stop(context.currentTime + 0.4);
  } catch {
    // Audio is optional.
  }
}

function CityBackground({ mouse }) {
  const buildings = Array.from({ length: 18 }, (_, index) => index);
  const particles = Array.from({ length: 30 }, (_, index) => index);

  return (
    <div className={styles.cityBackground} aria-hidden="true">
      <div
        className={styles.skyGlow}
        style={{
          transform: `translate3d(${mouse.x * 10}px, ${mouse.y * 7}px, 0)`,
        }}
      />

      <div className={styles.moon} />

      <div className={styles.stars}>
        {particles.map((particle) => (
          <i
            key={particle}
            style={{
              "--x": `${(particle * 37) % 100}%`,
              "--y": `${(particle * 23) % 72}%`,
              "--delay": `${(particle % 8) * -0.45}s`,
              "--size": `${2 + (particle % 4)}px`,
            }}
          />
        ))}
      </div>

      <svg
        className={styles.priceLine}
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
      >
        <path d="M0 190 L90 170 L160 205 L250 120 L340 145 L440 80 L520 112 L620 42 L720 91 L820 60 L920 125 L1040 75 L1140 98 L1250 38 L1440 65" />
      </svg>

      <div
        className={styles.buildings}
        style={{
          transform: `translate3d(${mouse.x * -8}px, ${mouse.y * -3}px, 0)`,
        }}
      >
        {buildings.map((building) => (
          <span
            key={building}
            style={{
              "--height": `${100 + ((building * 47) % 250)}px`,
              "--width": `${45 + ((building * 19) % 75)}px`,
              "--delay": `${(building % 7) * -0.6}s`,
            }}
          >
            <i />
            <i />
            <i />
            <i />
          </span>
        ))}
      </div>

      <div className={styles.fog} />
      <div className={styles.roadGrid} />
      <div className={styles.scanLine} />
    </div>
  );
}

function TMGMGuide({ message, mood }) {
  return (
    <aside
      className={`${styles.guide} ${
        mood === "correct" ? styles.guideCorrect : ""
      } ${mood === "wrong" ? styles.guideWrong : ""}`}
    >
      <div className={styles.guideVisual}>
        <div className={styles.guideRing} />
        <div className={styles.guideHead}>
          <div className={styles.guideEyes}>
            <i />
            <i />
          </div>
          <strong>T</strong>
        </div>
        <div className={styles.guideBody}>
          <span>TMGM</span>
          <i />
        </div>
      </div>

      <div className={styles.guideCopy}>
        <small>TMGM GUIDE • ONLINE</small>
        <p>{message}</p>
      </div>
    </aside>
  );
}

function SequenceChallenge({ stage, onChange }) {
  const [items, setItems] = useState(() => [...stage.items].reverse());

  useEffect(() => {
    const reversed = [...stage.items].reverse();
    setItems(reversed);
    onChange(reversed);
  }, [stage, onChange]);

  function moveItem(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    onChange(next);
  }

  return (
    <div className={styles.sequenceList}>
      {items.map((item, index) => (
        <div className={styles.sequenceItem} key={item}>
          <span>{index + 1}</span>
          <strong>{item}</strong>

          <div>
            <button
              type="button"
              onClick={() => moveItem(index, -1)}
              disabled={index === 0}
              aria-label="Move up"
            >
              ↑
            </button>

            <button
              type="button"
              onClick={() => moveItem(index, 1)}
              disabled={index === items.length - 1}
              aria-label="Move down"
            >
              ↓
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChallengeModal({
  stage,
  progress,
  onClose,
  onCorrect,
  onWrong,
}) {
  const [answer, setAnswer] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    setAnswer(null);
    setStatus("idle");
  }, [stage]);

  if (!stage) return null;

  const completed = isStageCompleted(progress, stage);

  function submitAnswer() {
    if (!answer) return;

    if (evaluateStage(stage, answer)) {
      setStatus("correct");
      onCorrect(stage);
    } else {
      setStatus("wrong");
      onWrong();
    }
  }

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div
        className={`${styles.challengeModal} ${
          status === "wrong" ? styles.wrongShake : ""
        }`}
      >
        <button
          type="button"
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Close mission"
        >
          ×
        </button>

        <div className={styles.missionHeading}>
          <span style={{ color: stage.worldColor }}>
            {stage.worldIcon}
          </span>

          <div>
            <small>
              MISSION {String(stage.number).padStart(2, "0")} •{" "}
              {stage.worldName}
            </small>
            <h2>{stage.title}</h2>
          </div>
        </div>

        <div className={styles.missionChart}>
          {Array.from({ length: 12 }, (_, index) => (
            <i
              key={index}
              className={index % 3 === 0 ? styles.redCandle : ""}
              style={{
                "--candle-height": `${30 + ((index * 23) % 70)}px`,
                "--delay": `${index * 0.06}s`,
              }}
            />
          ))}
        </div>

        <h3>{stage.question}</h3>

        {stage.kind === "sequence" ? (
          <SequenceChallenge stage={stage} onChange={setAnswer} />
        ) : (
          <div className={styles.optionsGrid}>
            {stage.options.map((option) => (
              <button
                type="button"
                key={option}
                className={answer === option ? styles.selectedOption : ""}
                onClick={() => {
                  setAnswer(option);
                  setStatus("idle");
                }}
              >
                <span />
                {option}
              </button>
            ))}
          </div>
        )}

        {status === "wrong" && (
          <div className={styles.wrongResult}>
            <strong>⚠ Risk Heat increased</strong>
            <p>{stage.hint}</p>
          </div>
        )}

        {status === "correct" && (
          <div className={styles.correctResult}>
            <strong>✓ Mission Complete</strong>
            <p>
              +{stage.reward} points • +{stage.coins} coins
            </p>
          </div>
        )}

        <button
          type="button"
          className={styles.primaryButton}
          onClick={status === "correct" ? onClose : submitAnswer}
          disabled={!answer}
        >
          {status === "correct"
            ? "Return to Market City"
            : completed
              ? "Check Answer Again"
              : "Complete Mission"}
        </button>
      </div>
    </div>
  );
}

function GamePhone({
  open,
  onClose,
  progress,
  soundEnabled,
  setSoundEnabled,
  onReset,
}) {
  if (!open) return null;

  return (
    <div className={styles.phoneOverlay} onClick={onClose}>
      <div className={styles.phone} onClick={(event) => event.stopPropagation()}>
        <div className={styles.phoneTop}>
          <span>09:41</span>
          <i />
          <span>5G ▰</span>
        </div>

        <div className={styles.phoneHeader}>
          <small>TMGM CITY OS</small>
          <h2>Market Phone</h2>
        </div>

        <div className={styles.phoneApps}>
          <article>
            <span>⌖</span>
            <strong>City Map</strong>
            <small>{progress.completedStages.length}/30 routes</small>
          </article>

          <article>
            <span>◇</span>
            <strong>Risk Scanner</strong>
            <small>{progress.riskHeat}% heat</small>
          </article>

          <article>
            <span>♛</span>
            <strong>Badges</strong>
            <small>{progress.badges.length}/6 collected</small>
          </article>

          <article>
            <span>▰</span>
            <strong>Garage</strong>
            <small>{progress.coins} coins</small>
          </article>
        </div>

        <button
          type="button"
          className={styles.phoneAction}
          onClick={() => setSoundEnabled((value) => !value)}
        >
          {soundEnabled ? "🔊 Sound Enabled" : "🔇 Sound Disabled"}
        </button>

        <button
          type="button"
          className={styles.phoneReset}
          onClick={onReset}
        >
          Reset City Progress
        </button>

        <button
          type="button"
          className={styles.phoneHome}
          onClick={onClose}
          aria-label="Close phone"
        />
      </div>
    </div>
  );
}

function MysteryBox({ progress, setProgress, soundEnabled }) {
  const [hold, setHold] = useState(0);
  const [opening, setOpening] = useState(false);
  const timerRef = useRef(null);

  const finished = progress.completedStages.length === TOTAL_STAGES;

  function stopHold() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!opening) setHold(0);
  }

  function startHold() {
    if (!finished || progress.boxOpened || opening) return;

    setHold(0);

    timerRef.current = window.setInterval(() => {
      setHold((current) => {
        const next = current + 4;

        if (next >= 100) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
          setOpening(true);
          playTone("success", soundEnabled);

          window.setTimeout(() => {
            setProgress((currentProgress) =>
              markBoxOpened(currentProgress)
            );
          }, 1500);

          return 100;
        }

        return next;
      });
    }, 70);
  }

  useEffect(() => () => stopHold(), []);

  if (!finished) return null;

  return (
    <section
      className={`${styles.vault} ${
        progress.boxOpened ? styles.openedVault : ""
      }`}
    >
      <div className={styles.vaultBeam} />

      <div className={styles.goldenGuide}>
        <span>T</span>
        <strong>TMGM GOLDEN GUIDE</strong>
      </div>

      <div
        className={`${styles.mysteryBox} ${
          opening ? styles.boxOpening : ""
        } ${progress.boxOpened ? styles.boxOpened : ""}`}
      >
        <div className={styles.boxLight} />
        <div className={styles.boxLid} />
        <div className={styles.boxBody}>
          <strong>TMGM</strong>
          <span>♛</span>
        </div>
      </div>

      {!progress.boxOpened ? (
        <div className={styles.unlockArea}>
          <h2>The Golden Mystery Box</h2>
          <p>Press and hold the lock to open the final vault.</p>

          <button
            type="button"
            className={styles.holdButton}
            onPointerDown={startHold}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onPointerCancel={stopHold}
          >
            <span style={{ width: `${hold}%` }} />
            <strong>{hold === 100 ? "UNLOCKING..." : "HOLD TO UNLOCK"}</strong>
          </button>
        </div>
      ) : (
        <div className={styles.rewardCard}>
          <small>JOURNEY COMPLETED</small>
          <h2>The Golden Mystery Box</h2>
          <p>
            Congratulations! You completed all 30 educational missions
            across TMGM Market City.
          </p>

          <div>
            <span>{progress.points} Points</span>
            <span>{progress.badges.length} Badges</span>
          </div>

          <strong>
            Demo reward only. This does not represent or guarantee a real
            prize.
          </strong>
        </div>
      )}

      {(opening || progress.boxOpened) && (
        <div className={styles.confetti} aria-hidden="true">
          {Array.from({ length: 45 }, (_, index) => (
            <i
              key={index}
              style={{
                "--x": `${(index * 41) % 100}%`,
                "--delay": `${(index % 12) * -0.12}s`,
                "--color":
                  index % 3 === 0
                    ? "#f6cf66"
                    : index % 3 === 1
                      ? "#31d7ff"
                      : "#ffffff",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function TMGMMarketCityPage() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [selectedStage, setSelectedStage] = useState(null);
  const [message, setMessage] = useState(MESSAGES.welcome);
  const [mood, setMood] = useState("idle");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [carPosition, setCarPosition] = useState(12);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setProgress(loadProgress());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveProgress(progress);
  }, [progress, ready]);

  useEffect(() => {
    function handleMove(event) {
      setMouse({
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5,
      });
    }

    function handleKey(event) {
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        setCarPosition((value) => Math.min(82, value + 4));
      }

      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        setCarPosition((value) => Math.max(5, value - 4));
      }

      if (event.key.toLowerCase() === "p") {
        setPhoneOpen((value) => !value);
      }
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const completion = Math.round(
    (progress.completedStages.length / TOTAL_STAGES) * 100
  );

  const accuracy = useMemo(() => getAccuracy(progress), [progress]);
  const level = useMemo(() => getPlayerLevel(progress), [progress]);
  const rank = useMemo(() => getRank(progress), [progress]);

  function openStage(stage) {
    if (!isStageUnlocked(progress, stage)) {
      setMood("wrong");
      setMessage(MESSAGES.locked);
      playTone("wrong", soundEnabled);
      return;
    }

    setSelectedStage(stage);
    setMood("idle");
    setMessage(MESSAGES.select);
  }

  function handleCorrect(stage) {
    const wasCompleted = isStageCompleted(progress, stage);
    const next = completeStage(progress, stage);

    setProgress(next);
    setMood("correct");
    setMessage(
      next.completedStages.length === TOTAL_STAGES
        ? MESSAGES.final
        : MESSAGES.correct
    );

    if (!wasCompleted) playTone("success", soundEnabled);
  }

  function handleWrong() {
    setProgress((current) => registerWrongAnswer(current));
    setMood("wrong");
    setMessage(MESSAGES.wrong);
    playTone("wrong", soundEnabled);
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Reset all Market City progress? This action cannot be undone."
    );

    if (!confirmed) return;

    setProgress(resetProgress());
    setSelectedStage(null);
    setPhoneOpen(false);
    setMood("idle");
    setMessage(MESSAGES.welcome);
    setCarPosition(12);
  }

  if (!ready) {
    return (
      <main className={styles.loadingScreen}>
        <div className={styles.loadingCore}>T</div>
        <h1>Loading TMGM Market City...</h1>
      </main>
    );
  }

  return (
    <main className={styles.game}>
      <CityBackground mouse={mouse} />

      <header className={styles.header}>
        <div className={styles.brand}>
          <span>T</span>
          <div>
            <strong>TMGM</strong>
            <small>MARKET CITY</small>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={() => setSoundEnabled((value) => !value)}
          >
            {soundEnabled ? "🔊 SOUND ON" : "🔇 SOUND OFF"}
          </button>

          <button type="button" onClick={() => setPhoneOpen(true)}>
            ▣ CITY PHONE
          </button>

          <Link href="/">EXIT CITY</Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <small>WELCOME TO THE FINANCIAL OPEN CITY</small>
          <h1>
            Drive. Learn.
            <span> Control The Risk.</span>
          </h1>
          <p>
            Explore six futuristic districts, complete 30 educational
            trading missions and unlock the Golden Mystery Box.
          </p>

          <div className={styles.heroTags}>
            <span>30 Missions</span>
            <span>6 Districts</span>
            <span>Risk Heat System</span>
          </div>
        </div>

        <TMGMGuide message={message} mood={mood} />
      </section>

      <section className={styles.hud}>
        <article>
          <small>PLAYER LEVEL</small>
          <strong>{level}</strong>
          <span>{rank}</span>
        </article>

        <article>
          <small>QUEST POINTS</small>
          <strong>{progress.points}</strong>
          <span>City reputation</span>
        </article>

        <article>
          <small>CITY COINS</small>
          <strong>{progress.coins}</strong>
          <span>Garage currency</span>
        </article>

        <article>
          <small>COMPLETED</small>
          <strong>
            {progress.completedStages.length}/{TOTAL_STAGES}
          </strong>
          <span>{completion}% of the city</span>
        </article>

        <article>
          <small>ACCURACY</small>
          <strong>{accuracy}%</strong>
          <span>Decision quality</span>
        </article>
      </section>

      <section className={styles.riskPanel}>
        <div>
          <strong>RISK HEAT</strong>
          <small>
            Risk Heat rises after unsafe decisions and falls after
            disciplined missions.
          </small>
        </div>

        <div className={styles.riskTrack}>
          <span style={{ width: `${progress.riskHeat}%` }} />
        </div>

        <b>{progress.riskHeat}%</b>
      </section>

      <section className={styles.cityMap}>
        <div className={styles.sectionTitle}>
          <div>
            <small>INTERACTIVE JOURNEY</small>
            <h2>Market City Districts</h2>
          </div>

          <p>
            Complete missions in order to unlock new roads and districts.
          </p>
        </div>

        <div className={styles.worlds}>
          {WORLDS.map((world, worldIndex) => {
            const stages = ALL_STAGES.filter(
              (stage) => stage.worldId === world.id
            );

            const worldCompletion = getWorldCompletion(
              progress,
              world.id
            );

            const worldLocked = stages[0].number > progress.unlockedStage;

            return (
              <article
                className={`${styles.world} ${
                  worldLocked ? styles.lockedWorld : ""
                }`}
                key={world.id}
                style={{ "--world-color": world.color }}
              >
                <div className={styles.worldSky}>
                  <div className={styles.worldPortal}>
                    <span>{worldLocked ? "⌁" : world.icon}</span>
                  </div>

                  <div className={styles.miniBuildings}>
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>

                <div className={styles.worldContent}>
                  <small>
                    DISTRICT {String(worldIndex + 1).padStart(2, "0")}
                  </small>
                  <h3>{world.name}</h3>
                  <strong>{world.subtitle}</strong>
                  <p>{world.description}</p>

                  <div className={styles.worldProgress}>
                    <span>
                      <i style={{ width: `${worldCompletion}%` }} />
                    </span>
                    <b>{worldCompletion}%</b>
                  </div>

                  <div className={styles.stageRoad}>
                    {stages.map((stage) => {
                      const unlocked = isStageUnlocked(progress, stage);
                      const completed = isStageCompleted(progress, stage);

                      return (
                        <button
                          type="button"
                          key={stage.id}
                          className={`${styles.stageNode} ${
                            completed ? styles.completedStage : ""
                          } ${!unlocked ? styles.lockedStage : ""}`}
                          onClick={() => openStage(stage)}
                          title={stage.title}
                        >
                          <span>
                            {completed ? "✓" : unlocked ? stage.number : "⌁"}
                          </span>
                          <small>{stage.boss ? "BOSS" : "MISSION"}</small>
                        </button>
                      );
                    })}
                  </div>

                  {progress.badges.includes(world.badge) && (
                    <div className={styles.badgeUnlocked}>
                      ✦ {world.badge}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.drivingZone}>
        <div className={styles.drivingHeader}>
          <div>
            <small>FREE DRIVE MODE</small>
            <h2>Neon Trading Highway</h2>
          </div>

          <p>Use A/D, arrow keys or the controls to move the vehicle.</p>
        </div>

        <div className={styles.highway}>
          <div className={styles.highwayLights} />
          <div className={styles.roadLines} />

          <div
            className={styles.car}
            style={{ left: `${carPosition}%` }}
          >
            <div className={styles.carGlow} />
            <div className={styles.carCabin}>
              <span>TMGM</span>
            </div>
            <div className={styles.carBody} />
            <i className={styles.wheelLeft} />
            <i className={styles.wheelRight} />
          </div>
        </div>

        <div className={styles.driveControls}>
          <button
            type="button"
            onClick={() =>
              setCarPosition((value) => Math.max(5, value - 5))
            }
          >
            ← STEER LEFT
          </button>

          <button
            type="button"
            onClick={() =>
              setCarPosition((value) => Math.min(82, value + 5))
            }
          >
            STEER RIGHT →
          </button>
        </div>
      </section>

      <MysteryBox
        progress={progress}
        setProgress={setProgress}
        soundEnabled={soundEnabled}
      />

      <section className={styles.disclaimer}>
        <strong>Educational Demo Notice</strong>
        <p>
          This game is an educational and promotional simulation. It does
          not provide investment advice, trading signals or guaranteed
          results. All balances, points, charts and missions are fictional.
          Trading leveraged products may result in the loss of capital.
        </p>

        <p>
          This is a promotional demo version. Any reward displayed inside
          the game does not represent a real prize or guarantee that it
          will be awarded.
        </p>
      </section>

      <footer className={styles.footer}>
        <span>TMGM MARKET CITY • EDUCATIONAL EXPERIENCE</span>
        <button type="button" onClick={handleReset}>
          RESET PROGRESS
        </button>
      </footer>

      <GamePhone
        open={phoneOpen}
        onClose={() => setPhoneOpen(false)}
        progress={progress}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onReset={handleReset}
      />

      <ChallengeModal
        stage={selectedStage}
        progress={progress}
        onClose={() => setSelectedStage(null)}
        onCorrect={handleCorrect}
        onWrong={handleWrong}
      />
    </main>
  );
}
