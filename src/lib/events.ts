"use client";

/**
 * Tiny event bus that lets sections wait for the preloader curtain to finish.
 */
let done = false;
const listeners = new Set<() => void>();

export function onPreloaderDone(cb: () => void): () => void {
  if (done) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function emitPreloaderDone(): void {
  if (done) return;
  done = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
}

export function isPreloaderDone(): boolean {
  return done;
}
