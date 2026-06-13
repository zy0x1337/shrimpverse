/**
 * ShrimpLogoMark — a compact, stylised shrimp silhouette used as the
 * sidebar logo-mark. Accepts an accentColor prop so it reacts to the
 * currently-selected colour family.
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
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      style={{ transition: "all 400ms cubic-bezier(0.16,1,0.3,1)" }}
    >
      {/* Outer orbit ring */}
      <circle
        cx="18" cy="18" r="17"
        stroke={accentColor}
        strokeWidth="0.7"
        opacity="0.35"
      />
      {/* Inner dashed ring */}
      <circle
        cx="18" cy="18" r="11.5"
        stroke={accentColor}
        strokeWidth="0.5"
        strokeDasharray="2 3.5"
        opacity="0.2"
      />

      {/* Rostrum — spike from the head front, forward-and-up */}
      <path d="M9 14.5 L4.3 11 L9.6 13.2 Z" fill={accentColor} opacity="0.82" />

      {/* Cephalothorax — the rounded head/thorax mass with a cervical-groove dip */}
      <path
        d="M8 19 C7.5 14.5 11 12 15.5 11.8 C19 11.6 21.5 12.8 22.5 15.5 C23 17 22.5 19 21 19.8 C18 21.5 12.5 22 9.5 20.5 C8.5 20 8 19.6 8 19 Z"
        fill={accentColor}
        opacity="0.85"
      />

      {/* Abdomen — three overlapping segment plates curling down-right into the tail */}
      <path d="M20.5 13.5 C23.5 12.8 25.8 13.8 26.5 16.3 C24.8 17.2 22.3 16.8 20.8 15 Z" fill={accentColor} opacity="0.8" />
      <path d="M23.5 15.5 C26.5 15 28.5 16.3 28.8 19 C27 19.6 24.5 19 23 17 Z" fill={accentColor} opacity="0.7" />
      <path d="M25.8 18 C28.8 17.8 30.5 19.3 30.2 22 C28.3 22.2 26.2 21.2 25 19.3 Z" fill={accentColor} opacity="0.6" />

      {/* Uropod fan tail */}
      <path d="M28.8 20 Q32.6 18.8 34 20.3 Q32.2 21.5 33.5 23.4 Q31.2 23.8 29 22 Z" fill={accentColor} opacity="0.6" />

      {/* Sheen highlight following the dorsal line */}
      <path
        d="M11 14.5 Q15.5 12.6 20.5 13.8"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Legs */}
      <g stroke={accentColor} strokeWidth="1" strokeLinecap="round" opacity="0.55" fill="none">
        <path d="M13 20.5 L11.5 24.5" />
        <path d="M16 21.5 L14.8 25" />
        <path d="M19 21 L18 24.5" />
      </g>

      {/* Antennae */}
      <g stroke={accentColor} strokeWidth="0.9" strokeLinecap="round" opacity="0.6" fill="none">
        <path d="M9.5 15 Q5.5 10 3.5 6.5" />
        <path d="M10.5 14 Q7 9.5 5.5 6" />
      </g>

      {/* Eye */}
      <circle cx="11.5" cy="16.3" r="1.6" fill={accentColor} opacity="0.9" />
      <circle cx="12" cy="15.8" r="0.55" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}
