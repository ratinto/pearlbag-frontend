const SHAPES = {
  tote: ({ color, accent }) => (
    <>
      <path
        d="M22 36 C 22 30 30 28 50 28 C 70 28 78 30 78 36 L 82 80 C 82 86 78 88 72 88 L 28 88 C 22 88 18 86 18 80 Z"
        fill={color}
      />
      <path
        d="M34 30 C 34 18 42 14 50 14 C 58 14 66 18 66 30"
        fill="none"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="50" cy="58" r="2.6" fill={accent} />
    </>
  ),
  crossbody: ({ color, accent }) => (
    <>
      <path
        d="M20 40 L 30 22 L 70 22 L 80 40 L 80 82 C 80 86 78 88 74 88 L 26 88 C 22 88 20 86 20 82 Z"
        fill={color}
      />
      <path
        d="M30 22 L 14 60 M 70 22 L 86 60"
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="44"
        y="38"
        width="12"
        height="4"
        rx="1"
        fill={accent}
        opacity="0.9"
      />
    </>
  ),
  shoulder: ({ color, accent }) => (
    <>
      <path
        d="M16 50 C 16 34 30 30 50 30 C 70 30 84 34 84 50 L 80 84 C 79 88 76 90 72 90 L 28 90 C 24 90 21 88 20 84 Z"
        fill={color}
      />
      <path
        d="M28 32 C 22 18 38 8 50 8 C 62 8 78 18 72 32"
        fill="none"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect x="46" y="56" width="8" height="3" fill={accent} opacity="0.85" />
    </>
  ),
  bucket: ({ color, accent }) => (
    <>
      <path
        d="M24 38 C 24 30 36 28 50 28 C 64 28 76 30 76 38 L 80 80 C 80 86 76 88 70 88 L 30 88 C 24 88 20 86 20 80 Z"
        fill={color}
      />
      <path
        d="M30 34 C 38 22 62 22 70 34"
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M30 40 L 70 40"
        stroke={accent}
        strokeWidth="1.6"
        strokeDasharray="2 3"
      />
      <circle cx="50" cy="40" r="2" fill={accent} />
    </>
  ),
  satchel: ({ color, accent }) => (
    <>
      <rect x="18" y="34" width="64" height="54" rx="6" fill={color} />
      <path
        d="M28 34 L 28 24 C 28 18 36 14 50 14 C 64 14 72 18 72 24 L 72 34"
        fill="none"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect x="44" y="48" width="12" height="20" rx="2" fill={accent} opacity="0.18" />
      <rect x="46" y="56" width="8" height="3" fill={accent} />
    </>
  ),
  clutch: ({ color, accent }) => (
    <>
      <rect x="14" y="44" width="72" height="36" rx="6" fill={color} />
      <path
        d="M14 50 L 50 30 L 86 50"
        fill={color}
        stroke={accent}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="48" r="3.2" fill={accent} />
    </>
  ),
}

function BagIllustration({
  style = 'tote',
  color = '#cfb997',
  accent,
  background = 'linear-gradient(160deg, #f5efe2 0%, #efe5cf 100%)',
  className = '',
  size = '100%',
}) {
  const Shape = SHAPES[style] ?? SHAPES.tote
  const strokeAccent = accent ?? '#2a221b'

  return (
    <div
      className={`bag-illustration ${className}`}
      style={{
        background,
        width: size,
        aspectRatio: '1 / 1',
      }}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <filter id="bag-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>
        <ellipse cx="50" cy="92" rx="32" ry="3" fill="rgba(0,0,0,0.12)" filter="url(#bag-shadow)" />
        <g>
          <Shape color={color} accent={strokeAccent} />
        </g>
      </svg>
    </div>
  )
}

export default BagIllustration
