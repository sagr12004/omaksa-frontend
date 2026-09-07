let ownerId = null;
let stopOwner = null;

export function claimAudio(id, stop) {
  if (ownerId && ownerId !== id) {
    const previous = stopOwner;
    ownerId = id;
    stopOwner = stop;
    previous?.();
    return;
  }
  ownerId = id;
  stopOwner = stop;
}

export function releaseAudio(id) {
  if (ownerId === id) {
    ownerId = null;
    stopOwner = null;
  }
}
