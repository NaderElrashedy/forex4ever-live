let audioContext = null;

let engineOscillator = null;
let engineSecondaryOscillator = null;
let enginePulseOscillator = null;

let engineGain = null;
let engineFilter = null;
let enginePulseGain = null;

let engineStarted = false;
let engineEnabled = true;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!audioContext) {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return null;
    }

    audioContext = new AudioContextClass();
  }

  return audioContext;
}

export async function resumeAudioContext() {
  const context = getAudioContext();

  if (!context) {
    return null;
  }

  if (context.state === "suspended") {
    try {
      await context.resume();
    } catch (error) {
      console.warn("Unable to resume game audio:", error);
    }
  }

  return context;
}

export async function unlockAudio() {
  const context = await resumeAudioContext();

  if (!context) {
    return false;
  }

  /*
   * Play a completely silent buffer to unlock audio on
   * browsers and mobile devices.
   */
  try {
    const buffer = context.createBuffer(1, 1, 22050);
    const source = context.createBufferSource();
    const silentGain = context.createGain();

    silentGain.gain.setValueAtTime(0, context.currentTime);

    source.buffer = buffer;
    source.connect(silentGain);
    silentGain.connect(context.destination);

    source.start(0);
  } catch (error) {
    console.warn("Unable to unlock game audio:", error);
  }

  return context.state === "running";
}

function createTone({
  frequency = 440,
  endFrequency = frequency,
  duration = 0.2,
  type = "sine",
  volume = 0.04,
  delay = 0,
}) {
  const context = getAudioContext();

  if (
    !context ||
    context.state !== "running" ||
    !engineEnabled
  ) {
    return;
  }

  const startTime = context.currentTime + delay;
  const endTime = startTime + duration;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;

  oscillator.frequency.setValueAtTime(
    Math.max(20, frequency),
    startTime
  );

  oscillator.frequency.exponentialRampToValueAtTime(
    Math.max(20, endFrequency),
    endTime
  );

  gainNode.gain.setValueAtTime(0.0001, startTime);

  gainNode.gain.exponentialRampToValueAtTime(
    Math.max(0.0001, volume),
    startTime + Math.min(0.035, duration / 3)
  );

  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    endTime
  );

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(endTime + 0.04);

  oscillator.onended = () => {
    try {
      oscillator.disconnect();
      gainNode.disconnect();
    } catch {
      // Audio nodes may already be disconnected.
    }
  };
}

export async function playSound(name, enabled = true) {
  if (!enabled || !engineEnabled) {
    return;
  }

  const context = await resumeAudioContext();

  if (!context || context.state !== "running") {
    return;
  }

  switch (name) {
    case "success":
      createTone({
        frequency: 520,
        endFrequency: 900,
        duration: 0.25,
        type: "sine",
        volume: 0.055,
      });

      createTone({
        frequency: 760,
        endFrequency: 1120,
        duration: 0.2,
        type: "triangle",
        volume: 0.035,
        delay: 0.1,
      });
      break;

    case "wrong":
      createTone({
        frequency: 230,
        endFrequency: 130,
        duration: 0.3,
        type: "triangle",
        volume: 0.045,
      });
      break;

    case "coin":
      createTone({
        frequency: 850,
        endFrequency: 1280,
        duration: 0.17,
        type: "sine",
        volume: 0.05,
      });
      break;

    case "phone":
      createTone({
        frequency: 620,
        endFrequency: 790,
        duration: 0.13,
        type: "sine",
        volume: 0.035,
      });
      break;

    case "box":
      createTone({
        frequency: 180,
        endFrequency: 880,
        duration: 1,
        type: "sine",
        volume: 0.06,
      });

      createTone({
        frequency: 420,
        endFrequency: 1180,
        duration: 0.8,
        type: "triangle",
        volume: 0.035,
        delay: 0.25,
      });
      break;

    default:
      createTone({
        frequency: 440,
        endFrequency: 520,
        duration: 0.14,
        type: "sine",
        volume: 0.03,
      });
  }
}

/*
 * Creates the engine nodes silently.
 *
 * The engine does not become audible here. It only becomes
 * audible through updateEngineSound when the vehicle moves.
 */
export async function startEngineSound(enabled = true) {
  if (!enabled || !engineEnabled || engineStarted) {
    return;
  }

  const context = await resumeAudioContext();

  if (!context || context.state !== "running") {
    return;
  }

  engineOscillator = context.createOscillator();
  engineSecondaryOscillator = context.createOscillator();
  enginePulseOscillator = context.createOscillator();

  engineGain = context.createGain();
  engineFilter = context.createBiquadFilter();
  enginePulseGain = context.createGain();

  /*
   * Triangle and sine waves are softer than sawtooth,
   * preventing the constant electronic buzzing sound.
   */
  engineOscillator.type = "triangle";
  engineSecondaryOscillator.type = "sine";
  enginePulseOscillator.type = "sine";

  engineOscillator.frequency.setValueAtTime(
    42,
    context.currentTime
  );

  engineSecondaryOscillator.frequency.setValueAtTime(
    84,
    context.currentTime
  );

  /*
   * Low-frequency pulse creates a subtle engine vibration.
   */
  enginePulseOscillator.frequency.setValueAtTime(
    5,
    context.currentTime
  );

  engineFilter.type = "lowpass";
  engineFilter.frequency.setValueAtTime(
    260,
    context.currentTime
  );
  engineFilter.Q.setValueAtTime(0.8, context.currentTime);

  /*
   * Start completely silent. This is important because
   * the vehicle may be stationary when audio is unlocked.
   */
  engineGain.gain.setValueAtTime(0, context.currentTime);
  enginePulseGain.gain.setValueAtTime(
    0.004,
    context.currentTime
  );

  engineOscillator.connect(engineFilter);
  engineSecondaryOscillator.connect(engineFilter);

  enginePulseOscillator.connect(enginePulseGain);
  enginePulseGain.connect(engineGain.gain);

  engineFilter.connect(engineGain);
  engineGain.connect(context.destination);

  engineOscillator.start();
  engineSecondaryOscillator.start();
  enginePulseOscillator.start();

  engineStarted = true;
}

