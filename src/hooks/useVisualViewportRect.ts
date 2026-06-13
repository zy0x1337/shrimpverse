import { useEffect, useState } from "react";

export interface VisualViewportRect {
  offsetLeft: number;
  offsetTop: number;
  width: number;
  height: number;
  /** visualViewport.scale — guaranteed > 1 whenever this object is non-null. */
  scale: number;
}

// Browsers report scale as 0.999.../1.001... at "no zoom"; treat anything at or
// below this as unzoomed. Values < 1 (Android zoom-out) are a no-op too.
const SCALE_EPSILON = 1.02;

function shallowEqual(a: VisualViewportRect | null, b: VisualViewportRect | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.offsetLeft === b.offsetLeft &&
    a.offsetTop === b.offsetTop &&
    a.width === b.width &&
    a.height === b.height &&
    a.scale === b.scale
  );
}

/**
 * Returns the visual-viewport rect ONLY while `active` is true AND the page is
 * pinch-zoomed (scale > ~1). Returns null otherwise — desktop, SSR, browsers
 * without `visualViewport`, or scale === 1 — so callers can no-op safely.
 *
 * Tracks `resize` (zoom in/out, rotation, mobile keyboard) and `scroll`
 * (panning while zoomed) on the visualViewport so a positioned element can
 * follow the visible area. No rAF loop — the listeners suffice.
 */
export function useVisualViewportRect(active: boolean): VisualViewportRect | null {
  const [rect, setRect] = useState<VisualViewportRect | null>(null);

  useEffect(() => {
    if (!active || typeof window === "undefined" || !window.visualViewport) {
      setRect(null);
      return;
    }

    const vv = window.visualViewport;

    const read = () => {
      const next: VisualViewportRect | null =
        vv.scale <= SCALE_EPSILON
          ? null
          : {
              offsetLeft: vv.offsetLeft,
              offsetTop: vv.offsetTop,
              width: vv.width,
              height: vv.height,
              scale: vv.scale,
            };
      setRect((prev) => (shallowEqual(prev, next) ? prev : next));
    };

    read();
    vv.addEventListener("resize", read);
    vv.addEventListener("scroll", read);
    return () => {
      vv.removeEventListener("resize", read);
      vv.removeEventListener("scroll", read);
      setRect(null);
    };
  }, [active]);

  return rect;
}
