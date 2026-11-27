import { ALL_STAGES, TOTAL_STAGES } from "./questData";

export const STORAGE_KEY = "tmgm-market-city-v1";

export const DEFAULT_PROGRESS = {
  points: 0,
  coins: 0,
  riskHeat: 0,
  unlockedStage: 1,
  completedStages: [],
  badges: [],
  correctAnswers: 0,
  wrongAnswers: 0,
  boxOpened: false,
};

export function normalizeProgress(value) {
  const source = value && typeof value === "object" ? value : {};

  return {
    points: Number(source.points) || 0,
    coins: Number(source.coins) || 0,
    riskHeat: Math.min(100, Math.max(0, Number(source.riskHeat) || 0)),
    unlockedStage: Math.min(
      TOTAL_STAGES,
      Math.max(1, Number(source.unlockedStage) || 1)
    ),
    completedStages: Array.isArray(source.completedStages)
      ? source.completedStages
      : [],
    badges: Array.isArray(source.badges) ? source.badges : [],
    correctAnswers: Number(source.correctAnswers) || 0,
    wrongAnswers: Number(source.wrongAnswers) || 0,
    boxOpened: Boolean(source.boxOpened),
  };
}

export function loadProgress() {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved
      ? normalizeProgress(JSON.parse(saved))
      : { ...DEFAULT_PROGRESS };
  } catch {
    return { ...DEFAULT_PROGRESS };
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
    // Local storage may be unavailable in private browsing.
  }
}

export function resetProgress() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return { ...DEFAULT_PROGRESS };
}

export function isStageUnlocked(progress, stage) {
  return stage.number <= progress.unlockedStage;
}

export function isStageCompleted(progress, stage) {
  return progress.completedStages.includes(stage.id);
}

export function evaluateStage(stage, answer) {
  if (stage.kind === "sequence") {
    if (!Array.isArray(answer) || !Array.isArray(stage.answer)) return false;

    return (
      answer.length === stage.answer.length &&
      answer.every((item, index) => item === stage.answer[index])
    );
  }

  return answer === stage.answer;
}

export function completeStage(progress, stage) {
  if (progress.completedStages.includes(stage.id)) {
    return normalizeProgress({
      ...progress,
      riskHeat: Math.max(0, progress.riskHeat - 5),
    });
  }

  const completedStages = [...progress.completedStages, stage.id];

  const worldStages = ALL_STAGES.filter(
    (item) => item.worldId === stage.worldId
  );

  const completedWorld = worldStages.every((item) =>
    completedStages.includes(item.id)
  );

  const badges =
    completedWorld && !progress.badges.includes(stage.badge)
      ? [...progress.badges, stage.badge]
      : progress.badges;

  return normalizeProgress({
    ...progress,
    points: progress.points + stage.reward,
    coins: progress.coins + stage.coins,
    riskHeat: Math.max(0, progress.riskHeat - 12),
    unlockedStage: Math.min(
      TOTAL_STAGES,
      Math.max(progress.unlockedStage, stage.number + 1)
    ),
    completedStages,
    badges,
    correctAnswers: progress.correctAnswers + 1,
  });
}

export function registerWrongAnswer(progress) {
  return normalizeProgress({
    ...progress,
    riskHeat: Math.min(100, progress.riskHeat + 18),
    wrongAnswers: progress.wrongAnswers + 1,
  });
}

export function markBoxOpened(progress) {
  return normalizeProgress({
    ...progress,
    boxOpened: true,
    riskHeat: 0,
  });
}

export function getAccuracy(progress) {
  const total = progress.correctAnswers + progress.wrongAnswers;
  return total ? Math.round((progress.correctAnswers / total) * 100) : 0;
}

export function getPlayerLevel(progress) {
  return Math.floor(progress.points / 800) + 1;
}

export function getRank(progress) {
  if (progress.points >= 7000) return "Market City Champion";
  if (progress.points >= 5000) return "Capital Guardian";
  if (progress.points >= 3200) return "Market Navigator";
  if (progress.points >= 1800) return "City Trader";
  if (progress.points >= 700) return "Rising Driver";
  return "New Arrival";
}

export function getWorldCompletion(progress, worldId) {
  const stages = ALL_STAGES.filter((stage) => stage.worldId === worldId);
  const completed = stages.filter((stage) =>
    progress.completedStages.includes(stage.id)
  ).length;

  return Math.round((completed / stages.length) * 100);
}
