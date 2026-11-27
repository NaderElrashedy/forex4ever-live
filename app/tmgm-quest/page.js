"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

import {
  playSound,
  setAudioEnabled,
  startEngineSound,
  stopEngineSound,
  unlockAudio,
  updateEngineSound,
} from "./game/audio";

import styles from "./tmgm-quest.module.css";

const GameCanvas = dynamic(
  () => import("./components/GameCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className={styles.canvasLoading}>
        <div className={styles.loadingCore}>T</div>

        <strong>BUILDING TMGM MARKET CITY</strong>

        <span>Preparing the 3D world...</span>
      </div>
    ),
  }
);

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
  return (
    DISTRICTS[0] || {
      id: "downtown",
      name: "TMGM Downtown",
      shortName: "Downtown",
      position: 20,
      color: "#31d7ff",
      icon: "◈",
    }
  );
}

function extractProgress(result, fallback) {
  if (!result) {
    return fallback;
  }

  if (result.progress) {
    return result.progress;
  }

  if (
    typeof result === "object" &&
    Object.prototype.hasOwnProperty.call(result, "points")
  ) {
    return result;
  }

  return fallback;
}

function findNextMission(currentProgress) {
  if (!currentProgress) {
    return MISSIONS[0] || null;
  }

  const unlockedMissionNumber =
    Number(currentProgress.unlockedMission) || 1;

  const incompleteUnlockedMission = MISSIONS.find((mission) => {
    const unlocked = isMissionUnlocked(
      currentProgress,
      mission.number
    );

    const completed = isMissionCompleted(
      currentProgress,
      mission.id
    );

    return unlocked && !completed;
  });

  if (incompleteUnlockedMission) {
    return incompleteUnlockedMission;
  }

  return (
    MISSIONS.find(
      (mission) => mission.number === unlockedMissionNumber
    ) ||
    MISSIONS.find(
      (mission) =>
        !isMissionCompleted(currentProgress, mission.id)
    ) ||
    MISSIONS[MISSIONS.length - 1] ||
    null
  );
}

