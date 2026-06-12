import { useEffect, useState } from "react";

/**
 * Returns true when the viewport is < 640 px wide (phone).
 * Tablets (640–1024 px) and desktops get the full layout.
 *
 * Reacts to resize so landscape↔portrait switches are handled.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 640;
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}
