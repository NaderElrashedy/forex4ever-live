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
        <div className={styles.loadingCore}>
          <strong>T</strong>
        </div>

        <div>
          <strong>BUILDING TMGM MARKET CITY</strong>
          <span>Preparing the 3D world...</span>
        </div>
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

function extractProgress(result, fallbackProgress) {
  if (!result) {
    return fallbackProgress;
  }

  if (result.progress) {
    return result.progress;
  }

  if (
    typeof result === "object" &&
    Array.isArray(result.completedMissions)
  ) {
    return result;
  }

  return fallbackProgress;
}

function findNextMission(progress) {
  if (!progress) {
    return MISSIONS[0] || null;
  }

  const completedMissions = Array.isArray(
    progress.completedMissions
  )
    ? progress.completedMissions
    : [];

  return (
    MISSIONS.find(
      (mission) =>
        !completedMissions.includes(mission.id) &&
        isMissionUnlocked(progress, mission)
    ) ||
    MISSIONS.find(
      (mission) => !completedMissions.includes(mission.id)
    ) ||
    null
  );
}

function resolveMissionReference(missionReference) {
  if (!missionReference) {
    return null;
  }

  if (
    typeof missionReference === "object" &&
    missionReference.id
  ) {
    return (
      MISSIONS.find(
        (mission) => mission.id === missionReference.id
      ) || missionReference
    );
  }

  if (typeof missionReference === "number") {
    return (
      MISSIONS.find(
        (mission) => mission.number === missionReference
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

  const gamePaused =
    phoneOpen || missionOpen || mysteryBoxOpen;

  const completedMissionCount =
    progress?.completedMissions?.length || 0;

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

    const incompleteUnlockedMission = districtMissions.find(
      (mission) =>
        !isMissionCompleted(progress, mission) &&
        isMissionUnlocked(progress, mission)
    );

    if (incompleteUnlockedMission) {
      return incompleteUnlockedMission;
    }

    const incompleteMission = districtMissions.find(
      (mission) => !isMissionCompleted(progress, mission)
    );

    if (incompleteMission) {
      return incompleteMission;
    }

    return districtMissions[districtMissions.length - 1] || null;
  }, [districtMissions, progress]);

  const missionAvailable = Boolean(
    nearestMission &&
      Number(vehicleState.distance) <= 14 &&
      !missionOpen &&
      !phoneOpen &&
      !mysteryBoxOpen
  );

  const showGuide = useCallback(
    (mood, message, visible = true) => {
      setGuide({
        visible,
        mood,
        message,
      });
    },
    []
  );

  /*
   * Load locally saved progress.
   */
  useEffect(() => {
    const savedProgress = loadProgress();

    setProgress(savedProgress);
    setHydrated(true);
  }, []);

  /*
   * Save progress after every relevant change.
   */
  useEffect(() => {
    if (!hydrated || !progress) {
      return;
    }

    saveProgress(progress);
  }, [hydrated, progress]);

  /*
   * Unlock browser audio after the player's first interaction.
   * Browsers do not allow automatic sound before user input.
   */
  useEffect(() => {
    if (!soundEnabled) {
      return undefined;
    }

    const unlockGameAudio = async () => {
      if (audioUnlockedRef.current) {
        return;
      }

      const unlocked = await unlockAudio();

      if (!unlocked) {
        return;
      }

      audioUnlockedRef.current = true;

      await startEngineSound(true);

      /*
       * Start silently. The next vehicle update decides
       * whether the engine should become audible.
       */
      await updateEngineSound(0, 160, false, true);
    };

    const handleKeyboardUnlock = (event) => {
      const acceptedKeys = [
        "w",
        "W",
        "s",
        "S",
        "a",
        "A",
        "d",
        "D",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        " ",
      ];

      if (!acceptedKeys.includes(event.key)) {
        return;
      }

      unlockGameAudio();
    };

    window.addEventListener("pointerdown", unlockGameAudio, {
      passive: true,
    });

    window.addEventListener("touchstart", unlockGameAudio, {
      passive: true,
    });

    window.addEventListener(
      "keydown",
      handleKeyboardUnlock
    );

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
  }, [soundEnabled]);

  /*
   * Enable or disable the complete audio system.
   */
  useEffect(() => {
    setAudioEnabled(soundEnabled);

    if (!soundEnabled) {
      stopEngineSound();
      audioUnlockedRef.current = false;
    }
  }, [soundEnabled]);

  /*
   * Connect the vehicle speed to the engine sound.
   *
   * Important:
   * - No engine sound while stopped.
   * - No engine sound while the game is paused.
   * - No engine sound while the phone, mission or box is open.
   */
  useEffect(() => {
    if (
      !soundEnabled ||
      !audioUnlockedRef.current
    ) {
      return;
    }

    const currentSpeed = Math.abs(
      Number(
        vehicleState.speedKmh ?? vehicleState.speed ?? 0
      )
    );

    const vehicleIsBraking = Boolean(
      vehicleState.braking
    );

    const handbrakeIsActive = Boolean(
      vehicleState.handbrake
    );

    const vehicleIsAccelerating =
      Boolean(vehicleState.accelerating) ||
      (currentSpeed > 2 &&
        !vehicleIsBraking &&
        !handbrakeIsActive &&
        !gamePaused);

    /*
     * Opening the phone, a mission or the final box
     * sends zero speed to the audio engine.
     */
    if (gamePaused) {
      updateEngineSound(
        0,
        160,
        false,
        soundEnabled
      );

      return;
    }

    updateEngineSound(
      currentSpeed,
      160,
      vehicleIsAccelerating,
      soundEnabled
    );
  }, [
    soundEnabled,
    gamePaused,
    vehicleState.speed,
    vehicleState.speedKmh,
    vehicleState.accelerating,
    vehicleState.braking,
    vehicleState.handbrake,
  ]);

  /*
   * Stop the engine when the player leaves the page,
   * changes the browser tab or minimizes the browser.
   */
  useEffect(() => {
    const stopPageAudio = () => {
      stopEngineSound();
      audioUnlockedRef.current = false;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPageAudio();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener("pagehide", stopPageAudio);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "pagehide",
        stopPageAudio
      );

      stopPageAudio();
    };
  }, []);

  /*
   * Display the mission-ready guide message once
   * when the vehicle reaches an available gate.
   */
  useEffect(() => {
    if (missionAvailable && !readyGuideShownRef.current) {
      readyGuideShownRef.current = true;

      showGuide(
        "thinking",
        GUIDE_MESSAGES.ready,
        true
      );

      return;
    }

    if (!missionAvailable) {
      readyGuideShownRef.current = false;
    }
  }, [missionAvailable, showGuide]);

  const openPhone = useCallback(
    async (appName = "home") => {
      setPhoneApp(appName || "home");
      setPhoneKey((currentKey) => currentKey + 1);
      setPhoneOpen(true);

      /*
       * Immediately silence the vehicle when
       * the City Phone opens.
       */
      if (audioUnlockedRef.current) {
        updateEngineSound(0, 160, false, soundEnabled);
      }

      if (soundEnabled) {
        await playSound("phone", true);
      }

      showGuide(
        "idle",
        GUIDE_MESSAGES.phone,
        true
      );
    },
    [showGuide, soundEnabled]
  );

  const closePhone = useCallback(() => {
    setPhoneOpen(false);
  }, []);

  const startMission = useCallback(
    (missionReference) => {
      if (!progress) {
        return;
      }

      const mission =
        resolveMissionReference(missionReference) ||
        nearestMission;

      if (!mission) {
        return;
      }

      if (!isMissionUnlocked(progress, mission)) {
        if (soundEnabled) {
          playSound("wrong", true);
        }

        showGuide(
          "warning",
          GUIDE_MESSAGES.locked,
          true
        );

        return;
      }

      /*
       * Silence the motor before opening the mission.
       */
      if (audioUnlockedRef.current) {
        updateEngineSound(0, 160, false, soundEnabled);
      }

      setActiveMission(mission);
      setPhoneOpen(false);
      setMissionOpen(true);

      showGuide(
        "thinking",
        `Mission ${mission.number}: ${mission.title}`,
        true
      );
    },
    [
      nearestMission,
      progress,
      showGuide,
      soundEnabled,
    ]
  );

  const requestMission = useCallback(
    (missionReference) => {
      if (
        phoneOpen ||
        missionOpen ||
        mysteryBoxOpen
      ) {
        return;
      }

      const mission =
        resolveMissionReference(missionReference) ||
        nearestMission;

      if (!mission) {
        return;
      }

      const distance = Number(vehicleState.distance);

      if (Number.isFinite(distance) && distance > 14) {
        showGuide(
          "idle",
          "Drive closer to the illuminated mission gate before entering.",
          true
        );

        return;
      }

      startMission(mission);
    },
    [
      missionOpen,
      mysteryBoxOpen,
      nearestMission,
      phoneOpen,
      showGuide,
      startMission,
      vehicleState.distance,
    ]
  );

  const handleMissionCorrect = useCallback(() => {
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
      playSound("success", true);

      window.setTimeout(() => {
        playSound("coin", true);
      }, 180);
    }

    showGuide(
      "success",
      GUIDE_MESSAGES.success,
      true
    );
  }, [
    activeMission,
    progress,
    showGuide,
    soundEnabled,
  ]);

  const handleMissionWrong = useCallback(() => {
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
      playSound("wrong", true);
    }

    showGuide(
      "warning",
      GUIDE_MESSAGES.warning,
      true
    );
  }, [progress, showGuide, soundEnabled]);

  const closeMission = useCallback(() => {
    setMissionOpen(false);
    setActiveMission(null);
  }, []);

  const handlePurchaseUpgrade = useCallback(
    (upgradeType) => {
      if (!progress) {
        return null;
      }

      const previousCoins = Number(progress.coins || 0);

      const result = purchaseUpgrade(
        progress,
        upgradeType
      );

      const updatedProgress = extractProgress(
        result,
        progress
      );

      const newCoins = Number(
        updatedProgress.coins || 0
      );

      const purchaseSucceeded =
        newCoins < previousCoins;

      setProgress(updatedProgress);

      if (soundEnabled) {
        playSound(
          purchaseSucceeded ? "coin" : "wrong",
          true
        );
      }

      return result;
    },
    [progress, soundEnabled]
  );

  const handleBoxOpened = useCallback(() => {
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
      playSound("box", true);
    }

    showGuide(
      "golden",
      GUIDE_MESSAGES.golden,
      true
    );
  }, [progress, showGuide, soundEnabled]);

  const handleReset = useCallback(() => {
    const shouldReset = window.confirm(
      "Reset all TMGM Market City progress saved on this device?"
    );

    if (!shouldReset) {
      return;
    }

    stopEngineSound();
    audioUnlockedRef.current = false;

    const freshProgress = resetProgress();

    setProgress(freshProgress);
    setActiveDistrict(getInitialDistrict());
    setVehicleState({
      speed: 0,
      speedKmh: 0,
      distance: Infinity,
      journeyProgress: 0,
      braking: false,
      handbrake: false,
      accelerating: false,
    });

    setPhoneOpen(false);
    setMissionOpen(false);
    setActiveMission(null);
    setMysteryBoxOpen(false);

    showGuide(
      "idle",
      GUIDE_MESSAGES.welcome,
      true
    );
  }, [showGuide]);

  const findMissionFromPhone = useCallback(
    (missionReference) => {
      const mission =
        resolveMissionReference(missionReference) ||
        findNextMission(progress);

      setPhoneOpen(false);

      if (!mission) {
        showGuide(
          "success",
          "All available missions have been completed.",
          true
        );

        return;
      }

      const district = DISTRICTS.find(
        (item) => item.id === mission.districtId
      );

      if (district) {
        setActiveDistrict(district);
      }

      showGuide(
        "thinking",
        `GPS selected Mission ${mission.number}: ${mission.title}. Follow the illuminated route.`,
        true
      );
    },
    [progress, showGuide]
  );

  const restartJourney = useCallback(() => {
    stopEngineSound();
    audioUnlockedRef.current = false;

    const freshProgress = resetProgress();

    setProgress(freshProgress);
    setMysteryBoxOpen(false);
    setMissionOpen(false);
    setActiveMission(null);
    setPhoneOpen(false);
    setActiveDistrict(getInitialDistrict());

    setVehicleState({
      speed: 0,
      speedKmh: 0,
      distance: Infinity,
      journeyProgress: 0,
      braking: false,
      handbrake: false,
      accelerating: false,
    });

    showGuide(
      "idle",
      GUIDE_MESSAGES.welcome,
      true
    );
  }, [showGuide]);

  const toggleSound = useCallback(async () => {
    if (soundEnabled) {
      setSoundEnabled(false);
      stopEngineSound();
      audioUnlockedRef.current = false;
      return;
    }

    setSoundEnabled(true);
    setAudioEnabled(true);

    const unlocked = await unlockAudio();

    if (!unlocked) {
      return;
    }

    audioUnlockedRef.current = true;

    await startEngineSound(true);

    /*
     * Restart silently. The speed effect will increase
     * the sound only when the vehicle moves.
     */
    await updateEngineSound(0, 160, false, true);
    await playSound("phone", true);
  }, [soundEnabled]);

  const openMysteryBox = useCallback(() => {
    if (!progress) {
      return;
    }

    if (completedMissionCount < TOTAL_MISSIONS) {
      if (soundEnabled) {
        playSound("wrong", true);
      }

      showGuide(
        "warning",
        `Complete all ${TOTAL_MISSIONS} missions before entering the Mystery Box chamber.`,
        true
      );

      return;
    }

    /*
     * Silence the vehicle before the final sequence.
     */
    if (audioUnlockedRef.current) {
      updateEngineSound(0, 160, false, soundEnabled);
    }

    setPhoneOpen(false);
    setMysteryBoxOpen(true);

    showGuide(
      "golden",
      GUIDE_MESSAGES.golden,
      true
    );
  }, [
    completedMissionCount,
    progress,
    showGuide,
    soundEnabled,
  ]);

  const handleDistrictChange = useCallback(
    (districtReference) => {
      let district = districtReference;

      if (typeof districtReference === "string") {
        district = DISTRICTS.find(
          (item) => item.id === districtReference
        );
      }

      if (!district?.id) {
        return;
      }

      setActiveDistrict(district);

      if (district.id === "golden-castle") {
        showGuide(
          "golden",
          GUIDE_MESSAGES.golden,
          true
        );
      }
    },
    [showGuide]
  );

  const handleVehicleUpdate = useCallback(
    (nextVehicleState) => {
      if (!nextVehicleState) {
        return;
      }

      setVehicleState((currentState) => ({
        ...currentState,
        ...nextVehicleState,
      }));
    },
    []
  );

  const handleCityReady = useCallback((mode) => {
    setDeviceMode({
      lowQuality: Boolean(mode?.lowQuality),
      reducedMotion: Boolean(mode?.reducedMotion),
    });

    setCityReady(true);
  }, []);

  if (!hydrated || !progress) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loadingCity}>
          <div className={styles.loadingCore}>
            <strong>T</strong>
          </div>

          <h1>TMGM MARKET CITY 3D</h1>

          <p>Loading your locally saved journey...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.gamePage}>
      <GameCanvas
        progress={progress}
        gamePaused={gamePaused}
        onDistrictChange={handleDistrictChange}
        onVehicleUpdate={handleVehicleUpdate}
        onMissionRequest={requestMission}
        onTogglePhone={() => openPhone("home")}
        onToggleMap={() => openPhone("map")}
        onReady={handleCityReady}
      />

      {!cityReady && (
        <div className={styles.worldPreparing}>
          <span>INITIALIZING 3D CITY</span>
        </div>
      )}

      <div
        className={styles.cityVignette}
        aria-hidden="true"
      />

      <div
        className={styles.cityScanlines}
        aria-hidden="true"
      />

      <header className={styles.gameNavigation}>
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
      </header>

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
        onOpenMission={() =>
          requestMission(nearestMission)
        }
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
        golden={guide.mood === "golden"}
        onDismiss={() =>
          setGuide((currentGuide) => ({
            ...currentGuide,
            visible: false,
          }))
        }
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
                activeMission
              )
            : false
        }
        onClose={closeMission}
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

      <MobileControls
        missionAvailable={missionAvailable}
        hidden={gamePaused}
      />

      <div className={styles.demoRibbon}>
        PROMOTIONAL DEMO · EDUCATIONAL SIMULATION · NO
        REAL PRIZE GUARANTEED
      </div>
    </main>
  );
}
