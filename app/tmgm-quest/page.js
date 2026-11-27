"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import GameHUD from "./components/GameHUD";
import GamePhone from "./components/GamePhone";
import MissionScreen from "./components/MissionScreen";
import MobileControls from "./components/MobileControls";
import MysteryBox from "./components/MysteryBox";
import TMGMGuide from "./components/TMGMGuide";

import {
  DISTRICTS,
  MISSIONS,
  TOTAL_MISSIONS,
  getDistrictMissions,
} from "./data/missionData";

import {
  completeMission,
  isMissionCompleted,
  isMissionUnlocked,
  loadProgress,
  markBoxOpened,
  purchaseUpgrade,
  registerWrongAnswer,
  resetProgress,
  saveProgress,
} from "./game/saveSystem";

import { playSound } from "./game/audio";
import styles from "./tmgm-quest.module.css";

const GameCanvas = dynamic(() => import("./components/GameCanvas"), {
  ssr: false,
  loading: () => (
    <div className={styles.canvasLoading}>
      <div className={styles.loadingCore}>
        <span>T</span>
      </div>

      <strong>BUILDING TMGM MARKET CITY</strong>
      <p>Preparing the 3D world...</p>
    </div>
  ),
});

const GUIDE_MESSAGES = {
  welcome:
    "Welcome to TMGM Market City. Drive toward the illuminated gate and press E to enter your first educational mission.",
  ready:
    "A trading mission is available at this gate. Slow down, review the objective and press E when you are ready.",
  success:
    "Excellent decision. Discipline protected your plan, reduced Risk Heat and opened the next route.",
  warning:
    "A high-risk decision has been detected. Slow down, review your plan and try again.",
  locked:
    "This mission is still locked. Complete the earlier missions to open the next city route.",
  phone:
    "The City Phone contains your map, missions, Risk Scanner, badges, garage and Mystery Box progress.",
  golden:
    "You reached the Golden Castle. The final chamber is ready for the Market City Champion.",
};

function getInitialDistrict() {
  return DISTRICTS[0] || {
    id: "downtown",
    name: "TMGM Downtown",
    position: 20,
  };
}

function extractProgress(result, fallback) {
  if (!result) {
    return fallback;
  }

  if (result.progress && typeof result.progress === "object") {
    return result.progress;
  }

  if (
    typeof result === "object" &&
    Array.isArray(result.completedMissions)
  ) {
    return result;
  }

  return fallback;
}

function findNextMission(progress) {
  return (
    MISSIONS.find(
      (mission) =>
        isMissionUnlocked(progress, mission) &&
        !isMissionCompleted(progress, mission.id)
    ) || null
  );
}

