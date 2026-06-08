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

      {/* Carapace body */}
      <path
        d="M9 20 Q11 14 18 12 Q25 10 27 15 Q28 19.5 25 21.5 Q21 23.5 16.5 22.5 Q11.5 21.5 9 20Z"
        fill={accentColor}
        opacity="0.82"
      />
      {/* Sheen highlight on carapace */}
      <path
        d="M12 14.5 Q16 12.5 22 13.5"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Tail segments */}
      <path
        d="M25 21 Q29 19.5 32 21.5"
        stroke={accentColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.7"
        fill="none"
      />
      <path
        d="M27.5 19 Q30.5 17.5 33 18.5"
        stroke={accentColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.45"
        fill="none"
      />

      {/* Legs */}
      <g stroke={accentColor} strokeWidth="1" strokeLinecap="round" opacity="0.55" fill="none">
        <path d="M14 21.5 L12 25.5" />
        <path d="M17 22.5 L15.5 26" />
        <path d="M20 22 L19 25.5" />
      </g>

      {/* Antennae */}
      <g stroke={accentColor} strokeWidth="0.9" strokeLinecap="round" opacity="0.6" fill="none">
        <path d="M11 14 Q7 9.5 5 6" />
        <path d="M12.5 13 Q9.5 8.5 8 5.5" />
      </g>

      {/* Eye */}
      <circle cx="11.5" cy="16.5" r="1.5" fill={accentColor} opacity="0.9" />
      <circle cx="12" cy="16" r="0.5" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}
