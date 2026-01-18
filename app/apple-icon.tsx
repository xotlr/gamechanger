import { ImageResponse } from 'next/og'
import React from 'react'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Pixel-perfect blocky letters (12x12 grid)
const G_PATTERN = [
  [0,1,1,1,1,1,1,0,0,0,0,0],
  [1,1,0,0,0,0,1,1,0,0,0,0],
  [1,1,0,0,0,0,0,0,0,0,0,0],
  [1,1,0,0,0,0,0,0,0,0,0,0],
  [1,1,0,0,0,0,0,0,0,0,0,0],
  [1,1,0,0,1,1,1,1,1,0,0,0],
  [1,1,0,0,0,0,0,1,1,0,0,0],
  [1,1,0,0,0,0,0,1,1,0,0,0],
  [1,1,0,0,0,0,0,1,1,0,0,0],
  [1,1,0,0,0,0,1,1,0,0,0,0],
  [0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
]

const C_PATTERN = [
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,0,0,0,0,1,1,0,0],
  [0,0,1,1,0,0,0,0,0,0,0,0],
  [0,0,1,1,0,0,0,0,0,0,0,0],
  [0,0,1,1,0,0,0,0,0,0,0,0],
  [0,0,1,1,0,0,0,0,0,0,0,0],
  [0,0,1,1,0,0,0,0,0,0,0,0],
  [0,0,1,1,0,0,0,0,0,0,0,0],
  [0,0,1,1,0,0,0,0,0,0,0,0],
  [0,0,1,1,0,0,0,0,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
]

export default function AppleIcon() {
  // Generate SVG pixel art - scaled up for 180x180
  const pixelSize = 6
  const gPixels: React.ReactElement[] = []
  const cPixels: React.ReactElement[] = []

  // G letter (red) - left side
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
      if (G_PATTERN[y][x] === 1) {
        gPixels.push(
          <rect
            key={`g-${x}-${y}`}
            x={18 + x * pixelSize}
            y={54 + y * pixelSize}
            width={pixelSize}
            height={pixelSize}
            fill="#ff0057"
          />
        )
      }
    }
  }

  // C letter (blue) - right side
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
      if (C_PATTERN[y][x] === 1) {
        cPixels.push(
          <rect
            key={`c-${x}-${y}`}
            x={18 + x * pixelSize}
            y={54 + y * pixelSize}
            width={pixelSize}
            height={pixelSize}
            fill="#2196f3"
          />
        )
      }
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a14',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
          <rect width="180" height="180" fill="#0a0a14" />
          <g transform="translate(0, 0)">{gPixels}</g>
          <g transform="translate(78, 0)">{cPixels}</g>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
