let audioContext = null;
let engineOscillator = null;
let engineGain = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) return null;

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function createTone({
  frequency = 440,
  endFrequency = frequency,
  duration = 0.2,
  type = "sine",
  volume = 0.05,
}) {
  const context = getAudioContext();

  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    Math.max(1, endFrequency),
    now + duration
  );

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + duration
  );

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + duration + 0.03);
}

export function playSound(name, enabled = true) {
  if (!enabled) return;

  if (name === "success") {
    createTone({
      frequency: 520,
      endFrequency: 960,
      duration: 0.32,
      type: "sine",
      volume: 0.07,
    });

    window.setTimeout(() => {
      createTone({
        frequency: 780,
        endFrequency: 1180,
        duration: 0.25,
        type: "sine",
        volume: 0.045,
      });
    }, 100);

    return;
  }

  if (name === "wrong") {
    createTone({
      frequency: 210,
      endFrequency: 120,
      duration: 0.38,
      type: "sawtooth",
      volume: 0.045,
    });

    return;
  }

  if (name === "coin") {
    createTone({
      frequency: 880,
      endFrequency: 1320,
      duration: 0.14,
      type: "triangle",
      volume: 0.04,
    });

    return;
  }

  if (name === "phone") {
    createTone({
      frequency: 650,
      endFrequency: 820,
      duration: 0.13,
      type: "sine",
      volume: 0.035,
    });

    return;
  }

  if (name === "box") {
    createTone({
      frequency: 180,
      endFrequency: 920,
      duration: 1.2,
      type: "sine",
      volume: 0.08,
    });

    return;
  }

  createTone({
    frequency: 440,
    endFrequency: 520,
    duration: 0.12,
    type: "sine",
    volume: 0.03,
  });
}

export function startEngineSound(enabled = true) {
  if (!enabled || engineOscillator) return;

  const context = getAudioContext();

  if (!context) return;

  engineOscillator = context.createOscillator();
  engineGain = context.createGain();

  engineOscillator.type = "sawtooth";
  engineOscillator.frequency.value = 45;
  engineGain.gain.value = 0.012;

  engineOscillator.connect(engineGain);
  engineGain.connect(context.destination);
  engineOscillator.start();
}

export function updateEngineSound(speed, enabled = true) {
  if (!enabled) {
    stopEngineSound();
    return;
  }

  if (!engineOscillator) {
    startEngineSound(true);
  }

  if (!audioContext || !engineOscillator || !engineGain) return;

  const now = audioContext.currentTime;
  const normalizedSpeed = Math.min(1, Math.abs(speed) / 24);

  engineOscillator.frequency.setTargetAtTime(
    45 + normalizedSpeed * 90,
    now,
    0.08
  );

  engineGain.gain.setTargetAtTime(
    0.008 + normalizedSpeed * 0.014,
    now,
    0.08
  );
}

export function stopEngineSound() {
  if (engineOscillator) {
    try {
      engineOscillator.stop();
    } catch {
      // The oscillator may already be stopped.
    }

    engineOscillator.disconnect();
  }

  if (engineGain) {
    engineGain.disconnect();
  }

  engineOscillator = null;
  engineGain = null;
}
