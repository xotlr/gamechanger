import { ImageResponse } from 'next/og'
import React from 'react'

export const runtime = 'edge'
export const alt = 'GAME:changer eSport & Gaming Verein'
export const size = { width: 1200, height: 630 }
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

export default async function Image() {
  // Generate SVG pixel art - large scale for OG image
  const pixelSize = 20
  const gPixels: React.ReactElement[] = []
  const cPixels: React.ReactElement[] = []

  // G letter (red)
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
      if (G_PATTERN[y][x] === 1) {
        gPixels.push(
          <rect
            key={`g-${x}-${y}`}
            x={x * pixelSize}
            y={y * pixelSize}
            width={pixelSize}
            height={pixelSize}
            fill="#ff0057"
          />
        )
      }
    }
  }

  // C letter (blue)
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
      if (C_PATTERN[y][x] === 1) {
        cPixels.push(
          <rect
            key={`c-${x}-${y}`}
            x={x * pixelSize}
            y={y * pixelSize}
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
          background: 'linear-gradient(135deg, #0a0a14 0%, #1a1a2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        {/* Scanlines effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)',
            pointerEvents: 'none',
          }}
        />

        {/* Pixel art GC logo */}
        <div style={{ display: 'flex', marginTop: '-60px' }}>
          <svg width="500" height="300" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(80, 60)">{gPixels}</g>
            <g transform="translate(280, 60)">{cPixels}</g>
          </svg>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 42,
            color: '#fff',
            marginTop: 30,
            opacity: 0.9,
            letterSpacing: '3px',
          }}
        >
          eSport & Gaming Verein Retz
        </div>

        {/* Location */}
        <div
          style={{
            fontSize: 28,
            color: '#2196f3',
            marginTop: 12,
            opacity: 0.7,
          }}
        >
          Pleissing · Niederösterreich
        </div>

        {/* Corner decorations */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '30px',
            width: '60px',
            height: '60px',
            borderTop: '4px solid #ff0057',
            borderLeft: '4px solid #ff0057',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderTop: '4px solid #ff0057',
            borderRight: '4px solid #ff0057',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '30px',
            width: '60px',
            height: '60px',
            borderBottom: '4px solid #2196f3',
            borderLeft: '4px solid #2196f3',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderBottom: '4px solid #2196f3',
            borderRight: '4px solid #2196f3',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
