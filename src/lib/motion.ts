import type { Transition, Variants } from "motion/react";

export const fadeEase = [0.22, 1, 0.36, 1] as const;

export const fadeTransition: Transition = {
  duration: 0.22,
  ease: fadeEase,
};

export const springTransition: Transition = {
  type: "spring",
  stiffness: 340,
  damping: 28,
};

export const viewVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const cardVariants: Variants = {
  initial: { opacity: 0, scale: 0.94, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: -8 },
};

export const planetVariants: Variants = {
  initial: { opacity: 0, scale: 0.45 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
};

export const emptyVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const dialogPanelVariants: Variants = {
  initial: { opacity: 0, scale: 0.96, y: 18 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: 10 },
};

export function withReducedMotion(reduced: boolean | null, transition: Transition): Transition {
  if (reduced) return { duration: 0 };
  return transition;
}

export function staggerDelay(reduced: boolean | null, index: number, step = 0.025): number {
  if (reduced) return 0;
  return Math.min(index * step, 0.2);
}
