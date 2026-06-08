/**
 * Ambient "mystic aura" background that sits behind the whole page: slowly
 * drifting colored light blobs, a faint starfield, and a vignette. Purely
 * decorative and non-interactive; animations respect prefers-reduced-motion
 * via CSS.
 */
export function AuroraBackground() {
  return (
    <div className="aurora-bg" aria-hidden="true">
      <div className="aurora-blob aurora-blob--1" />
      <div className="aurora-blob aurora-blob--2" />
      <div className="aurora-blob aurora-blob--3" />
      <div className="aurora-stars" />
      <div className="aurora-vignette" />
    </div>
  );
}
