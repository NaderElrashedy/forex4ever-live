let audioContext = null;

let engineOscillator = null;
let engineSecondaryOscillator = null;
let engineGain = null;
let engineFilter = null;

let engineStarted = false;
let engineEnabled = true;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (!audioContext || audioContext.state === "closed") {
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

async function resumeAudioContext() {
  const context = getAudioContext();

  if (!context) {
    return null;
  }

  if (context.state === "suspended") {
    try {
      await context.resume();
    } catch {
      // The next user interaction will try again.
    }
  }

  return context;
}

function createTone({
  frequency = 440,
  endFrequency = 520,
  duration = 0.2,
  type = "sine",
  volume = 0.06,
  delay = 0,
}) {
  const context = getAudioContext();

  if (!context || !engineEnabled) {
    return;
  }

  const startTime = context.currentTime + delay;
  const endTime = startTime + duration;

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;

  oscillator.frequency.setValueAtTime(
    Math.max(20, frequency),
    startTime
  );

  oscillator.frequency.exponentialRampToValueAtTime(
    Math.max(20, endFrequency),
    endTime
  );

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(
    Math.max(0.0001, volume),
    startTime + 0.025
  );
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(endTime + 0.04);
}

export async function unlockAudio() {
  return resumeAudioContext();
}

export async function playSound(name, enabled = true) {
  if (!enabled || typeof window === "undefined") {
    return;
  }

  engineEnabled = true;

  const context = await resumeAudioContext();

  if (!context) {
    return;
  }

  switch (name) {
    case "success":
      createTone({
        frequency: 520,
        endFrequency: 960,
        duration: 0.28,
        type: "sine",
        volume: 0.07,
      });

      createTone({
        frequency: 780,
        endFrequency: 1180,
        duration: 0.22,
        type: "triangle",
        volume: 0.045,
        delay: 0.1,
      });
      break;

    case "wrong":
      createTone({
        frequency: 210,
        endFrequency: 120,
        duration: 0.32,
        type: "sawtooth",
        volume: 0.055,
      });
      break;

    case "coin":
      createTone({
        frequency: 880,
        endFrequency: 1320,
        duration: 0.2,
        type: "triangle",
        volume: 0.06,
      });
      break;

    case "phone":
      createTone({
        frequency: 650,
        endFrequency: 820,
        duration: 0.16,
        type: "sine",
        volume: 0.045,
      });
      break;

    case "box":
      createTone({
        frequency: 180,
        endFrequency: 920,
        duration: 1.2,
        type: "sine",
        volume: 0.075,
      });
      break;

    default:
      createTone({
        frequency: 440,
        endFrequency: 520,
        duration: 0.16,
        type: "sine",
        volume: 0.04,
      });
  }
}

export async function startEngineSound(enabled = true) {
  engineEnabled = Boolean(enabled);

  if (!engineEnabled || typeof window === "undefined") {
    stopEngineSound();
    return;
  }

  const context = await resumeAudioContext();

  if (!context || engineStarted) {
    return;
  }

  engineStarted = true;

  const now = context.currentTime;

  engineGain = context.createGain();
  engineFilter = context.createBiquadFilter();

  engineOscillator = context.createOscillator();
  engineSecondaryOscillator = context.createOscillator();

  engineOscillator.type = "sawtooth";
  engineSecondaryOscillator.type = "triangle";

  engineOscillator.frequency.setValueAtTime(48, now);
  engineSecondaryOscillator.frequency.setValueAtTime(96, now);

  engineFilter.type = "lowpass";
  engineFilter.frequency.setValueAtTime(360, now);
  engineFilter.Q.setValueAtTime(2.4, now);

  engineGain.gain.setValueAtTime(0.0001, now);
  engineGain.gain.exponentialRampToValueAtTime(
    0.035,
    now + 0.25
  );

  engineOscillator.connect(engineFilter);
  engineSecondaryOscillator.connect(engineFilter);
  engineFilter.connect(engineGain);
  engineGain.connect(context.destination);

  engineOscillator.start(now);
  engineSecondaryOscillator.start(now);
}

export async function updateEngineSound(
  speed = 0,
  maximumSpeed = 160,
  accelerating = false,
  enabled = true
) {
  engineEnabled = Boolean(enabled);

  if (!engineEnabled) {
    stopEngineSound();
    return;
  }

  await startEngineSound(true);

  const context = getAudioContext();

  if (
    !context ||
    !engineStarted ||
    !engineOscillator ||
    !engineSecondaryOscillator ||
    !engineGain ||
    !engineFilter
  ) {
    return;
  }

  const safeSpeed = Math.abs(Number(speed) || 0);
  const safeMaximumSpeed = Math.max(
    1,
    Number(maximumSpeed) || 160
  );

  const speedRatio = Math.min(safeSpeed / safeMaximumSpeed, 1);
  const throttleBoost = accelerating ? 1 : 0;

  const baseFrequency =
    48 + speedRatio * 112 + throttleBoost * 7;

  const secondaryFrequency =
    baseFrequency * 2.04 + speedRatio * 18;

  const targetVolume =
    0.03 +
    speedRatio * 0.055 +
    (accelerating ? 0.012 : 0);

  const filterFrequency =
    330 +
    speedRatio * 1250 +
    (accelerating ? 160 : 0);

  const now = context.currentTime;

  engineOscillator.frequency.cancelScheduledValues(now);
  engineSecondaryOscillator.frequency.cancelScheduledValues(now);
  engineGain.gain.cancelScheduledValues(now);
  engineFilter.frequency.cancelScheduledValues(now);

  engineOscillator.frequency.setTargetAtTime(
    baseFrequency,
    now,
    0.08
  );

  engineSecondaryOscillator.frequency.setTargetAtTime(
    secondaryFrequency,
    now,
    0.07
  );

  engineGain.gain.setTargetAtTime(
    Math.max(0.0001, targetVolume),
    now,
    0.1
  );

  engineFilter.frequency.setTargetAtTime(
    filterFrequency,
    now,
    0.1
  );
}

export function stopEngineSound() {
  if (
    !engineStarted ||
    !engineOscillator ||
    !engineSecondaryOscillator
  ) {
    engineStarted = false;
    return;
  }

  const context = getAudioContext();

  const mainOscillator = engineOscillator;
  const secondaryOscillator = engineSecondaryOscillator;
  const gain = engineGain;
  const filter = engineFilter;

  engineStarted = false;
  engineOscillator = null;
  engineSecondaryOscillator = null;
  engineGain = null;
  engineFilter = null;

  if (!context) {
    return;
  }

  const now = context.currentTime;
  const stopTime = now + 0.18;

  try {
    if (gain) {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(
        Math.max(gain.gain.value, 0.0001),
        now
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        stopTime
      );
    }

    mainOscillator.stop(stopTime + 0.03);
    secondaryOscillator.stop(stopTime + 0.03);
  } catch {
    // Oscillators may already be stopped.
  }

  window.setTimeout(() => {
    try {
      mainOscillator.disconnect();
      secondaryOscillator.disconnect();
      gain?.disconnect();
      filter?.disconnect();
    } catch {
      // Already disconnected.
    }
  }, 300);
}

export function setAudioEnabled(enabled) {
  engineEnabled = Boolean(enabled);

  if (!engineEnabled) {
    stopEngineSound();
  }
}
