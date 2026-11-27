"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../tmgm-quest.module.css";

const EXPRESSIONS = {
  idle: {
    symbol: "•",
    label: "CITY GUIDE",
  },
  thinking: {
    symbol: "?",
    label: "ANALYZING",
  },
  success: {
    symbol: "✓",
    label: "MISSION SUCCESS",
  },
  warning: {
    symbol: "!",
    label: "RISK WARNING",
  },
  golden: {
    symbol: "✦",
    label: "GOLDEN MODE",
  },
};

export default function TMGMGuide({
  visible = true,
  mood = "idle",
  message = "Welcome to TMGM Market City. Drive to the first gate and complete your trading mission.",
  compact = false,
  golden = false,
  onDismiss,
}) {
  const guideRef = useRef(null);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const activeMood = golden ? "golden" : mood;
  const expression = EXPRESSIONS[activeMood] || EXPRESSIONS.idle;

  useEffect(() => {
    function handlePointerMove(event) {
      const guide = guideRef.current;

      if (!guide) {
        return;
      }

      const rectangle = guide.getBoundingClientRect();

      const centerX = rectangle.left + rectangle.width / 2;
      const centerY = rectangle.top + rectangle.height / 2;

      const differenceX = event.clientX - centerX;
      const differenceY = event.clientY - centerY;

      const distance = Math.max(
        Math.sqrt(differenceX ** 2 + differenceY ** 2),
        1
      );

      const maximumMovement = 3.5;

      setEyePosition({
        x: (differenceX / distance) * maximumMovement,
        y: (differenceY / distance) * maximumMovement,
      });
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <aside
      ref={guideRef}
      className={`${styles.tmgmGuide} ${
        styles[`guideMood${activeMood[0].toUpperCase()}${activeMood.slice(1)}`]
      } ${compact ? styles.guideCompact : ""} ${
        golden ? styles.guideGolden : ""
      }`}
      aria-live="polite"
    >
      <div className={styles.guideDataField} aria-hidden="true">
        <span>MARKET</span>
        <span>RISK</span>
        <span>PLAN</span>
        <span>TMGM</span>
      </div>

      <div className={styles.guideCharacter}>
        <div className={styles.guideHalo} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className={styles.guideAntenna} aria-hidden="true">
          <i />
        </div>

        <div className={styles.guideHead}>
          <div className={styles.guideFaceGlow} />

          <div className={styles.guideEyes}>
            <i
              style={{
                transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
              }}
            />

            <i
              style={{
                transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
              }}
            />
          </div>

          <strong className={styles.guideLetter}>T</strong>

          <span className={styles.guideExpression}>
            {expression.symbol}
          </span>
        </div>

        <div className={styles.guideNeck} />

        <div className={styles.guideBody}>
          <span className={styles.guideShoulder} />
          <span className={styles.guideShoulder} />

          <div className={styles.guideChest}>
            <strong>TMGM</strong>
            <i />
          </div>

          <span className={styles.guideEnergyLine} />
        </div>

        <div className={styles.guideShadow} />
      </div>

      <div className={styles.guideMessage}>
        <div className={styles.guideMessageHeader}>
          <span className={styles.guideStatusDot} />
          <strong>TMGM GUIDE</strong>
          <small>{expression.label}</small>
        </div>

        <p>{message}</p>

        {onDismiss ? (
          <button
            type="button"
            className={styles.guideDismissButton}
            onClick={onDismiss}
            aria-label="Dismiss guide message"
          >
            ×
          </button>
        ) : null}
      </div>
    </aside>
  );
}