export default function TMGMQuestPage() {
  const audioUnlockedRef = useRef(false);
  const readyGuideShownRef = useRef(false);

  const [hydrated, setHydrated] = useState(false);

  const [progress, setProgress] = useState(null);

  const [activeDistrict, setActiveDistrict] = useState(
    getInitialDistrict
  );

  const [vehicleState, setVehicleState] = useState({
    speed: 0,
    speedKmh: 0,
    distance: Infinity,
    journeyProgress: 0,
    braking: false,
    handbrake: false,
    accelerating: false,
  });

  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phoneApp, setPhoneApp] = useState("home");
  const [phoneKey, setPhoneKey] = useState(0);

  const [missionOpen, setMissionOpen] = useState(false);
  const [activeMission, setActiveMission] = useState(null);

  const [mysteryBoxOpen, setMysteryBoxOpen] =
    useState(false);

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

  const showGuide = useCallback((mood, message) => {
    setGuide({
      visible: true,
      mood,
      message,
    });
  }, []);

  /*
   * Load the locally saved game progress.
   */
  useEffect(() => {
    const savedProgress = loadProgress();

    setProgress(savedProgress);
    setHydrated(true);
  }, []);

  /*
   * Save progress whenever it changes.
   */
  useEffect(() => {
    if (!hydrated || !progress) {
      return;
    }

    saveProgress(progress);
  }, [hydrated, progress]);

  /*
   * Unlock Web Audio after the player's first interaction.
   * Browsers do not allow audio before a user interaction.
   */
  useEffect(() => {
    if (!soundEnabled) {
      return undefined;
    }

    const unlockGameAudio = async () => {
      if (audioUnlockedRef.current) {
        return;
      }

      await unlockAudio();

      audioUnlockedRef.current = true;

      await startEngineSound(true);

      const currentSpeed =
        Number(
          vehicleState?.speedKmh ?? vehicleState?.speed
        ) || 0;

      await updateEngineSound(
        Math.abs(currentSpeed),
        160,
        false,
        true
      );
    };

    const handleKeyboardUnlock = (event) => {
      const drivingKeys = [
        "w",
        "W",
        "ArrowUp",
        "s",
        "S",
        "ArrowDown",
        "a",
        "A",
        "ArrowLeft",
        "d",
        "D",
        "ArrowRight",
        " ",
      ];

      if (drivingKeys.includes(event.key)) {
        unlockGameAudio();
      }
    };

    window.addEventListener("pointerdown", unlockGameAudio);
    window.addEventListener("touchstart", unlockGameAudio, {
      passive: true,
    });
    window.addEventListener("keydown", handleKeyboardUnlock);

    return () => {
      window.removeEventListener(
        "pointerdown",
        unlockGameAudio
      );

      window.removeEventListener(
        "touchstart",
        unlockGameAudio
      );

      window.removeEventListener(
        "keydown",
        handleKeyboardUnlock
      );
    };
  }, [
    soundEnabled,
    vehicleState?.speed,
    vehicleState?.speedKmh,
  ]);

  /*
   * Enable or disable the complete audio system.
   */
  useEffect(() => {
    setAudioEnabled(soundEnabled);

    if (!soundEnabled) {
      stopEngineSound();
      audioUnlockedRef.current = false;
      return;
    }

    if (audioUnlockedRef.current) {
      startEngineSound(true);
    }
  }, [soundEnabled]);

  /*
   * Change engine pitch and volume according to vehicle speed.
   */
  useEffect(() => {
    if (
      !soundEnabled ||
      !audioUnlockedRef.current ||
      !vehicleState
    ) {
      return;
    }

    const currentSpeed = Math.abs(
      Number(
        vehicleState.speedKmh ?? vehicleState.speed
      ) || 0
    );

    const accelerating =
      Boolean(vehicleState.accelerating) ||
      (currentSpeed > 1 &&
        !vehicleState.braking &&
        !vehicleState.handbrake &&
        !gamePaused);

    updateEngineSound(
      currentSpeed,
      160,
      accelerating,
      true
    );
  }, [
    soundEnabled,
    vehicleState?.speed,
    vehicleState?.speedKmh,
    vehicleState?.accelerating,
    vehicleState?.braking,
    vehicleState?.handbrake,
    missionOpen,
    phoneOpen,
    mysteryBoxOpen,
  ]);

  /*
   * Stop the engine when the browser tab becomes hidden.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopEngineSound();
        audioUnlockedRef.current = false;
      }
    };

    const handlePageHide = () => {
      stopEngineSound();
      audioUnlockedRef.current = false;
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "pagehide",
        handlePageHide
      );

      stopEngineSound();
    };
  }, []);

  const districtMissions = useMemo(() => {
    if (!activeDistrict?.id) {
      return [];
    }

    return getDistrictMissions(activeDistrict.id) || [];
  }, [activeDistrict]);

  const nearestMission = useMemo(() => {
    if (!progress || districtMissions.length === 0) {
      return null;
    }

    const availableMission = districtMissions.find(
      (mission) =>
        isMissionUnlocked(progress, mission.number) &&
        !isMissionCompleted(progress, mission.id)
    );

    if (availableMission) {
      return availableMission;
    }

    const completedMission = [...districtMissions]
      .reverse()
      .find((mission) =>
        isMissionCompleted(progress, mission.id)
      );

    if (completedMission) {
      return completedMission;
    }

    return districtMissions[0] || null;
  }, [districtMissions, progress]);

  const distanceFromMission = Number(
    vehicleState?.distance
  );

  const isNearMission =
    Number.isFinite(distanceFromMission) &&
    distanceFromMission <= 14;

  const gamePaused =
    phoneOpen || missionOpen || mysteryBoxOpen;

  const missionAvailable =
    Boolean(nearestMission) &&
    isNearMission &&
    !missionOpen &&
    !phoneOpen &&
    !mysteryBoxOpen;

  /*
   * Guide message when the vehicle reaches a mission gate.
   */
  useEffect(() => {
    if (!missionAvailable) {
      readyGuideShownRef.current = false;
      return;
    }

    if (readyGuideShownRef.current) {
      return;
    }

    readyGuideShownRef.current = true;

    showGuide("thinking", GUIDE_MESSAGES.ready);
  }, [missionAvailable, showGuide]);

  /*
   * Golden Castle guide message.
   */
  useEffect(() => {
    if (activeDistrict?.id === "golden-castle") {
      showGuide("golden", GUIDE_MESSAGES.golden);
    }
  }, [activeDistrict?.id, showGuide]);

  const openPhone = useCallback(
    async (application = "home") => {
      setPhoneApp(application);
      setPhoneKey((currentKey) => currentKey + 1);
      setPhoneOpen(true);

      if (soundEnabled) {
        await playSound("phone", true);
      }

      showGuide("idle", GUIDE_MESSAGES.phone);
    },
    [showGuide, soundEnabled]
  );

  const closePhone = useCallback(() => {
    setPhoneOpen(false);
  }, []);

  const resolveMission = useCallback(
    (missionReference) => {
      if (!missionReference) {
        return nearestMission;
      }

      if (
        typeof missionReference === "object" &&
        missionReference.id
      ) {
        return missionReference;
      }

      if (typeof missionReference === "number") {
        return (
          MISSIONS.find(
            (mission) =>
              mission.number === missionReference
          ) || null
        );
      }

      if (typeof missionReference === "string") {
        return (
          MISSIONS.find(
            (mission) =>
              mission.id === missionReference ||
              String(mission.number) === missionReference
          ) || null
        );
      }

      return null;
    },
    [nearestMission]
  );

  const startMission = useCallback(
    async (missionReference) => {
      if (!progress) {
        return;
      }

      const mission = resolveMission(missionReference);

      if (!mission) {
        return;
      }

      if (!isMissionUnlocked(progress, mission.number)) {
        showGuide("warning", GUIDE_MESSAGES.locked);

        if (soundEnabled) {
          await playSound("wrong", true);
        }

        return;
      }

      setActiveMission(mission);
      setPhoneOpen(false);
      setMissionOpen(true);

      showGuide(
        "thinking",
        mission.guideMessage ||
          "Review the mission carefully before making your decision."
      );
    },
    [
      progress,
      resolveMission,
      showGuide,
      soundEnabled,
    ]
  );

  const requestMission = useCallback(() => {
    if (!nearestMission) {
      return;
    }

    if (!isNearMission) {
      showGuide(
        "thinking",
        "Drive closer to the illuminated mission gate."
      );
      return;
    }

    startMission(nearestMission);
  }, [
    nearestMission,
    isNearMission,
    showGuide,
    startMission,
  ]);

  const handleMissionCorrect = useCallback(async () => {
    if (!progress || !activeMission) {
      return;
    }

    const result = completeMission(
      progress,
      activeMission
    );

    const updatedProgress = extractProgress(
      result,
      progress
    );

    setProgress(updatedProgress);

    if (soundEnabled) {
      await playSound("success", true);

      window.setTimeout(() => {
        playSound("coin", true);
      }, 180);
    }

    showGuide("success", GUIDE_MESSAGES.success);
  }, [
    progress,
    activeMission,
    showGuide,
    soundEnabled,
  ]);

  const handleMissionWrong = useCallback(async () => {
    if (!progress) {
      return;
    }

    const result = registerWrongAnswer(progress);

    const updatedProgress = extractProgress(
      result,
      progress
    );

    setProgress(updatedProgress);

    if (soundEnabled) {
      await playSound("wrong", true);
    }

    showGuide("warning", GUIDE_MESSAGES.warning);
  }, [progress, showGuide, soundEnabled]);

  const handlePurchaseUpgrade = useCallback(
    async (upgradeType) => {
      if (!progress) {
        return {
          progress,
          message: "Game progress is not ready.",
        };
      }

      const result = purchaseUpgrade(
        progress,
        upgradeType
      );

      const updatedProgress = extractProgress(
        result,
        progress
      );

      setProgress(updatedProgress);

      const purchaseSucceeded =
        updatedProgress !== progress;

      if (purchaseSucceeded && soundEnabled) {
        await playSound("coin", true);
      } else if (
        result?.message &&
        soundEnabled
      ) {
        await playSound("wrong", true);
      }

      return result;
    },
    [progress, soundEnabled]
  );

  const handleBoxOpened = useCallback(async () => {
    if (!progress) {
      return;
    }

    const result = markBoxOpened(progress);

    const updatedProgress = extractProgress(
      result,
      progress
    );

    setProgress(updatedProgress);

    if (soundEnabled) {
      await playSound("box", true);
    }

    showGuide(
      "golden",
      "The final chamber is open. Your Market City Champion achievement is ready."
    );
  }, [progress, showGuide, soundEnabled]);

  const handleReset = useCallback(() => {
    const confirmed = window.confirm(
      "Reset all TMGM Market City progress saved on this device?"
    );

    if (!confirmed) {
      return;
    }

    stopEngineSound();
    audioUnlockedRef.current = false;

    const newProgress = resetProgress();

    setProgress(newProgress);
    setActiveDistrict(getInitialDistrict());
    setActiveMission(null);
    setMissionOpen(false);
    setPhoneOpen(false);
    setMysteryBoxOpen(false);

    setVehicleState({
      speed: 0,
      speedKmh: 0,
      distance: Infinity,
      journeyProgress: 0,
      braking: false,
      handbrake: false,
      accelerating: false,
    });

    showGuide("idle", GUIDE_MESSAGES.welcome);
  }, [showGuide]);

  const findMissionFromPhone = useCallback(() => {
    const nextMission = findNextMission(progress);

    if (!nextMission) {
      return;
    }

    const missionDistrict = DISTRICTS.find(
      (district) =>
        district.id === nextMission.districtId
    );

    setPhoneOpen(false);

    if (missionDistrict) {
      setActiveDistrict(missionDistrict);
    }

    showGuide(
      "thinking",
      `GPS selected mission ${nextMission.number}: ${nextMission.title}. Drive toward its illuminated district gate.`
    );
  }, [progress, showGuide]);

  const restartJourney = useCallback(() => {
    setMysteryBoxOpen(false);
    handleReset();
  }, [handleReset]);

  const toggleSound = useCallback(async () => {
    if (soundEnabled) {
      setSoundEnabled(false);
      stopEngineSound();
      audioUnlockedRef.current = false;
      return;
    }

    setSoundEnabled(true);

    await unlockAudio();

    audioUnlockedRef.current = true;

    await startEngineSound(true);

    const currentSpeed = Math.abs(
      Number(
        vehicleState?.speedKmh ?? vehicleState?.speed
      ) || 0
    );

    await updateEngineSound(
      currentSpeed,
      160,
      false,
      true
    );

    await playSound("phone", true);
  }, [
    soundEnabled,
    vehicleState?.speed,
    vehicleState?.speedKmh,
  ]);

  const openMysteryBox = useCallback(() => {
    if (!progress) {
      return;
    }

    const completedCount =
      progress.completedMissions?.length || 0;

    if (completedCount < TOTAL_MISSIONS) {
      showGuide(
        "warning",
        `Complete all ${TOTAL_MISSIONS} missions before entering the final Mystery Box chamber.`
      );

      if (soundEnabled) {
        playSound("wrong", true);
      }

      return;
    }

    setPhoneOpen(false);
    setMysteryBoxOpen(true);
    showGuide("golden", GUIDE_MESSAGES.golden);
  }, [progress, showGuide, soundEnabled]);

  const handleDistrictChange = useCallback(
    (district) => {
      if (!district) {
        return;
      }

      setActiveDistrict((currentDistrict) => {
        if (currentDistrict?.id === district.id) {
          return currentDistrict;
        }

        return district;
      });
    },
    []
  );

  const handleVehicleUpdate = useCallback(
    (newVehicleState) => {
      if (!newVehicleState) {
        return;
      }

      setVehicleState((currentState) => ({
        ...currentState,
        ...newVehicleState,
      }));
    },
    []
  );

  const handleCityReady = useCallback((mode) => {
    setCityReady(true);

    setDeviceMode({
      lowQuality: Boolean(mode?.lowQuality),
      reducedMotion: Boolean(mode?.reducedMotion),
    });
  }, []);

  if (!hydrated || !progress) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loadingCity}>
          <div className={styles.loadingCore}>T</div>

          <strong>TMGM MARKET CITY 3D</strong>

          <span>Loading your locally saved journey...</span>
        </div>
      </main>
    );
  }

  const completedMissions =
    progress.completedMissions?.length || 0;

  const mysteryBoxReady =
    completedMissions >= TOTAL_MISSIONS;

  return (
    <main className={styles.gamePage}>
      <div
        className={styles.cityVignette}
        aria-hidden="true"
      />

      <div
        className={styles.cityScanlines}
        aria-hidden="true"
      />

      <nav className={styles.gameNavigation}>
        <Link href="/" className={styles.gameBrand}>
          <span>T</span>

          <div>
            <strong>TMGM MARKET CITY</strong>
            <small>3D EDUCATIONAL EXPERIENCE</small>
          </div>
        </Link>

        <div className={styles.performanceMode}>
          <strong>
            {deviceMode.lowQuality
              ? "MOBILE MODE"
              : "CINEMATIC MODE"}
          </strong>

          {deviceMode.reducedMotion && (
            <span className={styles.modeWarning}>
              REDUCED MOTION
            </span>
          )}
        </div>

        <Link href="/" className={styles.exitGame}>
          EXIT CITY
        </Link>
      </nav>

      {!cityReady && (
        <div className={styles.worldPreparing}>
          INITIALIZING 3D CITY
        </div>
      )}

      <GameCanvas
        progress={progress}
        gamePaused={gamePaused}
        onDistrictChange={handleDistrictChange}
        onVehicleUpdate={handleVehicleUpdate}
        onMissionRequest={requestMission}
        onTogglePhone={() => {
          if (phoneOpen) {
            closePhone();
          } else {
            openPhone("home");
          }
        }}
        onToggleMap={() => openPhone("map")}
        onReady={handleCityReady}
      />

      <GameHUD
        progress={progress}
        vehicleState={vehicleState}
        district={activeDistrict}
        soundEnabled={soundEnabled}
        missionAvailable={missionAvailable}
        gamePaused={gamePaused}
        onToggleSound={toggleSound}
        onOpenPhone={() => openPhone("home")}
        onOpenMap={() => openPhone("map")}
        onOpenMission={requestMission}
      />

      <MobileControls
        missionAvailable={missionAvailable}
        hidden={gamePaused}
      />

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
        onOpenMysteryBox={openMysteryBox}
        onToggleSound={toggleSound}
        onReset={handleReset}
      />

      <MissionScreen
        mission={activeMission}
        open={missionOpen}
        alreadyCompleted={
          activeMission
            ? isMissionCompleted(
                progress,
                activeMission.id
              )
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

      <TMGMGuide
        visible={guide.visible}
        mood={guide.mood}
        message={guide.message}
        compact={
          phoneOpen ||
          missionOpen ||
          mysteryBoxOpen
        }
        golden={
          guide.mood === "golden" ||
          activeDistrict?.id === "golden-castle" ||
          mysteryBoxReady
        }
        onDismiss={() =>
          setGuide((currentGuide) => ({
            ...currentGuide,
            visible: false,
          }))
        }
      />

      <div className={styles.demoRibbon}>
        PROMOTIONAL DEMO · EDUCATIONAL SIMULATION · NO
        REAL PRIZE GUARANTEED
      </div>
    </main>
  );
}
