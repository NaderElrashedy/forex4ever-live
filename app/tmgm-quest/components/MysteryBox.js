"use client";

import { useEffect, useRef, useState } from "react";
import { TOTAL_MISSIONS } from "../data/missionData";
import styles from "../tmgm-quest.module.css";

const HOLD_DURATION = 2200;

function Confetti() {
  const colors = [
    "#31d7ff",
    "#56efb1",
    "#f6cf66",
    "#ffffff",
    "#9c8cff",
  ];

  return (
    <div className={styles.boxConfetti} aria-hidden="true">
      {Array.from({ length: 42 }).map((_, index) => (
        <i
          key={`confetti-${index}`}
          style={{
            "--confetti-x": `${(index % 14) * 7 - 46}vw`,
            "--confetti-rotate": `${index * 47}deg`,
            "--confetti-delay": `${(index % 8) * 0.06}s`,
            "--confetti-color": colors[index % colors.length],
          }}
        />
      ))}
    </div>
  );
}

function RewardCard({ progress, onRestart }) {
  return (
    <div className={styles.rewardCardScene}>
      <div className={styles.rewardCard}>
        <span className={styles.rewardCardGlow} />

        <header>
          <span>TMGM</span>
          <strong>MARKET CITY</strong>
        </header>

        <div className={styles.rewardCardSymbol}>T</div>

        <small>PROMOTIONAL DEMO ACHIEVEMENT</small>
        <h2>Market City Champion</h2>

        <p>
          You completed all educational missions and reached the Golden Castle
          through disciplined decisions.
        </p>

        <div className={styles.rewardCardStats}>
          <span>
            <strong>{progress.points || 0}</strong>
            <small>POINTS</small>
          </span>

          <span>
            <strong>{progress.badges?.length || 0}</strong>
            <small>BADGES</small>
          </span>

          <span>
            <strong>{progress.completedMissions?.length || 0}</strong>
            <small>MISSIONS</small>
          </span>
        </div>

        <footer>
          <span>DEMO REWARD CARD</span>
          <strong>NO REAL PRIZE GUARANTEED</strong>
        </footer>
      </div>

      <p className={styles.rewardDisclaimer}>
        This is a promotional demo version. Any reward displayed inside the
        game does not represent a real prize or guarantee that it will be
        awarded.
      </p>

      <button
        type="button"
        className={styles.restartJourneyButton}
        onClick={onRestart}
      >
        RESTART THE JOURNEY
      </button>
    </div>
  );
}

export default function MysteryBox({
  open,
  progress,
  onClose,
  onOpened,
  onRestart,
}) {
  const [holdProgress, setHoldProgress] = useState(0);
  const [stage, setStage] = useState(
    progress?.boxOpened ? "reward" : "waiting"
  );
  const holdStartRef = useRef(0);
  const animationFrameRef = useRef(0);
  const holdingRef = useRef(false);

  const completedCount = progress?.completedMissions?.length || 0;
  const unlocked = completedCount >= TOTAL_MISSIONS;

  useEffect(() => {
    if (open) {
      setHoldProgress(0);
      setStage(progress?.boxOpened ? "reward" : "waiting");
    }

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      holdingRef.current = false;
    };
  }, [open, progress?.boxOpened]);

  if (!open) {
    return null;
  }

  function stopHolding() {
    holdingRef.current = false;
    window.cancelAnimationFrame(animationFrameRef.current);

    if (stage === "holding") {
      setStage("waiting");
      setHoldProgress(0);
    }
  }

  function updateHold(now) {
    if (!holdingRef.current) {
      return;
    }

    const elapsed = now - holdStartRef.current;
    const percentage = Math.min(100, (elapsed / HOLD_DURATION) * 100);

    setHoldProgress(percentage);

    if (percentage >= 100) {
      holdingRef.current = false;
      setStage("countdown");

      window.setTimeout(() => setStage("opening"), 700);
      window.setTimeout(() => {
        setStage("reward");
        onOpened?.();
      }, 2300);

      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(updateHold);
  }

  function startHolding(event) {
    event.preventDefault();

    if (!unlocked || stage !== "waiting") {
      return;
    }

    holdingRef.current = true;
    holdStartRef.current = performance.now();
    setStage("holding");

    animationFrameRef.current = window.requestAnimationFrame(updateHold);
  }

  return (
    <div
      className={`${styles.mysteryOverlay} ${
        stage === "opening" || stage === "reward"
          ? styles.mysteryOverlayOpened
          : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="TMGM Mystery Box chamber"
    >
      <div className={styles.mysteryFog} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className={styles.mysteryBeam} aria-hidden="true" />

      <button
        type="button"
        className={styles.mysteryCloseButton}
        onClick={onClose}
        aria-label="Close mystery box"
      >
        ×
      </button>

      {stage !== "reward" ? (
        <section className={styles.mysteryChamber}>
          <header className={styles.mysteryTitle}>
            <span>GOLDEN CASTLE</span>
            <h1>THE FINAL CHAMBER</h1>
            <p>
              {unlocked
                ? "Your journey is complete. Hold the lock to reveal the demo reward card."
                : `Complete all ${TOTAL_MISSIONS} missions before entering the final chamber.`}
            </p>
          </header>

          <div
            className={`${styles.finalBox} ${
              stage === "holding" ? styles.finalBoxCharging : ""
            } ${stage === "opening" ? styles.finalBoxOpening : ""}`}
          >
            <div className={styles.finalBoxAura} />
            <div className={styles.finalBoxLight} />

            <div className={styles.finalBoxLid}>
              <span>TMGM</span>
            </div>

            <div className={styles.finalBoxBody}>
              <strong>MARKET CITY</strong>
              <span>FINAL DEMO CHEST</span>
            </div>

            <button
              type="button"
              className={styles.finalBoxLock}
              disabled={!unlocked || stage === "opening"}
              onPointerDown={startHolding}
              onPointerUp={stopHolding}
              onPointerCancel={stopHolding}
              onPointerLeave={stopHolding}
              onContextMenu={(event) => event.preventDefault()}
              aria-label="Hold to unlock the mystery box"
            >
              <span
                style={{
                  background: `conic-gradient(#f6cf66 ${holdProgress * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                }}
              >
                <i>T</i>
              </span>
            </button>
          </div>

          {stage === "countdown" ? (
            <div className={styles.boxCountdown}>
              <span>3</span>
              <span>2</span>
              <span>1</span>
            </div>
          ) : (
            <div className={styles.holdInstruction}>
              <div>
                <span style={{ width: `${holdProgress}%` }} />
              </div>

              <strong>
                {!unlocked
                  ? `${completedCount}/${TOTAL_MISSIONS} MISSIONS COMPLETED`
                  : stage === "holding"
                    ? `UNLOCKING ${Math.round(holdProgress)}%`
                    : "HOLD TO UNLOCK"}
              </strong>
            </div>
          )}
        </section>
      ) : (
        <>
          <Confetti />

          <div className={styles.goldenGuideFinal} aria-hidden="true">
            <div className={styles.goldenGuideHalo} />
            <div className={styles.goldenGuideHead}>
              <span>T</span>
              <i />
              <i />
            </div>
            <strong>TMGM</strong>
          </div>

          <RewardCard progress={progress} onRestart={onRestart} />
        </>
      )}
    </div>
  );
}
