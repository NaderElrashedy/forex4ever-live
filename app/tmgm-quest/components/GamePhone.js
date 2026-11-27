"use client";

import { useMemo, useState } from "react";
import {
  DISTRICTS,
  TOTAL_MISSIONS,
  getDistrictMissions,
} from "../data/missionData";
import {
  getAccuracy,
  getDistrictCompletion,
  getPlayerLevel,
  getRank,
  isMissionCompleted,
  isMissionUnlocked,
} from "../game/saveSystem";
import styles from "../tmgm-quest.module.css";

const APPLICATIONS = [
  { id: "home", name: "City Home", icon: "◈" },
  { id: "map", name: "City Map", icon: "⌖" },
  { id: "missions", name: "Missions", icon: "◆" },
  { id: "risk", name: "Risk Scanner", icon: "⬡" },
  { id: "profile", name: "Player Profile", icon: "◎" },
  { id: "badges", name: "Badges", icon: "✦" },
  { id: "garage", name: "Garage", icon: "▰" },
  { id: "box", name: "Mystery Box", icon: "▣" },
  { id: "settings", name: "Settings", icon: "⚙" },
];

const UPGRADE_DETAILS = {
  engine: {
    name: "Engine Core",
    icon: "⚡",
    description: "Raises the vehicle's maximum speed.",
    prices: [300, 650, 1100],
  },
  handling: {
    name: "Neon Handling",
    icon: "◉",
    description: "Improves steering response across the city.",
    prices: [250, 600, 1000],
  },
  shield: {
    name: "Risk Shield",
    icon: "⬡",
    description: "Represents stronger capital protection discipline.",
    prices: [350, 700, 1200],
  },
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value) || 0);
}

function AppHeader({ title, subtitle, onBack }) {
  return (
    <header className={styles.phoneAppHeader}>
      {onBack ? (
        <button
          type="button"
          className={styles.phoneBackButton}
          onClick={onBack}
          aria-label="Return to phone home"
        >
          ‹
        </button>
      ) : null}

      <div>
        <strong>{title}</strong>
        {subtitle ? <span>{subtitle}</span> : null}
      </div>

      <span className={styles.phoneSignal} aria-hidden="true">
        5G
      </span>
    </header>
  );
}

function PhoneHome({ progress, activeDistrict, onOpenApp }) {
  const completed = progress.completedMissions?.length || 0;
  const completion = Math.round(
    (completed / Math.max(TOTAL_MISSIONS, 1)) * 100
  );

  return (
    <div className={styles.phoneHome}>
      <div className={styles.phoneHeroCard}>
        <span>WELCOME TO</span>
        <strong>TMGM MARKET CITY</strong>
        <p>
          Drive with discipline, complete educational missions and reach the
          Golden Castle.
        </p>

        <div>
          <span>{activeDistrict?.name || "TMGM Downtown"}</span>
          <b>{completion}% COMPLETE</b>
        </div>
      </div>

      <div className={styles.phoneAppsGrid}>
        {APPLICATIONS.filter((application) => application.id !== "home").map(
          (application) => (
            <button
              type="button"
              key={application.id}
              className={styles.phoneAppIcon}
              onClick={() => onOpenApp(application.id)}
            >
              <span aria-hidden="true">{application.icon}</span>
              <strong>{application.name}</strong>
            </button>
          )
        )}
      </div>

      <div className={styles.phoneTip}>
        <span aria-hidden="true">T</span>

        <p>
          Correct decisions lower Risk Heat. Rushed decisions make the city
          unstable.
        </p>
      </div>
    </div>
  );
}

function CityMap({
  progress,
  activeDistrict,
  onSelectMission,
  onOpenMissions,
}) {
  return (
    <div className={styles.phoneMap}>
      <div className={styles.mapRoad} aria-hidden="true" />

      {DISTRICTS.map((district, index) => {
        const completion = getDistrictCompletion(progress, district.id);
        const missions = getDistrictMissions(district.id);
        const firstMission = missions[0];
        const unlocked = firstMission
          ? isMissionUnlocked(progress, firstMission)
          : false;

        return (
          <button
            type="button"
            key={district.id}
            className={`${styles.mapDistrict} ${
              activeDistrict?.id === district.id
                ? styles.mapDistrictActive
                : ""
            } ${!unlocked ? styles.mapDistrictLocked : ""}`}
            style={{
              "--district-color": district.color,
              "--district-index": index,
            }}
            onClick={() => {
              if (unlocked) {
                onOpenMissions(district.id);
              }
            }}
          >
            <span className={styles.mapDistrictIcon}>
              {unlocked ? district.icon : "◇"}
            </span>

            <span>
              <strong>{district.name}</strong>
              <small>
                {unlocked ? `${completion}% completed` : "District locked"}
              </small>
            </span>

            {completion === 100 ? (
              <b className={styles.mapComplete}>✓</b>
            ) : null}
          </button>
        );
      })}

      <button
        type="button"
        className={styles.mapGpsButton}
        onClick={onSelectMission}
      >
        FIND NEXT MISSION
      </button>
    </div>
  );
}

