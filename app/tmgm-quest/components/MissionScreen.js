"use client";

import { useEffect, useMemo, useState } from "react";
import { evaluateMission } from "../game/saveSystem";
import styles from "../tmgm-quest.module.css";

function moveItem(list, fromIndex, direction) {
  const targetIndex = fromIndex + direction;

  if (targetIndex < 0 || targetIndex >= list.length) {
    return list;
  }

  const next = [...list];
  const temporary = next[fromIndex];

  next[fromIndex] = next[targetIndex];
  next[targetIndex] = temporary;

  return next;
}

function getSequenceItems(mission) {
  if (Array.isArray(mission?.items)) {
    return mission.items;
  }

  if (Array.isArray(mission?.options)) {
    return mission.options;
  }

  if (Array.isArray(mission?.sequence)) {
    return mission.sequence;
  }

  return [];
}

function ChoiceChallenge({
  mission,
  selectedAnswer,
  disabled,
  onSelect,
}) {
  const options = Array.isArray(mission.options) ? mission.options : [];

  return (
    <div className={styles.missionChoices}>
      {options.map((option, index) => {
        const value =
          typeof option === "object"
            ? option.value ?? option.id ?? option.text
            : option;

        const label =
          typeof option === "object"
            ? option.label ?? option.text ?? option.value
            : option;

        return (
          <button
            type="button"
            key={`${mission.id}-${index}`}
            disabled={disabled}
            className={`${styles.missionChoice} ${
              selectedAnswer === value ? styles.missionChoiceSelected : ""
            }`}
            onClick={() => onSelect(value)}
          >
            <span>{String.fromCharCode(65 + index)}</span>
            <strong>{label}</strong>
          </button>
        );
      })}
    </div>
  );
}

