import { TOTAL_STAGES, WORLDS } from "./gameData";

export const STORAGE_KEY = "forex4ever-trading-adventure-v2";

export const DEFAULT_PROGRESS = {
  xp: 0,
  coins: 0,
  unlockedStage: 1,
  completedStages: [],
  badges: [],
  trophies: [],
  correctAnswers: 0,
  wrongAnswers: 0,
};

export function normalizeProgress(value) {
  if (!value || typeof value !== "object") {
    return DEFAULT_PROGRESS;
  }

  return {
    ...DEFAULT_PROGRESS,
    ...value,
    xp: Number(value.xp) || 0,
    coins: Number(value.coins) || 0,
    unlockedStage: Math.max(1, Number(value.unlockedStage) || 1),
    completedStages: Array.isArray(value.completedStages)
      ? value.completedStages
      : [],
    badges: Array.isArray(value.badges) ? value.badges : [],
    trophies: Array.isArray(value.trophies) ? value.trophies : [],
    correctAnswers: Number(value.correctAnswers) || 0,
    wrongAnswers: Number(value.wrongAnswers) || 0,
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
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(normalizeProgress(progress))
    );
  } catch {
    // استمرار اللعبة حتى إذا منع المتصفح localStorage.
  }
}

export function resetProgress() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // لا شيء مطلوب.
  }
}

export function isStageUnlocked(stage, progress) {
  return stage.number <= progress.unlockedStage;
}

export function isStageCompleted(stage, progress) {
  return progress.completedStages.includes(stage.id);
}

export function arraysEqual(first, second) {
  if (!Array.isArray(first) || !Array.isArray(second)) return false;
  if (first.length !== second.length) return false;

  return first.every((item, index) => item === second[index]);
}

export function evaluateStage(stage, value) {
  if (!stage) return false;

  if (stage.kind === "sequence") {
    return arraysEqual(value, stage.answer);
  }

  if (stage.kind === "slider") {
    const selected = Number(value);
    const expected = Number(stage.answer);
    const tolerance = Number(stage.tolerance) || 0;

    return Math.abs(selected - expected) <= tolerance;
  }

  return value === stage.answer;
}

export function getWorldCompletion(world, progress) {
  const completed = world.stages.filter((stage) =>
    progress.completedStages.includes(stage.id)
  ).length;

  return {
    completed,
    total: world.stages.length,
    percentage: Math.round((completed / world.stages.length) * 100),
    finished: completed === world.stages.length,
  };
}

export function completeStage(progress, stage) {
  const alreadyCompleted = progress.completedStages.includes(stage.id);

  const completedStages = alreadyCompleted
    ? progress.completedStages
    : [...progress.completedStages, stage.id];

  const currentWorld = WORLDS[stage.worldIndex];
  const worldFinished = currentWorld.stages.every((item) =>
    completedStages.includes(item.id)
  );

  const badges =
    worldFinished &&
    !progress.badges.includes(currentWorld.badge.id)
      ? [...progress.badges, currentWorld.badge.id]
      : progress.badges;

  const trophyId = `trophy-${currentWorld.id}`;

  const trophies =
    worldFinished && !progress.trophies.includes(trophyId)
      ? [...progress.trophies, trophyId]
      : progress.trophies;

  return {
    ...progress,
    xp: alreadyCompleted ? progress.xp : progress.xp + stage.xp,
    coins: alreadyCompleted
      ? progress.coins
      : progress.coins + stage.coins,
    correctAnswers: progress.correctAnswers + 1,
    completedStages,
    badges,
    trophies,
    unlockedStage: Math.min(
      TOTAL_STAGES,
      Math.max(progress.unlockedStage, stage.number + 1)
    ),
  };
}

export function registerWrongAnswer(progress) {
  return {
    ...progress,
    wrongAnswers: progress.wrongAnswers + 1,
  };
}

export function getPlayerLevel(xp) {
  return Math.max(1, Math.floor(Number(xp || 0) / 500) + 1);
}

export function getRank(xp) {
  const value = Number(xp) || 0;

  if (value >= 6500) return "أسطورة Forex4Ever";
  if (value >= 4500) return "المتداول المنضبط";
  if (value >= 3000) return "حارس رأس المال";
  if (value >= 1800) return "صائد الاتجاه";
  if (value >= 900) return "قارئ السوق";
  if (value >= 300) return "مستكشف مبتدئ";

  return "متدرب جديد";
}

export function getAccuracy(progress) {
  const total = progress.correctAnswers + progress.wrongAnswers;

  if (!total) return 0;

  return Math.round((progress.correctAnswers / total) * 100);
}
