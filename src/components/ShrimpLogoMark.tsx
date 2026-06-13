/**
 * ShrimpLogoMark — the minimalist line-art shrimp used as the sidebar logo-mark.
 * Mirrors the quiet stroke style of the footer gift-note icon. Accepts an
 * accentColor prop so it reacts to the currently-selected colour family.
 */

interface Props {
  className?: string;
  accentColor?: string;
  size?: number;
}

export function ShrimpLogoMark({
  className,
  accentColor = "#2fc4b5",
  size = 36,
}: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke={accentColor}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transition: "stroke 400ms cubic-bezier(0.16,1,0.3,1)" }}
    >
      {/* Body — comma curl */}
      <path d="M10 16c-3 0-5-2.5-5-5.5S8 4 10 4s5 2.5 5 5.5" />
      {/* Tail hook */}
      <path d="M10 16c1.5 0 3-1 3-2.5" />
      {/* Antennae */}
      <path d="M7.5 5.5C6.5 4 5.5 3.5 4.5 3.5" />
      <path d="M9 5C8.5 3.5 8.5 2.5 9 2" />
    </svg>
  );
}
