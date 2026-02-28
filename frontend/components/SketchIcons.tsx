import React from "react"

export const SketchGitHubIcon = ({ size = 28 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="xkcdify-gh" filterUnits="userSpaceOnUse" x="-2" y="-2" width="28" height="28">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" />
                <feDisplacementMap scale="3" xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" in2="noise" />
            </filter>
        </defs>
        <g filter="url(#xkcdify-gh)">
            <path
                d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 4.6 3 8.6 7.2 10 .5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.4-3.5-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.8.8.1-.6.3-1.1.6-1.3-2.3-.3-4.8-1.2-4.8-5.2 0-1.1.4-2.1 1-2.8-.1-.3-.5-1.3.1-2.8 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.5-.3s1.7.1 2.5.3c1.9-1.3 2.7-1 2.7-1 .6 1.5.2 2.5.1 2.8.6.7 1 1.7 1 2.8 0 4-2.5 4.9-4.8 5.2.4.3.7 1 .7 2v3c0 .3.2.6.7.5 4.2-1.4 7.2-5.4 7.2-10C22.5 6.2 17.8 1.5 12 1.5z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.5"
            />
        </g>
    </svg>
)

export const SketchLightBulbIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="xkcdify-bulb" filterUnits="userSpaceOnUse" x="-2" y="-2" width="28" height="28">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" />
        <feDisplacementMap scale="3" xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" in2="noise" />
      </filter>
    </defs>
    <g filter="url(#xkcdify-bulb)">
      {/* Bulb glass */}
      <path
        d="M12 2C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17h8v-2.3c1.8-1.2 3-3.3 3-5.7 0-3.9-3.1-7-7-7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Base rings */}
      <path d="M9 19h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 21h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Filament */}
      <path d="M10 12L12 8L14 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
)

export const WobblyClipDefs = ({ id }: { id: string }) => (
  <svg className="absolute w-0 h-0">
    <defs>
      <clipPath id={id} clipPathUnits="objectBoundingBox">
        <path d="M0.03,0.02 C0.1,0.005 0.2,0.04 0.32,0.015 C0.44,0.0 0.52,0.035 0.62,0.01 C0.74,0.0 0.85,0.035 0.95,0.02 C0.985,0.06 0.99,0.2 0.985,0.5 C0.99,0.8 0.985,0.94 0.95,0.98 C0.85,0.995 0.74,0.965 0.62,0.99 C0.52,0.97 0.44,1.0 0.32,0.98 C0.2,0.995 0.1,0.97 0.03,0.98 C0.01,0.94 0.015,0.8 0.02,0.5 C0.015,0.2 0.01,0.06 0.03,0.02 Z" />
      </clipPath>
    </defs>
  </svg>
)

export const SketchStarIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-text-bottom">
    <defs>
      <filter id="xkcdify-star" filterUnits="userSpaceOnUse" x="-2" y="-2" width="28" height="28">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" />
        <feDisplacementMap scale="3" xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" in2="noise" />
      </filter>
    </defs>
    <g filter="url(#xkcdify-star)">
      <path
        d="M12 2L14.9 8.6L22 9.3L16.8 14L18.2 21L12 17.3L5.8 21L7.2 14L2 9.3L9.1 8.6Z"
        fill="#facc15"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

export const SketchForkIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-text-bottom">
    <defs>
      <filter id="xkcdify-fork" filterUnits="userSpaceOnUse" x="-2" y="-2" width="28" height="28">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" />
        <feDisplacementMap scale="3" xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" in2="noise" />
      </filter>
    </defs>
    <g filter="url(#xkcdify-fork)">
      <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="17" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="7" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 7.5V16.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M17 7.5V10C17 12 14.5 13 12 13C9.5 13 7 12 7 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </g>
  </svg>
)

export const SketchPuzzleIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-text-bottom">
    <defs>
      <filter id="xkcdify-puzzle" filterUnits="userSpaceOnUse" x="-2" y="-2" width="28" height="28">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" />
        <feDisplacementMap scale="3" xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" in2="noise" />
      </filter>
    </defs>
    <g filter="url(#xkcdify-puzzle)">
      <path
        d="M20.5 11H19V7C19 5.9 18.1 5 17 5H13V3.5C13 2.12 11.88 1 10.5 1C9.12 1 8 2.12 8 3.5V5H4C2.9 5 2 5.9 2 7V10.8H3.5C4.99 10.8 6.2 12.01 6.2 13.5C6.2 14.99 4.99 16.2 3.5 16.2H2V20C2 21.1 2.9 22 4 22H7.8V20.5C7.8 19.01 9.01 17.8 10.5 17.8C11.99 17.8 13.2 19.01 13.2 20.5V22H17C18.1 22 19 21.1 19 20V16H20.5C21.88 16 23 14.88 23 13.5C23 12.12 21.88 11 20.5 11Z"
        fill="#f26065"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

export const SketchMailboxIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
    <defs>
      <filter id="xkcdify-mail" filterUnits="userSpaceOnUse" x="-2" y="-2" width="28" height="28">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" />
        <feDisplacementMap scale="3" xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" in2="noise" />
      </filter>
    </defs>
    <g filter="url(#xkcdify-mail)">
      {/* Envelope body */}
      <rect x="2" y="5" width="20" height="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Flap */}
      <path d="M2 5l10 8 10-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
)
