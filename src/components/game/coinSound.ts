/** Three quick rising square-wave notes (C6, E6, G6). */
const NOTES = [
  { frequency: 1047, start: 0 },
  { frequency: 1319, start: 0.05 },
  { frequency: 1568, start: 0.1 },
] as const;

const PEAK_GAIN = 0.025;
const HOLD_UNTIL = 0.2;
const END = 0.26;

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

// undefined = not tried yet, null = unsupported
let context: AudioContext | null | undefined;

function getContext(): AudioContext | null {
  if (context === undefined) {
    const Ctor = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
    context = Ctor ? new Ctor() : null;
  }
  return context;
}

/** Call from a click handler: browsers only allow audio to start after a user gesture. */
export function playCoinSound() {
  try {
    const audio = getContext();
    if (!audio) return;
    if (audio.state === "suspended") void audio.resume();

    const t0 = audio.currentTime + 0.01;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "square";
    for (const { frequency, start } of NOTES) oscillator.frequency.setValueAtTime(frequency, t0 + start);

    // A tiny fade-in avoids a click; the exponential tail ends the last note
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(PEAK_GAIN, t0 + 0.004);
    gain.gain.setValueAtTime(PEAK_GAIN, t0 + HOLD_UNTIL);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + END);

    oscillator.connect(gain).connect(audio.destination);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start(t0);
    oscillator.stop(t0 + END + 0.02);
  } catch {
    // No audio support or blocked: the game works without sound
  }
}
