function rms(samples) {
  let sum = 0;
  for (let i = 0; i < samples.length; i += 1) sum += samples[i] * samples[i];
  return Math.sqrt(sum / samples.length);
}

function estimatePitch(samples, sampleRate) {
  const start = Math.floor(samples.length * 0.15);
  const end = Math.floor(samples.length * 0.85);
  const slice = samples.subarray(start, end);
  const minLag = Math.floor(sampleRate / 900);
  const maxLag = Math.min(Math.floor(sampleRate / 75), slice.length - 1);
  let bestLag = 0;
  let bestCorrelation = -Infinity;
  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let correlation = 0;
    for (let i = 0; i < slice.length - lag; i += 4) {
      correlation += slice[i] * slice[i + lag];
    }
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestLag = lag;
    }
  }
  return bestLag ? sampleRate / bestLag : 0;
}

function rhythmConsistency(samples, sampleRate) {
  const windowSize = Math.max(1, Math.floor(sampleRate * 0.04));
  const envelope = [];
  for (let i = 0; i < samples.length; i += windowSize) {
    envelope.push(rms(samples.subarray(i, Math.min(samples.length, i + windowSize))));
  }
  const peak = Math.max(...envelope, 0);
  if (!peak) return 0;
  const onsets = [];
  let armed = true;
  envelope.forEach((value, index) => {
    if (armed && value > peak * 0.5) {
      onsets.push((index * windowSize) / sampleRate);
      armed = false;
    } else if (value < peak * 0.24) {
      armed = true;
    }
  });
  if (onsets.length < 2) return 0;
  const intervals = onsets.slice(1).map((time, index) => time - onsets[index]);
  const average = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
  const error =
    intervals.reduce((sum, value) => sum + Math.abs(value - average), 0) /
    intervals.length;
  return Math.max(0, Math.min(1, 1 - error / Math.max(0.12, average)));
}

export async function analyzeRecording(blob, kind, targetFrequency) {
  const context = new AudioContext();
  try {
    const buffer = await context.decodeAudioData(await blob.arrayBuffer());
    const samples = buffer.getChannelData(0);
    const volume = rms(samples);
    if (volume < 0.006) {
      return { valid: false, score: 0, volume, reason: "Recording was too quiet" };
    }
    if (kind === "pitch") {
      const detectedFrequency = estimatePitch(samples, buffer.sampleRate);
      const cents =
        detectedFrequency && targetFrequency
          ? 1200 * Math.log2(detectedFrequency / targetFrequency)
          : Infinity;
      const score = Math.max(0, Math.min(1, 1 - Math.abs(cents) / 300));
      return { valid: true, score, volume, detectedFrequency, cents };
    }
    const score = rhythmConsistency(samples, buffer.sampleRate);
    return { valid: true, score, volume };
  } finally {
    await context.close().catch(() => {});
  }
}
