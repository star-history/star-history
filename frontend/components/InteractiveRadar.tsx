import { useState, useMemo } from "react"
import type { RepoAttributes } from "@shared/types/gh"

const LABELS = ["Stars", "New Stars", "Issues Closed", "Contributors", "Pushes", "Forks"]
const KEYS: (keyof RepoAttributes)[] = ["stars", "new_stars", "issues_closed", "contributors", "pushes", "forks"]

const SIZE = 400
const MARGIN = 70
const RADIUS = (SIZE - MARGIN * 2) / 2
const CX = SIZE / 2
const CY = SIZE / 2
const ANGLE_SLICE = (Math.PI * 2) / LABELS.length
const scaleR = (value: number) => (value / 99) * RADIUS

interface InteractiveRadarProps {
  attributes: RepoAttributes
  rawValues: Record<string, string>
}

export default function InteractiveRadar({ attributes, rawValues }: InteractiveRadarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const dots = useMemo(
    () =>
      KEYS.map((key, i) => {
        const value = attributes[key]
        const angle = ANGLE_SLICE * i - Math.PI / 2
        const r = scaleR(value)
        return {
          x: CX + Math.cos(angle) * r,
          y: CY + Math.sin(angle) * r,
          label: LABELS[i],
          rawValue: rawValues[key] ?? String(value),
          percentile: 100 - value,
        }
      }),
    [attributes, rawValues]
  )

  const hoveredDot = hoveredIndex !== null ? dots[hoveredIndex] : null

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={20}
            fill="transparent"
            style={{ pointerEvents: "all", cursor: "pointer" }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
      </svg>

      {hoveredDot && (
        <div
          style={{
            position: "absolute",
            left: `${(hoveredDot.x / SIZE) * 100}%`,
            top: `${(hoveredDot.y / SIZE) * 100}%`,
            transform: "translate(-50%, -100%) translateY(-12px)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <svg width="200" height="60" style={{ margin: "-5px" }}>
            <defs>
              <filter id="xkcdify-tip" x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" result="noise" />
                <feDisplacementMap scale="5" xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" in2="noise" />
              </filter>
            </defs>
            <rect
              x="5"
              y="5"
              width="190"
              height="50"
              fill="white"
              fillOpacity={0.9}
              stroke="black"
              strokeWidth={2}
              rx={5}
              ry={5}
              filter="url(#xkcdify-tip)"
            />
            <rect
              x="15"
              y="16"
              width="8"
              height="8"
              fill="#16a34a"
              rx={2}
              ry={2}
            />
            <text
              x="27"
              y="24"
              fontSize="15px"
              fontWeight="bold"
              fill="black"
              style={{ fontFamily: '"xkcd", cursive' }}
            >
              {hoveredDot.label}: {hoveredDot.rawValue}
            </text>
            <text
              x="15"
              y="44"
              fontSize="15px"
              fill="black"
              style={{ fontFamily: '"xkcd", cursive' }}
            >
              Top {hoveredDot.percentile}%
            </text>
          </svg>
        </div>
      )}
    </div>
  )
}
