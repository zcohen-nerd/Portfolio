/**
 * Respect prefers-reduced-motion for ambient looping videos.
 * Autoplaying <video> elements are paused and given controls so
 * reduced-motion users see the poster frame and can opt in to playback.
 */
function applyReducedMotion() {
  if (typeof window === 'undefined') {
    return;
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  document.querySelectorAll('video[autoplay]').forEach((video) => {
    video.removeAttribute('autoplay');
    video.setAttribute('controls', '');
    try {
      video.pause();
      video.currentTime = 0;
    } catch {
      /* ignore */
    }
  });
}

export function onRouteDidUpdate() {
  applyReducedMotion();
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', applyReducedMotion);
}