function SequenceChallenge({ items, disabled, onChange }) {
  return (
    <div className={styles.sequenceChallenge}>
      <p>Arrange the steps in the safest and most disciplined order.</p>

      <div className={styles.sequenceList}>
        {items.map((item, index) => (
          <article key={`${item}-${index}`} className={styles.sequenceItem}>
            <span className={styles.sequenceNumber}>{index + 1}</span>

            <strong>{item}</strong>

            <div className={styles.sequenceButtons}>
              <button
                type="button"
                disabled={disabled || index === 0}
                onClick={() => onChange(moveItem(items, index, -1))}
                aria-label={`Move ${item} up`}
              >
                ↑
              </button>

              <button
                type="button"
                disabled={disabled || index === items.length - 1}
                onClick={() => onChange(moveItem(items, index, 1))}
                aria-label={`Move ${item} down`}
              >
                ↓
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ResultPanel({
  correct,
  mission,
  alreadyCompleted,
  onContinue,
  onRetry,
}) {
  return (
    <div
      className={`${styles.missionResult} ${
        correct ? styles.missionResultCorrect : styles.missionResultWrong
      }`}
    >
      <div className={styles.missionResultIcon}>
        {correct ? "✓" : "!"}
      </div>

      <div>
        <small>{correct ? "DECISION ACCEPTED" : "RISK ALERT"}</small>

        <strong>
          {correct
            ? alreadyCompleted
              ? "Mission Reviewed"
              : "Mission Completed"
            : "Review Your Decision"}
        </strong>

        <p>
          {correct
            ? mission.successMessage ||
              mission.explanation ||
              "A disciplined decision protects the plan and keeps Risk Heat under control."
            : mission.hint ||
              "Slow down, review the available information and try again."}
        </p>
      </div>

      {correct ? (
        <div className={styles.missionRewardSummary}>
          <span>
            +{alreadyCompleted ? 0 : mission.points}
            <small>POINTS</small>
          </span>

          <span>
            +{alreadyCompleted ? 0 : mission.coins}
            <small>COINS</small>
          </span>
        </div>
      ) : null}

      <button type="button" onClick={correct ? onContinue : onRetry}>
        {correct ? "RETURN TO CITY" : "TRY AGAIN"}
      </button>
    </div>
  );
}

export default function MissionScreen({
  mission,
  open,
  alreadyCompleted = false,
  onClose,
  onCorrect,
  onWrong,
}) {
  const initialSequence = useMemo(
    () => getSequenceItems(mission),
    [mission]
  );

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [sequence, setSequence] = useState(initialSequence);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setSequence(getSequenceItems(mission));
    setResult(null);
    setSubmitting(false);
  }, [mission, open]);

  if (!open || !mission) {
    return null;
  }

  const isSequence = mission.kind === "sequence";

  const response = isSequence ? sequence : selectedAnswer;

  const canSubmit = isSequence
    ? sequence.length > 0
    : selectedAnswer !== null && selectedAnswer !== undefined;

  function submitMission() {
    if (!canSubmit || submitting) {
      return;
    }

    setSubmitting(true);

    const correct = evaluateMission(mission, response);

    if (correct) {
      setResult("correct");
      onCorrect?.(mission);
    } else {
      setResult("wrong");
      onWrong?.(mission);
    }

    setSubmitting(false);
  }

  function retryMission() {
    setSelectedAnswer(null);
    setSequence(getSequenceItems(mission));
    setResult(null);
  }

  return (
    <div
      className={`${styles.missionOverlay} ${
        mission.boss ? styles.bossMissionOverlay : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mission-title"
    >
      <div className={styles.missionBackdrop} />

      <section className={styles.missionScreen}>
        <div className={styles.missionEnergyFrame} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <header className={styles.missionHeader}>
          <div className={styles.missionHeaderIdentity}>
            <span className={styles.missionHeaderIcon}>
              {mission.boss ? "♛" : "T"}
            </span>

            <div>
              <small>
                {mission.boss
                  ? "DISTRICT BOSS MISSION"
                  : `MISSION ${mission.number}`}
              </small>

              <strong id="mission-title">{mission.title}</strong>
            </div>
          </div>

          <div className={styles.missionHeaderReward}>
            <span>
              +{mission.points}
              <small>POINTS</small>
            </span>

            <span>
              +{mission.coins}
              <small>COINS</small>
            </span>
          </div>

          <button
            type="button"
            className={styles.missionCloseButton}
            onClick={onClose}
            aria-label="Close mission"
          >
            ×
          </button>
        </header>

        <div className={styles.missionVisual}>
          <div className={styles.missionScanner}>
            <span className={styles.scannerGrid} />
            <span className={styles.scannerLine} />

            <div className={styles.scannerChart}>
              {[42, 65, 38, 72, 56, 84, 67, 91, 76, 95].map(
                (height, index) => (
                  <i
                    key={`${mission.id}-bar-${index}`}
                    style={{
                      height: `${height}%`,
                      animationDelay: `${index * 0.08}s`,
                    }}
                  />
                )
              )}
            </div>

            <strong>
              {mission.boss ? "BOSS DECISION SCAN" : "MARKET DECISION SCAN"}
            </strong>
          </div>
        </div>

        <div className={styles.missionContent}>
          {result ? (
            <ResultPanel
              correct={result === "correct"}
              mission={mission}
              alreadyCompleted={alreadyCompleted}
              onContinue={onClose}
              onRetry={retryMission}
            />
          ) : (
            <>
              <div className={styles.missionQuestion}>
                <small>TRADING SCENARIO</small>
                <h2>
                  {mission.question ||
                    mission.prompt ||
                    "Choose the most disciplined decision."}
                </h2>

                {mission.description ? <p>{mission.description}</p> : null}
              </div>

              {isSequence ? (
                <SequenceChallenge
                  items={sequence}
                  disabled={submitting}
                  onChange={setSequence}
                />
              ) : (
                <ChoiceChallenge
                  mission={mission}
                  selectedAnswer={selectedAnswer}
                  disabled={submitting}
                  onSelect={setSelectedAnswer}
                />
              )}

              <button
                type="button"
                className={styles.submitMissionButton}
                disabled={!canSubmit || submitting}
                onClick={submitMission}
              >
                <span>{submitting ? "SCANNING..." : "CONFIRM DECISION"}</span>
                <b>→</b>
              </button>
            </>
          )}
        </div>

        <footer className={styles.missionFooter}>
          <span>EDUCATIONAL SIMULATION</span>
          <p>
            This mission does not provide financial advice or guarantee trading
            results.
          </p>
        </footer>
      </section>
    </div>
  );
}
