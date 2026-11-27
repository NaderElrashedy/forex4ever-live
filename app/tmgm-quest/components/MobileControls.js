"use client";

import styles from "../tmgm-quest.module.css";

const CONTROL_EVENT = "tmgm-mobile-control";

function dispatchControl(detail) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(CONTROL_EVENT, {
      detail,
    })
  );
}

function ControlButton({
  children,
  control,
  action,
  className = "",
  label,
}) {
  function activate(event) {
    event.preventDefault();

    if (action) {
      dispatchControl({ action });
      return;
    }

    dispatchControl({
      control,
      active: true,
    });
  }

  function deactivate(event) {
    event.preventDefault();

    if (!action) {
      dispatchControl({
        control,
        active: false,
      });
    }
  }

  return (
    <button
      type="button"
      className={`${styles.mobileControlButton} ${className}`}
      aria-label={label}
      onPointerDown={activate}
      onPointerUp={deactivate}
      onPointerCancel={deactivate}
      onPointerLeave={deactivate}
      onContextMenu={(event) => event.preventDefault()}
    >
      {children}
    </button>
  );
}

export default function MobileControls({
  missionAvailable = false,
  hidden = false,
}) {
  if (hidden) {
    return null;
  }

  return (
    <div
      className={styles.mobileControls}
      aria-label="Mobile driving controls"
    >
      <div className={styles.mobileSteering}>
        <ControlButton
          control="left"
          className={styles.steerButton}
          label="Steer left"
        >
          <span aria-hidden="true">◀</span>
        </ControlButton>

        <ControlButton
          control="right"
          className={styles.steerButton}
          label="Steer right"
        >
          <span aria-hidden="true">▶</span>
        </ControlButton>
      </div>

      <div className={styles.mobileQuickActions}>
        <ControlButton
          action="phone"
          className={styles.quickActionButton}
          label="Open city phone"
        >
          <span aria-hidden="true">P</span>
          <small>PHONE</small>
        </ControlButton>

        <ControlButton
          action="mission"
          className={`${styles.quickActionButton} ${
            missionAvailable ? styles.missionActionReady : ""
          }`}
          label="Enter nearest mission"
        >
          <span aria-hidden="true">E</span>
          <small>MISSION</small>
        </ControlButton>

        <ControlButton
          control="handbrake"
          className={styles.quickActionButton}
          label="Use handbrake"
        >
          <span aria-hidden="true">!</span>
          <small>BRAKE</small>
        </ControlButton>
      </div>

      <div className={styles.mobilePedals}>
        <ControlButton
          control="brake"
          className={`${styles.pedalButton} ${styles.brakePedal}`}
          label="Brake or reverse"
        >
          <span aria-hidden="true">▼</span>
          <small>BRAKE</small>
        </ControlButton>

        <ControlButton
          control="accelerate"
          className={`${styles.pedalButton} ${styles.acceleratorPedal}`}
          label="Accelerate"
        >
          <span aria-hidden="true">▲</span>
          <small>GAS</small>
        </ControlButton>
      </div>
    </div>
  );
}
