"use client";

import { TOTAL_MISSIONS } from "../data/missionData";
import {
  getAccuracy,
  getPlayerLevel,
  getRank,
} from "../game/saveSystem";
import styles from "../tmgm-quest.module.css";

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(Number(value) || 0, minimum), maximum);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value) || 0);
}

export default function GameHUD({
  progress,
  vehicleState,
  district,
  soundEnabled = true,
  missionAvailable = false,
  gamePaused = false,
  onToggleSound,
  onOpenPhone,
  onOpenMap,
  onOpenMission,
}) {
  const safeProgress = progress || {};
  const safeVehicle = vehicleState || {};

  const completedCount = Array.isArray(safeProgress.completedMissions)
    ? safeProgress.completedMissions.length
    : 0;

  const badgeCount = Array.isArray(safeProgress.badges)
    ? safeProgress.badges.length
    : 0;

  const points = Number(safeProgress.points) || 0;
  const coins = Number(safeProgress.coins) || 0;
  const riskHeat = clamp(safeProgress.riskHeat, 0, 100);
  const level = getPlayerLevel(safeProgress);
  const rank = getRank(safeProgress);
  const accuracy = getAccuracy(safeProgress);

  const journeyProgress = clamp(safeVehicle.journeyProgress, 0, 100);
  const missionProgress = clamp(
    (completedCount / Math.max(TOTAL_MISSIONS, 1)) * 100,
    0,
    100
  );

  const riskState =
    riskHeat >= 80
      ? "CRITICAL"
      : riskHeat >= 55
        ? "HIGH"
        : riskHeat >= 25
          ? "WATCH"
          : "STABLE";

  const speed = Math.max(0, Math.round(Number(safeVehicle.speed) || 0));

  return (
    <div className={styles.gameHud} aria-label="Player dashboard">
      <section className={styles.hudTopBar}>
        <div className={styles.hudIdentity}>
          <div className={styles.hudLogo} aria-hidden="true">
            T
          </div>

          <div>
            <strong>TMGM MARKET CITY</strong>
            <span>{rank}</span>
          </div>
        </div>

        <div className={styles.hudStats}>
          <div className={styles.hudStat}>
            <span>LEVEL</span>
            <strong>{level}</strong>
          </div>

          <div className={styles.hudStat}>
            <span>POINTS</span>
            <strong>{formatNumber(points)}</strong>
          </div>

          <div className={styles.hudStat}>
            <span>CITY COINS</span>
            <strong>{formatNumber(coins)}</strong>
          </div>

          <div className={styles.hudStat}>
            <span>MISSIONS</span>
            <strong>
              {completedCount}/{TOTAL_MISSIONS}
            </strong>
          </div>

          <div className={styles.hudStat}>
            <span>BADGES</span>
            <strong>{badgeCount}/6</strong>
          </div>

          <div className={styles.hudStat}>
            <span>ACCURACY</span>
            <strong>{accuracy}%</strong>
          </div>
        </div>

        <div className={styles.hudActions}>
          <button
            type="button"
            className={styles.hudIconButton}
            onClick={onToggleSound}
            aria-label={soundEnabled ? "Mute game sound" : "Enable game sound"}
            title={soundEnabled ? "Mute sound" : "Enable sound"}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>

          <button
            type="button"
            className={styles.hudIconButton}
            onClick={onOpenMap}
            aria-label="Open city map"
            title="City map"
          >
            ◈
          </button>

          <button
            type="button"
            className={styles.hudPhoneButton}
            onClick={onOpenPhone}
            aria-label="Open city phone"
          >
            <span aria-hidden="true">P</span>
            <strong>CITY PHONE</strong>
          </button>
        </div>
      </section>

      <section className={styles.hudLeftPanel}>
        <div className={styles.districtIndicator}>
          <span className={styles.liveDot} aria-hidden="true" />

          <div>
            <small>CURRENT DISTRICT</small>
            <strong>{district?.name || "TMGM Downtown"}</strong>
            <span>
              {Math.round(Number(district?.distance) || 0)} meters from gate
            </span>
          </div>
        </div>

        <div className={styles.journeyMeter}>
          <div className={styles.hudMeterHeader}>
            <span>CITY JOURNEY</span>
            <strong>{Math.round(journeyProgress)}%</strong>
          </div>

          <div className={styles.hudMeterTrack}>
            <span
              className={styles.hudMeterFill}
              style={{ width: `${journeyProgress}%` }}
            />
          </div>
        </div>

        <div className={styles.journeyMeter}>
          <div className={styles.hudMeterHeader}>
            <span>MYSTERY BOX</span>
            <strong>{Math.round(missionProgress)}%</strong>
          </div>

          <div
            className={`${styles.hudMeterTrack} ${styles.boxProgressTrack}`}
          >
            <span
              className={styles.boxProgressFill}
              style={{ width: `${missionProgress}%` }}
            />
          </div>
        </div>
      </section>

      <section
        className={`${styles.riskHud} ${
          riskHeat >= 80
            ? styles.riskCritical
            : riskHeat >= 55
              ? styles.riskHigh
              : ""
        }`}
      >
        <div className={styles.riskHudHeader}>
          <div>
            <span>RISK HEAT</span>
            <strong>{riskState}</strong>
          </div>

          <b>{Math.round(riskHeat)}%</b>
        </div>

        <div className={styles.riskTrack}>
          <span
            className={styles.riskFill}
            style={{ width: `${riskHeat}%` }}
          />
        </div>

        <p>
          {riskHeat >= 80
            ? "Critical risk detected. Slow down and review your plan."
            : riskHeat >= 55
              ? "High risk level. Avoid rushed decisions."
              : "Maintain discipline to keep the city stable."}
        </p>
      </section>

      <section className={styles.speedometer}>
        <div className={styles.speedometerRing}>
          <span>SPEED</span>
          <strong>{speed}</strong>
          <small>KM/H</small>
        </div>

        <div className={styles.vehicleStatus}>
          <span className={safeVehicle.braking ? styles.statusActive : ""}>
            BRAKE
          </span>

          <span className={safeVehicle.handbrake ? styles.statusActive : ""}>
            DRIFT
          </span>

          <span className={gamePaused ? styles.statusWarning : ""}>
            {gamePaused ? "PAUSED" : "DRIVE"}
          </span>
        </div>
      </section>

      {missionAvailable && !gamePaused ? (
        <button
          type="button"
          className={styles.enterMissionPrompt}
          onClick={onOpenMission}
        >
          <span className={styles.promptKey}>E</span>

          <span>
            <strong>ENTER MISSION</strong>
            <small>Trading challenge available at this gate</small>
          </span>
        </button>
      ) : null}

      <section className={styles.desktopControlsHint}>
        <span>
          <kbd>W</kbd>
          <kbd>↑</kbd> Accelerate
        </span>

        <span>
          <kbd>S</kbd>
          <kbd>↓</kbd> Brake
        </span>

        <span>
          <kbd>A</kbd>
          <kbd>D</kbd> Steer
        </span>

        <span>
          <kbd>SPACE</kbd> Handbrake
        </span>

        <span>
          <kbd>E</kbd> Mission
        </span>

        <span>
          <kbd>P</kbd> Phone
        </span>

        <span>
          <kbd>R</kbd> Reset Car
        </span>
      </section>
    </div>
  );
}
