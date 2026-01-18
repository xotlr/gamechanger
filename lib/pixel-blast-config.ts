// Shared PixelBlast configuration for consistent visuals across boot sequence and main app

export const PIXEL_BLAST_BASE = {
  variant: "circle" as const,
  pixelSize: 6,
  patternScale: 3,
  patternDensity: 0.25,
  pixelSizeJitter: 0.15,
  enableRipples: true,
  rippleSpeed: 2.0,
  rippleThickness: 0.12,
  rippleIntensityScale: 1.0,
  speed: 0.1,
  edgeFade: 0.25,
  centerGrow: 1,
}

export const PIXEL_BLAST_BLUE = {
  ...PIXEL_BLAST_BASE,
  color: "#2196f3",
  transparent: false,
}

export const PIXEL_BLAST_RED = {
  ...PIXEL_BLAST_BASE,
  color: "#ff0057",
  patternScale: 4,
  patternDensity: 0.15,
  speed: 0.08,
  edgeFade: 0.3,
  centerGrow: 0.8,
  transparent: true,
}
