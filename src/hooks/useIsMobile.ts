import { useEffect, useState } from "react";

/**
 * Returns true when the viewport is ≤ 768 px wide
 * OR the primary pointer is coarse (touch screen).
 *
 * Reacts to resize so landscape↔portrait switches are handled.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.innerWidth <= 768 ||
      window.matchMedia("(pointer: coarse)").matches
    );
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}