function MissionList({ progress, selectedDistrict, onStartMission }) {
  const district =
    DISTRICTS.find((item) => item.id === selectedDistrict) || DISTRICTS[0];

  const missions = getDistrictMissions(district.id);

  return (
    <div className={styles.phoneMissionList}>
      <div
        className={styles.phoneDistrictBanner}
        style={{ "--district-color": district.color }}
      >
        <span aria-hidden="true">{district.icon}</span>

        <div>
          <strong>{district.name}</strong>
          <p>{district.description}</p>
        </div>
      </div>

      {missions.map((mission) => {
        const completed = isMissionCompleted(progress, mission.id);
        const unlocked = isMissionUnlocked(progress, mission);

        return (
          <button
            type="button"
            key={mission.id}
            disabled={!unlocked}
            className={`${styles.phoneMissionCard} ${
              completed ? styles.phoneMissionComplete : ""
            } ${!unlocked ? styles.phoneMissionLocked : ""}`}
            onClick={() => onStartMission(mission)}
          >
            <span className={styles.phoneMissionNumber}>
              {completed ? "✓" : mission.number}
            </span>

            <span className={styles.phoneMissionInfo}>
              <strong>{mission.title}</strong>
              <small>
                {mission.boss ? "DISTRICT BOSS" : "TRADING MISSION"}
              </small>
            </span>

            <span className={styles.phoneMissionReward}>
              +{mission.points}
              <small>PTS</small>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function RiskScanner({ progress }) {
  const risk = Math.min(Math.max(Number(progress.riskHeat) || 0, 0), 100);

  const state =
    risk >= 80
      ? {
          title: "Critical Exposure",
          color: "#ff476f",
          message:
            "Stop and review the plan. Avoid rushed or emotional decisions.",
        }
      : risk >= 55
        ? {
            title: "High Risk",
            color: "#ff9f43",
            message:
              "Reduce decision speed and focus on capital protection.",
          }
        : risk >= 25
          ? {
              title: "Risk Watch",
              color: "#f6cf66",
              message:
                "The city is stable, but discipline must remain active.",
            }
          : {
              title: "Stable Discipline",
              color: "#56efb1",
              message:
                "Your decisions currently reflect controlled risk behavior.",
            };

  return (
    <div className={styles.riskScannerApp}>
      <div
        className={styles.riskScannerOrb}
        style={{
          "--risk-value": `${risk * 3.6}deg`,
          "--risk-color": state.color,
        }}
      >
        <div>
          <strong>{Math.round(risk)}%</strong>
          <span>RISK HEAT</span>
        </div>
      </div>

      <div className={styles.riskScannerResult}>
        <small>CURRENT STATUS</small>
        <strong style={{ color: state.color }}>{state.title}</strong>
        <p>{state.message}</p>
      </div>

      <ul className={styles.riskRules}>
        <li>
          <span>+</span>
          Risk Heat increases after incorrect or rushed decisions.
        </li>

        <li>
          <span>−</span>
          Correct mission decisions reduce Risk Heat.
        </li>

        <li>
          <span>!</span>
          Educational scores do not measure real trading performance.
        </li>
      </ul>
    </div>
  );
}

function PlayerProfile({ progress }) {
  const completed = progress.completedMissions?.length || 0;
  const accuracy = getAccuracy(progress);
  const level = getPlayerLevel(progress);
  const rank = getRank(progress);

  return (
    <div className={styles.phoneProfile}>
      <div className={styles.profileAvatar}>
        <span>T</span>
        <i />
      </div>

      <strong>{rank}</strong>
      <span>TMGM Market City Driver</span>

      <div className={styles.profileStats}>
        <div>
          <strong>{level}</strong>
          <span>LEVEL</span>
        </div>

        <div>
          <strong>{formatNumber(progress.points)}</strong>
          <span>POINTS</span>
        </div>

        <div>
          <strong>{accuracy}%</strong>
          <span>ACCURACY</span>
        </div>

        <div>
          <strong>
            {completed}/{TOTAL_MISSIONS}
          </strong>
          <span>MISSIONS</span>
        </div>
      </div>

      <div className={styles.profileRecord}>
        <div>
          <span>Correct decisions</span>
          <strong>{progress.correctAnswers || 0}</strong>
        </div>

        <div>
          <span>Incorrect attempts</span>
          <strong>{progress.wrongAnswers || 0}</strong>
        </div>

        <div>
          <span>City Coins</span>
          <strong>{formatNumber(progress.coins)}</strong>
        </div>
      </div>
    </div>
  );
}

function BadgesApp({ progress }) {
  const earnedBadges = Array.isArray(progress.badges)
    ? progress.badges
    : [];

  return (
    <div className={styles.badgesGrid}>
      {DISTRICTS.map((district) => {
        const unlocked = earnedBadges.includes(district.badge);
        const completion = getDistrictCompletion(progress, district.id);

        return (
          <div
            key={district.id}
            className={`${styles.badgeCard} ${
              unlocked ? styles.badgeUnlocked : styles.badgeLocked
            }`}
            style={{ "--badge-color": district.color }}
          >
            <span aria-hidden="true">{unlocked ? district.icon : "◇"}</span>
            <strong>{district.badge}</strong>
            <small>
              {unlocked ? "BADGE UNLOCKED" : `${completion}% COMPLETED`}
            </small>
          </div>
        );
      })}
    </div>
  );
}

function GarageApp({ progress, onPurchaseUpgrade }) {
  const [message, setMessage] = useState("");

  function purchase(type) {
    const result = onPurchaseUpgrade?.(type);

    if (typeof result === "string") {
      setMessage(result);
    } else if (result?.message) {
      setMessage(result.message);
    }
  }

  return (
    <div className={styles.garageApp}>
      <div className={styles.garageBalance}>
        <span>AVAILABLE CITY COINS</span>
        <strong>{formatNumber(progress.coins)}</strong>
      </div>

      <div className={styles.garageVehicle}>
        <div className={styles.garageCar}>
          <span />
          <i />
          <b />
        </div>

        <p>
          Upgrade the city vehicle with educational coins earned from
          missions.
        </p>
      </div>

      <div className={styles.upgradeList}>
        {Object.entries(UPGRADE_DETAILS).map(([type, detail]) => {
          const currentLevel = Number(progress.upgrades?.[type]) || 0;
          const maximumLevel = detail.prices.length;
          const price = detail.prices[currentLevel];

          return (
            <article key={type} className={styles.upgradeCard}>
              <span className={styles.upgradeIcon}>{detail.icon}</span>

              <div className={styles.upgradeInfo}>
                <strong>{detail.name}</strong>
                <p>{detail.description}</p>

                <div className={styles.upgradeLevels}>
                  {Array.from({ length: maximumLevel }).map((_, index) => (
                    <span
                      key={`${type}-${index}`}
                      className={
                        index < currentLevel ? styles.upgradeLevelActive : ""
                      }
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={currentLevel >= maximumLevel}
                onClick={() => purchase(type)}
              >
                {currentLevel >= maximumLevel
                  ? "MAX LEVEL"
                  : `${formatNumber(price)} COINS`}
              </button>
            </article>
          );
        })}
      </div>

      {message ? <p className={styles.garageMessage}>{message}</p> : null}
    </div>
  );
}

function MysteryProgress({ progress, onOpenBox }) {
  const completed = progress.completedMissions?.length || 0;
  const percentage = Math.min(
    100,
    Math.round((completed / Math.max(TOTAL_MISSIONS, 1)) * 100)
  );

  const ready = completed >= TOTAL_MISSIONS;

  return (
    <div className={styles.phoneBoxApp}>
      <div
        className={`${styles.phoneMysteryBox} ${
          ready ? styles.phoneMysteryBoxReady : ""
        }`}
      >
        <span className={styles.phoneBoxLight} />
        <div className={styles.phoneBoxLid} />
        <div className={styles.phoneBoxBody}>TMGM</div>
        <div className={styles.phoneBoxLock}>{ready ? "✓" : "T"}</div>
      </div>

      <strong>{ready ? "THE BOX IS READY" : "MYSTERY BOX LOCKED"}</strong>

      <p>
        {ready
          ? "You completed all educational missions. The final chamber is now available."
          : `Complete all ${TOTAL_MISSIONS} missions to unlock the final chamber.`}
      </p>

      <div className={styles.phoneBoxProgress}>
        <span style={{ width: `${percentage}%` }} />
      </div>

      <b>{percentage}% COMPLETE</b>

      <button type="button" disabled={!ready} onClick={onOpenBox}>
        {progress.boxOpened ? "VIEW REWARD CARD" : "ENTER FINAL CHAMBER"}
      </button>
    </div>
  );
}

function SettingsApp({
  soundEnabled,
  onToggleSound,
  onReset,
  onClosePhone,
}) {
  return (
    <div className={styles.settingsApp}>
      <button type="button" onClick={onToggleSound}>
        <span>{soundEnabled ? "🔊" : "🔇"}</span>

        <div>
          <strong>Game Sound</strong>
          <small>{soundEnabled ? "Sound is enabled" : "Sound is muted"}</small>
        </div>

        <b>{soundEnabled ? "ON" : "OFF"}</b>
      </button>

      <button type="button" onClick={onClosePhone}>
        <span>▶</span>

        <div>
          <strong>Return to City</strong>
          <small>Close the phone and continue driving</small>
        </div>

        <b>OPEN</b>
      </button>

      <button
        type="button"
        className={styles.settingsDangerButton}
        onClick={onReset}
      >
        <span>↻</span>

        <div>
          <strong>Reset All Progress</strong>
          <small>Delete locally saved missions, points and upgrades</small>
        </div>

        <b>RESET</b>
      </button>

      <p className={styles.phoneDemoNotice}>
        This is a promotional demo version. Any reward displayed inside the
        game does not represent a real prize or guarantee that it will be
        awarded.
      </p>
    </div>
  );
}

export default function GamePhone({
  open,
  progress,
  activeDistrict,
  initialApp = "home",
  soundEnabled = true,
  onClose,
  onStartMission,
  onFindNextMission,
  onPurchaseUpgrade,
  onOpenMysteryBox,
  onToggleSound,
  onReset,
}) {
  const [activeApp, setActiveApp] = useState(initialApp);
  const [selectedDistrict, setSelectedDistrict] = useState(
    activeDistrict?.id || DISTRICTS[0]?.id
  );

  const title = useMemo(() => {
    return (
      APPLICATIONS.find((application) => application.id === activeApp)?.name ||
      "City Phone"
    );
  }, [activeApp]);

  if (!open) {
    return null;
  }

  function openMissions(districtId) {
    setSelectedDistrict(districtId || DISTRICTS[0]?.id);
    setActiveApp("missions");
  }

  function returnHome() {
    setActiveApp("home");
  }

  function renderApplication() {
    switch (activeApp) {
      case "map":
        return (
          <CityMap
            progress={progress}
            activeDistrict={activeDistrict}
            onOpenMissions={openMissions}
            onSelectMission={onFindNextMission}
          />
        );

      case "missions":
        return (
          <MissionList
            progress={progress}
            selectedDistrict={selectedDistrict}
            onStartMission={onStartMission}
          />
        );

      case "risk":
        return <RiskScanner progress={progress} />;

      case "profile":
        return <PlayerProfile progress={progress} />;

      case "badges":
        return <BadgesApp progress={progress} />;

      case "garage":
        return (
          <GarageApp
            progress={progress}
            onPurchaseUpgrade={onPurchaseUpgrade}
          />
        );

      case "box":
        return (
          <MysteryProgress
            progress={progress}
            onOpenBox={onOpenMysteryBox}
          />
        );

      case "settings":
        return (
          <SettingsApp
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
            onReset={onReset}
            onClosePhone={onClose}
          />
        );

      case "home":
      default:
        return (
          <PhoneHome
            progress={progress}
            activeDistrict={activeDistrict}
            onOpenApp={(application) => {
              if (application === "missions") {
                openMissions(activeDistrict?.id);
              } else {
                setActiveApp(application);
              }
            }}
          />
        );
    }
  }

  return (
    <div className={styles.phoneOverlay} role="dialog" aria-modal="true">
      <button
        type="button"
        className={styles.phoneBackdrop}
        onClick={onClose}
        aria-label="Close city phone"
      />

      <section className={styles.gamePhone}>
        <div className={styles.phoneSpeaker} aria-hidden="true" />

        <div className={styles.phoneScreen}>
          <AppHeader
            title={activeApp === "home" ? "CITY PHONE" : title}
            subtitle="TMGM NETWORK"
            onBack={activeApp === "home" ? null : returnHome}
          />

          <div className={styles.phoneContent}>{renderApplication()}</div>

          <nav className={styles.phoneDock} aria-label="Phone navigation">
            <button
              type="button"
              onClick={() => setActiveApp("home")}
              className={activeApp === "home" ? styles.phoneDockActive : ""}
            >
              ◈
              <span>HOME</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveApp("map")}
              className={activeApp === "map" ? styles.phoneDockActive : ""}
            >
              ⌖
              <span>MAP</span>
            </button>

            <button
              type="button"
              onClick={() => openMissions(activeDistrict?.id)}
              className={
                activeApp === "missions" ? styles.phoneDockActive : ""
              }
            >
              ◆
              <span>MISSIONS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveApp("garage")}
              className={activeApp === "garage" ? styles.phoneDockActive : ""}
            >
              ▰
              <span>GARAGE</span>
            </button>
          </nav>
        </div>

        <button
          type="button"
          className={styles.phoneCloseButton}
          onClick={onClose}
          aria-label="Close phone"
        >
          ×
        </button>
      </section>
    </div>
  );
}
