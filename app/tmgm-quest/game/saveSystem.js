import { DISTRICTS, MISSIONS, TOTAL_MISSIONS } from "../data/missionData";

export const STORAGE_KEY = "tmgm-market-city-3d-v1";

export const DEFAULT_PROGRESS = {
  points: 0,
  coins: 0,
  riskHeat: 0,
  unlockedMission: 1,
  completedMissions: [],
  badges: [],
  upgrades: {
    engine: 0,
    handling: 0,
    shield: 0,
  },
  correctAnswers: 0,
  wrongAnswers: 0,
  boxOpened: false,
};

export function normalizeProgress(value) {
  const source = value && typeof value === "object" ? value : {};

  return {
    ...DEFAULT_PROGRESS,
    ...source,

    completedMissions: Array.isArray(source.completedMissions)
      ? [...new Set(source.completedMissions)]
      : [],

    badges: Array.isArray(source.badges)
      ? [...new Set(source.badges)]
      : [],

    upgrades: {
      ...DEFAULT_PROGRESS.upgrades,
      ...(source.upgrades || {}),
    },

    unlockedMission: Math.min(
      TOTAL_MISSIONS,
      Math.max(1, Number(source.unlockedMission) || 1)
    ),

    riskHeat: Math.min(100, Math.max(0, Number(source.riskHeat) || 0)),

    boxOpened: Boolean(source.boxOpened),
  };
}

export function loadProgress() {
  if (typeof window === "undefined") {
    return DEFAULT_PROGRESS;
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return DEFAULT_PROGRESS;
    }

    return normalizeProgress(JSON.parse(saved));
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress) {
  const normalized = normalizeProgress(progress);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(normalized)
    );
  }

  return normalized;
}

export function resetProgress() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return { ...DEFAULT_PROGRESS };
}

export function getAccuracy(progress) {
  const total = progress.correctAnswers + progress.wrongAnswers;

  if (!total) return 0;

  return Math.round((progress.correctAnswers / total) * 100);
}

export function getPlayerLevel(progress) {
  return Math.floor(progress.points / 900) + 1;
}

export function getRank(progress) {
  if (progress.points >= 7000) return "Market City Champion";
  if (progress.points >= 5000) return "Capital Guardian";
  if (progress.points >= 3200) return "Market Navigator";
  if (progress.points >= 1800) return "City Trader";
  if (progress.points >= 700) return "Rising Driver";

  return "New Arrival";
}

export function isMissionCompleted(progress, missionNumber) {
  return progress.completedMissions.includes(missionNumber);
}

export function isMissionUnlocked(progress, missionNumber) {
  return (
    missionNumber <= progress.unlockedMission ||
    isMissionCompleted(progress, missionNumber)
  );
}

export function evaluateMission(mission, answer) {
  if (!mission) return false;

  if (mission.type === "sequence") {
    if (!Array.isArray(answer) || !Array.isArray(mission.answer)) {
      return false;
    }

    return mission.answer.every(
      (value, index) => value === answer[index]
    );
  }

  return mission.answer === answer;
}

export function registerWrongAnswer(progress) {
  return saveProgress({
    ...progress,
    wrongAnswers: progress.wrongAnswers + 1,
    riskHeat: Math.min(100, progress.riskHeat + 18),
  });
}

export function completeMission(progress, mission) {
  if (!mission) return progress;

  const alreadyCompleted = progress.completedMissions.includes(
    mission.number
  );

  if (alreadyCompleted) {
    return saveProgress({
      ...progress,
      riskHeat: Math.max(0, progress.riskHeat - 5),
    });
  }

  const completedMissions = [
    ...progress.completedMissions,
    mission.number,
  ];

  const districtMissions = MISSIONS.filter(
    (item) => item.districtId === mission.districtId
  );

  const districtCompleted = districtMissions.every((item) =>
    completedMissions.includes(item.number)
  );

  const badges =
    districtCompleted && !progress.badges.includes(mission.badge)
      ? [...progress.badges, mission.badge]
      : progress.badges;

  return saveProgress({
    ...progress,
    points: progress.points + mission.points,
    coins: progress.coins + mission.coins,
    riskHeat: Math.max(0, progress.riskHeat - 12),
    correctAnswers: progress.correctAnswers + 1,
    completedMissions,
    badges,
    unlockedMission: Math.min(
      TOTAL_MISSIONS,
      Math.max(progress.unlockedMission, mission.number + 1)
    ),
  });
}

export function purchaseUpgrade(progress, type) {
  const prices = {
    engine: [300, 650, 1100],
    handling: [250, 600, 1000],
    shield: [350, 700, 1200],
  };

  if (!prices[type]) {
    return {
      success: false,
      message: "Unknown upgrade.",
      progress,
    };
  }

  const currentLevel = progress.upgrades[type] || 0;

  if (currentLevel >= prices[type].length) {
    return {
      success: false,
      message: "This upgrade is already at maximum level.",
      progress,
    };
  }

  const price = prices[type][currentLevel];

  if (progress.coins < price) {
    return {
      success: false,
      message: `You need ${price} City Coins.`,
      progress,
    };
  }

  const updatedProgress = saveProgress({
    ...progress,
    coins: progress.coins - price,
    upgrades: {
      ...progress.upgrades,
      [type]: currentLevel + 1,
    },
  });

  return {
    success: true,
    message: `${type} upgraded to level ${currentLevel + 1}.`,
    progress: updatedProgress,
  };
}

export function markBoxOpened(progress) {
  return saveProgress({
    ...progress,
    boxOpened: true,
    riskHeat: 0,
  });
}

export function getDistrictCompletion(progress, districtId) {
  const district = DISTRICTS.find((item) => item.id === districtId);

  if (!district) return 0;

  const districtMissions = MISSIONS.filter(
    (mission) => mission.districtId === districtId
  );

  const completed = districtMissions.filter((mission) =>
    progress.completedMissions.includes(mission.number)
  ).length;

  return Math.round((completed / districtMissions.length) * 100);
}