export async function updateEngineSound(
  speed = 0,
  maximumSpeed = 160,
  accelerating = false,
  enabled = true
) {
  if (!enabled || !engineEnabled) {
    stopEngineSound();
    return;
  }

  const context = await resumeAudioContext();

  if (!context || context.state !== "running") {
    return;
  }

  if (!engineStarted) {
    await startEngineSound(true);
  }

  if (
    !engineStarted ||
    !engineOscillator ||
    !engineSecondaryOscillator ||
    !engineGain ||
    !engineFilter ||
    !enginePulseOscillator ||
    !enginePulseGain
  ) {
    return;
  }

  const numericSpeed = Math.abs(Number(speed) || 0);
  const numericMaximumSpeed = Math.max(
    Number(maximumSpeed) || 160,
    1
  );

  /*
   * Completely silence the engine when the vehicle
   * is stationary or almost stationary.
   */
  if (numericSpeed <= 2) {
    engineGain.gain.cancelScheduledValues(
      context.currentTime
    );

    engineGain.gain.setTargetAtTime(
      0,
      context.currentTime,
      0.08
    );

    return;
  }

  const speedRatio = Math.min(
    numericSpeed / numericMaximumSpeed,
    1
  );

  /*
   * Smooth engine frequencies.
   */
  const primaryFrequency =
    40 +
    speedRatio * 100 +
    (accelerating ? 5 : 0);

  const secondaryFrequency =
    primaryFrequency * 1.52;

  const pulseFrequency =
    5 +
    speedRatio * 13 +
    (accelerating ? 1.5 : 0);

  /*
   * Keep the volume controlled to avoid loud buzzing.
   */
  const targetVolume =
    0.012 +
    speedRatio * 0.032 +
    (accelerating ? 0.005 : 0);

  const filterFrequency =
    240 +
    speedRatio * 720 +
    (accelerating ? 80 : 0);

  const pulseDepth =
    0.0015 + speedRatio * 0.003;

  engineOscillator.frequency.setTargetAtTime(
    primaryFrequency,
    context.currentTime,
    0.12
  );

  engineSecondaryOscillator.frequency.setTargetAtTime(
    secondaryFrequency,
    context.currentTime,
    0.12
  );

  enginePulseOscillator.frequency.setTargetAtTime(
    pulseFrequency,
    context.currentTime,
    0.15
  );

  enginePulseGain.gain.setTargetAtTime(
    pulseDepth,
    context.currentTime,
    0.12
  );

  engineFilter.frequency.setTargetAtTime(
    filterFrequency,
    context.currentTime,
    0.12
  );

  engineGain.gain.cancelScheduledValues(
    context.currentTime
  );

  engineGain.gain.setTargetAtTime(
    targetVolume,
    context.currentTime,
    0.12
  );
}

export function stopEngineSound() {
  if (!engineStarted) {
    return;
  }

  const context = getAudioContext();

  const currentEngineOscillator = engineOscillator;
  const currentSecondaryOscillator =
    engineSecondaryOscillator;
  const currentPulseOscillator = enginePulseOscillator;

  const currentEngineGain = engineGain;
  const currentEngineFilter = engineFilter;
  const currentPulseGain = enginePulseGain;

  /*
   * Clear the global references immediately so a new
   * engine can start safely after muting and unmuting.
   */
  engineOscillator = null;
  engineSecondaryOscillator = null;
  enginePulseOscillator = null;

  engineGain = null;
  engineFilter = null;
  enginePulseGain = null;

  engineStarted = false;

  if (context && currentEngineGain) {
    try {
      currentEngineGain.gain.cancelScheduledValues(
        context.currentTime
      );

      currentEngineGain.gain.setTargetAtTime(
        0,
        context.currentTime,
        0.04
      );
    } catch {
      // Ignore audio parameter cleanup errors.
    }
  }

  window.setTimeout(() => {
    try {
      currentEngineOscillator?.stop();
    } catch {
      // Oscillator may already be stopped.
    }

    try {
      currentSecondaryOscillator?.stop();
    } catch {
      // Oscillator may already be stopped.
    }

    try {
      currentPulseOscillator?.stop();
    } catch {
      // Oscillator may already be stopped.
    }

    try {
      currentEngineOscillator?.disconnect();
      currentSecondaryOscillator?.disconnect();
      currentPulseOscillator?.disconnect();

      currentEngineFilter?.disconnect();
      currentEngineGain?.disconnect();
      currentPulseGain?.disconnect();
    } catch {
      // Audio nodes may already be disconnected.
    }
  }, 220);
}

export function setAudioEnabled(enabled) {
  engineEnabled = Boolean(enabled);

  if (!engineEnabled) {
    stopEngineSound();
  }
}
