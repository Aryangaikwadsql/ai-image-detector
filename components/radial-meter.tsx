type Props = {
  value: number // 0-100
  size?: number
  stroke?: number
  colorClass?: string // uses currentColor
  trackClass?: string
}

export default function RadialMeter({
  value,
  size = 140,
  stroke = 10,
  colorClass = "text-emerald-400",
  trackClass = "text-zinc-800",
}: Props) {
  const clamped = Math.max(0, Math.min(100, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (clamped / 100) * c
  return (
    <svg
      width={size}
      height={size}
      className={`block ${colorClass}`}
      role="img"
      aria-label={`Detection score ${clamped}%`}
    >
      <title>Detection score</title>
      <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
        <circle
          r={r}
          cx={0}
          cy={0}
          strokeWidth={stroke}
          className={trackClass}
          stroke="currentColor"
          fill="none"
          opacity={0.5}
        />
        <circle
          r={r}
          cx={0}
          cy={0}
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </g>
      <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" className="fill-zinc-200 font-sans text-xl">
        {clamped}%
      </text>
    </svg>
  )
}
