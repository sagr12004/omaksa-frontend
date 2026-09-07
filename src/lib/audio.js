let ctx;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function playTone(frequency = 440, duration = 0.8) {
  const audio = getCtx();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sine";
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, audio.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + duration);
}

export function playRhythm(pattern = [0, 0.25, 0.5, 0.75], duration = 1) {
  const audio = getCtx();
  pattern.forEach((offset) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "triangle";
    osc.frequency.value = 180;
    const start = audio.currentTime + offset;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.22, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(start);
    osc.stop(start + 0.14);
  });
  return duration;
}

function encodeWav(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeString = (offset, value) => {
    for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i));
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i += 1, offset += 2) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}

function addBurst(samples, sampleRate, start, frequency, length, peak) {
  const from = Math.floor(start * sampleRate);
  const count = Math.floor(length * sampleRate);
  for (let i = 0; i < count; i += 1) {
    const index = from + i;
    if (index < 0 || index >= samples.length) continue;
    const t = i / sampleRate;
    const env = Math.min(1, t / 0.008) * Math.min(1, (length - t) / 0.03);
    samples[index] += Math.sin(2 * Math.PI * frequency * t) * peak * env;
  }
}

export function createClipUrl({ kind, frequency = 440, pattern }) {
  const sampleRate = 22050;
  const duration = kind === "rhythm" ? 4 : 1;
  const samples = new Float32Array(Math.floor(sampleRate * duration));
  if (kind === "rhythm") {
    const beats = pattern?.beats?.length ? pattern.beats : [0, 1, 2, 3];
    const ands = pattern?.ands ?? [0.5, 1.5, 2.5, 3.5];
    beats.forEach((beat, index) => addBurst(samples, sampleRate, beat, 148 + index * 8, 0.18, 0.42));
    ands.forEach((beat) => addBurst(samples, sampleRate, beat, 210, 0.08, 0.16));
  } else {
    for (let i = 0; i < samples.length; i += 1) {
      const t = i / sampleRate;
      const env = Math.min(1, t / 0.03) * Math.min(1, (duration - t) / 0.08);
      samples[i] = Math.sin(2 * Math.PI * frequency * t) * 0.22 * env;
    }
  }
  return URL.createObjectURL(encodeWav(samples, sampleRate));
}
