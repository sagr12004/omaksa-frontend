export function publicAsset(path) {
  const relative = String(path).replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${relative}`;
}

export const assets = {
  guitarSoundhole: publicAsset("assets/guitar-soundhole.png"),
  heroLogin: publicAsset("assets/hero-login.jpeg"),
  paperTexture: publicAsset("assets/paper-texture.jpeg"),
  avatar: publicAsset("assets/avatar.png"),
  grandPiano: publicAsset("assets/grand-piano.jpg"),
  notesCluster: publicAsset("assets/notes-cluster.png"),
  guitarWide: publicAsset("assets/guitar-wide.png"),
  guitarNeck: publicAsset("assets/guitar-neck.png"),
  heroPassword: publicAsset("assets/hero-password.jpeg"),
  loginFrameBg: publicAsset("assets/login-frame-bg.png"),
  pianoGuitarBg: publicAsset("assets/piano-guitar-bg.png"),
  violin: publicAsset("assets/violin.jpg"),
  playButton: publicAsset("assets/play-button.png"),
  waveformGold: publicAsset("assets/waveform-gold.png"),
  loaderClef: publicAsset("assets/loader-clef.png"),
  notesLoader: publicAsset("assets/notes-loader.png"),
  vinyl: publicAsset("assets/vinyl.png"),
  notesSmall: publicAsset("assets/notes-small.png"),
};