export default function TMGMQuestPage() {
  const [hydrated, setHydrated] = useState(false);
  const [progress, setProgress] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState(getInitialDistrict());
  const [vehicleState, setVehicleState] = useState({
    speed: 0,
    journeyProgress: 0,
    braking: false,
    handbrake: false,
  });

  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phoneApp, setPhoneApp] = useState("home");
  const [phoneKey, setPhoneKey] = useState(0);
  const [missionOpen, setMissionOpen] = useState(false);
  const [activeMission, setActiveMission] = useState(null);
  const [mysteryBoxOpen, setMysteryBoxOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cityReady, setCityReady] = useState(false);
  const [deviceMode, setDeviceMode] = useState({
    lowQuality: false,
    reducedMotion: false,
  });

  const [guide, setGuide] = useState({
    visible: true,
    mood: "idle",
    message: GUIDE_MESSAGES.welcome,
  });

  useEffect(() => {
    const storedProgress = loadProgress();
    setProgress(storedProgress);
    setHydrated(true);
  }, []);

  const completedCount = progress?.completedMissions?.length || 0;
  const gameCompleted = completedCount >= TOTAL_MISSIONS;

  const nearestMission = useMemo(() => {
    if (!progress || !activeDistrict?.id) {
      return null;
    }

    const districtMissions = getDistrictMissions(activeDistrict.id);

    return (
      districtMissions.find(
        (mission) =>
          isMissionUnlocked(progress, mission) &&
          !isMissionCompleted(progress, mission.id)
      ) ||
      districtMissions.find((mission) =>
        isMissionUnlocked(progress, mission)
      ) ||
      null
    );
  }, [progress, activeDistrict]);

  const missionAvailable = Boolean(
    nearestMission &&
      Number(activeDistrict?.distance ?? 0) <= 14 &&
      !missionOpen &&
      !phoneOpen &&
      !mysteryBoxOpen
  );

  const gamePaused = phoneOpen || missionOpen || mysteryBoxOpen;

  const updateProgress = useCallback((nextProgress) => {
    if (!nextProgress) {
      return;
    }

    setProgress(nextProgress);
    saveProgress(nextProgress);
  }, []);

  function showGuide(mood, message, timeout = 0) {
    setGuide({
      visible: true,
      mood,
      message,
    });

    if (timeout > 0) {
      window.setTimeout(() => {
        setGuide({
          visible: true,
          mood: "idle",
          message: GUIDE_MESSAGES.welcome,
        });
      }, timeout);
    }
  }

  function openPhone(application = "home") {
    setPhoneApp(application);
    setPhoneKey((current) => current + 1);
    setPhoneOpen(true);

    if (application === "home") {
      showGuide("thinking", GUIDE_MESSAGES.phone);
    }

    playSound("phone", soundEnabled);
  }

  function closePhone() {
    setPhoneOpen(false);
  }

  function startMission(mission) {
    if (!mission || !progress) {
      return;
    }

    if (!isMissionUnlocked(progress, mission)) {
      showGuide("warning", GUIDE_MESSAGES.locked, 3500);
      playSound("wrong", soundEnabled);
      return;
    }

    setPhoneOpen(false);
    setActiveMission(mission);
    setMissionOpen(true);
    setGuide({
      visible: true,
      mood: "thinking",
      message:
        "Analyze the scenario carefully. The safest disciplined decision is more important than speed.",
    });
  }

  function requestMission(districtFromCanvas) {
    if (!progress) {
      return;
    }

    const requestedDistrict =
      districtFromCanvas?.id
        ? districtFromCanvas
        : activeDistrict;

    const missions = getDistrictMissions(requestedDistrict?.id);
    const availableMission =
      missions.find(
        (mission) =>
          isMissionUnlocked(progress, mission) &&
          !isMissionCompleted(progress, mission.id)
      ) ||
      missions.find((mission) => isMissionUnlocked(progress, mission)) ||
      nearestMission;

    if (!availableMission) {
      const nextMission = findNextMission(progress);

      if (nextMission) {
        showGuide(
          "thinking",
          "Your next mission is located in another district. Open the City Map to locate it.",
          4000
        );
        openPhone("map");
      } else if (gameCompleted) {
        setMysteryBoxOpen(true);
      }

      return;
    }

    startMission(availableMission);
  }

  function handleMissionCorrect(mission) {
    if (!progress || !mission) {
      return;
    }

    const result = completeMission(progress, mission);
    const nextProgress = extractProgress(result, progress);

    updateProgress(nextProgress);
    playSound("success", soundEnabled);

    const nextCompletedCount =
      nextProgress.completedMissions?.length || completedCount;

    if (nextCompletedCount >= TOTAL_MISSIONS) {
      showGuide("golden", GUIDE_MESSAGES.golden);
    } else {
      showGuide("success", GUIDE_MESSAGES.success, 4500);
    }
  }

  function handleMissionWrong() {
    if (!progress) {
      return;
    }

    const result = registerWrongAnswer(progress);
    const nextProgress = extractProgress(result, progress);

    updateProgress(nextProgress);
    playSound("wrong", soundEnabled);
    showGuide("warning", GUIDE_MESSAGES.warning);
  }

  function handlePurchaseUpgrade(type) {
    if (!progress) {
      return {
        progress,
        message: "Progress is still loading.",
      };
    }

    const result = purchaseUpgrade(progress, type);
    const nextProgress = extractProgress(result, progress);

    if (nextProgress !== progress) {
      updateProgress(nextProgress);
      playSound("coin", soundEnabled);
    }

    return result;
  }

  function handleBoxOpened() {
    if (!progress) {
      return;
    }

    const result = markBoxOpened(progress);
    const nextProgress = extractProgress(result, progress);

    updateProgress(nextProgress);
    playSound("box", soundEnabled);
    showGuide("golden", GUIDE_MESSAGES.golden);
  }

  function handleReset() {
    const accepted = window.confirm(
      "Reset all TMGM Market City progress saved on this device?"
    );

    if (!accepted) {
      return;
    }

    const resetResult = resetProgress();
    const cleanProgress =
      resetResult && typeof resetResult === "object"
        ? resetResult
        : loadProgress();

    setProgress(cleanProgress);
    setActiveMission(null);
    setMissionOpen(false);
    setPhoneOpen(false);
    setMysteryBoxOpen(false);
    setActiveDistrict(getInitialDistrict());
    setVehicleState({
      speed: 0,
      journeyProgress: 0,
      braking: false,
      handbrake: false,
    });

    setGuide({
      visible: true,
      mood: "idle",
      message: GUIDE_MESSAGES.welcome,
    });
  }

  function findMissionFromPhone() {
    if (!progress) {
      return;
    }

    const nextMission = findNextMission(progress);

    if (!nextMission) {
      if (gameCompleted) {
        setPhoneOpen(false);
        setMysteryBoxOpen(true);
      }

      return;
    }

    const district = DISTRICTS.find(
      (item) => item.id === nextMission.districtId
    );

    setPhoneOpen(false);

    showGuide(
      "thinking",
      district
        ? `GPS target selected: ${district.name}. Follow the illuminated city road to reach mission ${nextMission.number}.`
        : `GPS target selected: mission ${nextMission.number}.`,
      5000
    );
  }

  function restartJourney() {
    setMysteryBoxOpen(false);
    handleReset();
  }

  if (!hydrated || !progress) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loadingCity}>
          <span>T</span>
          <i />
          <i />
          <i />
        </div>

        <strong>TMGM MARKET CITY 3D</strong>
        <p>Loading your locally saved journey...</p>
      </main>
    );
  }

  return (
    <main className={styles.gamePage}>
      <div className={styles.gameWorld}>
        <GameCanvas
          progress={progress}
          gamePaused={gamePaused}
          onDistrictChange={(district) => {
            if (district) {
              setActiveDistrict(district);
            }
          }}
          onVehicleUpdate={(state) => {
            if (state) {
              setVehicleState(state);
            }
          }}
          onMissionRequest={requestMission}
          onTogglePhone={() => {
            if (phoneOpen) {
              closePhone();
            } else {
              openPhone("home");
            }
          }}
          onToggleMap={() => openPhone("map")}
          onReady={(mode) => {
            setCityReady(true);

            if (mode) {
              setDeviceMode(mode);
            }
          }}
        />

        <div className={styles.cityVignette} aria-hidden="true" />
        <div className={styles.cityScanlines} aria-hidden="true" />

        {!cityReady ? (
          <div className={styles.worldPreparing}>
            <span />
            <strong>INITIALIZING 3D CITY</strong>
          </div>
        ) : null}

        <header className={styles.gameNavigation}>
          <Link href="/" className={styles.gameBrand}>
            <span>T</span>

            <div>
              <strong>TMGM MARKET CITY</strong>
              <small>3D EDUCATIONAL EXPERIENCE</small>
            </div>
          </Link>

          <div className={styles.performanceMode}>
            <span
              className={deviceMode.lowQuality ? styles.modeWarning : ""}
            />
            {deviceMode.lowQuality ? "MOBILE MODE" : "CINEMATIC MODE"}
          </div>

          <Link href="/" className={styles.exitGame}>
            EXIT CITY
          </Link>
        </header>

        <GameHUD
          progress={progress}
          vehicleState={vehicleState}
          district={activeDistrict}
          soundEnabled={soundEnabled}
          missionAvailable={missionAvailable}
          gamePaused={gamePaused}
          onToggleSound={() => setSoundEnabled((current) => !current)}
          onOpenPhone={() => openPhone("home")}
          onOpenMap={() => openPhone("map")}
          onOpenMission={() => requestMission(activeDistrict)}
        />

        <TMGMGuide
          visible={
            guide.visible &&
            !phoneOpen &&
            !missionOpen &&
            !mysteryBoxOpen
          }
          mood={guide.mood}
          golden={guide.mood === "golden"}
          message={
            missionAvailable && guide.mood === "idle"
              ? GUIDE_MESSAGES.ready
              : guide.message
          }
          compact={false}
          onDismiss={() =>
            setGuide((current) => ({
              ...current,
              visible: false,
            }))
          }
        />

        <MobileControls
          missionAvailable={missionAvailable}
          hidden={gamePaused}
        />

        <div className={styles.demoRibbon}>
          PROMOTIONAL DEMO · EDUCATIONAL SIMULATION · NO REAL PRIZE GUARANTEED
        </div>
      </div>

      <GamePhone
        key={phoneKey}
        open={phoneOpen}
        progress={progress}
        activeDistrict={activeDistrict}
        initialApp={phoneApp}
        soundEnabled={soundEnabled}
        onClose={closePhone}
        onStartMission={startMission}
        onFindNextMission={findMissionFromPhone}
        onPurchaseUpgrade={handlePurchaseUpgrade}
        onOpenMysteryBox={() => {
          if (gameCompleted) {
            setPhoneOpen(false);
            setMysteryBoxOpen(true);
          }
        }}
        onToggleSound={() => setSoundEnabled((current) => !current)}
        onReset={handleReset}
      />

      <MissionScreen
        mission={activeMission}
        open={missionOpen}
        alreadyCompleted={
          activeMission
            ? isMissionCompleted(progress, activeMission.id)
            : false
        }
        onClose={() => {
          setMissionOpen(false);
          setActiveMission(null);
        }}
        onCorrect={handleMissionCorrect}
        onWrong={handleMissionWrong}
      />

      <MysteryBox
        open={mysteryBoxOpen}
        progress={progress}
        onClose={() => setMysteryBoxOpen(false)}
        onOpened={handleBoxOpened}
        onRestart={restartJourney}
      />
    </main>
  );
}
