import type { Transition, Variants } from "motion/react";

export const fadeEase = [0.22, 1, 0.36, 1] as const;

export const fadeTransition: Transition = {
  duration: 0.18,
  ease: fadeEase,
};

export const viewVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const cardVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const emptyVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const dialogPanelVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
};

export function withReducedMotion(reduced: boolean | null, transition: Transition): Transition {
  if (reduced) return { duration: 0 };
  return transition;
}
