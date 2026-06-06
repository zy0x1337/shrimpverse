export function OrbitBackground() {
  return (
    <div className="orbit-background" aria-hidden="true">
      {/* Atmosphärische Textur (generiertes Asset) */}
      <div
        className="orbit-bg-texture"
        style={{ backgroundImage: "url('/assets/orbit_bg.png')" }}
      />
      {/* Radiale Vignette: Zentrum heller, Rand dunkler */}
      <div className="orbit-bg-vignette" />
    </div>
  );
}
