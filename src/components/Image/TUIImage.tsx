import React, { useLayoutEffect, useState } from 'react'
import { useTUI } from '../../hooks/useTUI'
import { useCellSize } from '../../hooks/useCellSize'

/**
 * Rendering algorithm used by {@link TUIImage}.
 *
 * - `'half-block'` — Uses Unicode half-block characters (`▀` / `▄`) with per-cell RGBA colors.
 *   Produces full-color output; each character cell represents **two** pixel rows.
 * - `'ascii-gray'` — Maps pixel luminance to the ASCII ramp ` ░▒▓█`.
 *   Produces monochrome output using the active `--tui-fg` color.
 */
export type ImageMode = 'half-block' | 'ascii-gray'

/** Props for the {@link TUIImage} component. */
export interface TUIImageProps {
  /** URL of the source image. Must be CORS-accessible when hosted on a different origin. */
  src: string
  /** Output width in character cells. */
  cols: number
  /**
   * Output height in character cells. When omitted, the source image's aspect ratio is
   * preserved, accounting for the actual rendered cell dimensions.
   */
  rows?: number
  /**
   * Rendering algorithm to use.
   * @default 'half-block'
   */
  mode?: ImageMode
  /**
   * CORS credential mode forwarded to the internal `<img>` element.
   * @default 'anonymous'
   */
  crossOrigin?: 'anonymous' | 'use-credentials'
  /**
   * When `true`, pixel brightness values are inverted before character mapping.
   * @default false
   */
  invert?: boolean
  /**
   * Fallback content shown when the image fails to load or a CORS error occurs.
   * Defaults to a preformatted error message in `--tui-error` color.
   */
  fallback?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const ASCII_RAMP = ' ░▒▓█'

// Module-level cache of processed output, keyed by render params.
// For half-block mode the value is a pre-built HTML string so renders only
// need a single innerHTML assignment instead of reconciling thousands of spans.
type CachedGrid =
  | { kind: 'half-block'; html: string }
  | { kind: 'ascii-gray'; output: string }

const gridCache = new Map<string, CachedGrid>()

function gridCacheKey(
  src: string,
  cols: number,
  rows: number | undefined,
  mode: ImageMode,
  invert: boolean,
  cellW: number,
  cellH: number,
): string {
  return `${src}|${cols}|${rows ?? 'auto'}|${mode}|${invert}|${cellW.toFixed(2)}|${cellH.toFixed(2)}`
}

function rgbToLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function toRgba(r: number, g: number, b: number, a: number): string {
  return `rgba(${r},${g},${b},${(a / 255).toFixed(2)})`
}

// Builds the complete innerHTML string for half-block mode. Constructing HTML
// directly and assigning via innerHTML is ~10x faster than creating thousands
// of React span elements and reconciling them through the fiber tree.
function buildHalfBlockHtml(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  invert: boolean,
): string {
  const base = 'width:1ch;display:inline-block;text-align:center;flex-shrink:0'
  const charRows = Math.floor(height / 2)
  const rows: string[] = []

  for (let row = 0; row < charRows; row++) {
    const spans: string[] = []
    for (let col = 0; col < width; col++) {
      const topIdx = (row * 2 * width + col) * 4
      const botIdx = ((row * 2 + 1) * width + col) * 4

      let tr = data[topIdx]!, tg = data[topIdx + 1]!, tb = data[topIdx + 2]!, ta = data[topIdx + 3]!
      let br = data[botIdx]!, bg2 = data[botIdx + 1]!, bb = data[botIdx + 2]!, ba = data[botIdx + 3]!

      if (invert) {
        tr = 255 - tr; tg = 255 - tg; tb = 255 - tb
        br = 255 - br; bg2 = 255 - bg2; bb = 255 - bb
      }

      const topLum = rgbToLuminance(tr, tg, tb) * (ta / 255)
      const botLum = rgbToLuminance(br, bg2, bb) * (ba / 255)
      const threshold = 32
      const topBright = topLum > threshold
      const botBright = botLum > threshold

      let char: string
      let style = base

      if (topBright && botBright) {
        char = '▀'
        style += `;color:${toRgba(tr, tg, tb, ta)};background:${toRgba(br, bg2, bb, ba)}`
      } else if (topBright) {
        char = '▀'
        style += `;color:${toRgba(tr, tg, tb, ta)}`
      } else if (botBright) {
        char = '▄'
        style += `;color:${toRgba(br, bg2, bb, ba)}`
      } else {
        char = ' '
      }

      spans.push(`<span style="${style}">${char}</span>`)
    }
    rows.push(`<div style="display:flex;white-space:pre;height:var(--tui-cell-h,1.2em)">${spans.join('')}</div>`)
  }
  return rows.join('')
}

function processAsciiGray(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  invert: boolean,
): string {
  let result = ''
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = (row * width + col) * 4
      let lum = rgbToLuminance(data[idx]!, data[idx + 1]!, data[idx + 2]!) * (data[idx + 3]! / 255)
      if (invert) lum = 255 - lum
      const charIdx = Math.floor((lum / 255) * (ASCII_RAMP.length - 1))
      result += ASCII_RAMP[charIdx]
    }
    if (row < height - 1) result += '\n'
  }
  return result
}

/**
 * Converts a raster image to a character-art representation rendered entirely in HTML.
 *
 * Image pixels are sampled via an off-screen `<canvas>` and mapped to Unicode characters.
 * The output respects the current cell dimensions from {@link useCellSize} so the result
 * stays proportional at any font size.
 *
 * **CORS note:** The source image must serve an `Access-Control-Allow-Origin` header,
 * or the canvas `getImageData` call will be blocked. Use a CORS proxy if you cannot
 * control the server headers.
 *
 * @example
 * ```tsx
 * <TUIImage src="/avatar.png" cols={40} mode="half-block" />
 * <TUIImage src="/logo.png" cols={60} rows={20} mode="ascii-gray" invert />
 * ```
 */
export const TUIImage = React.memo(function TUIImage({
  src,
  cols,
  rows,
  mode = 'half-block',
  crossOrigin = 'anonymous',
  invert = false,
  fallback,
  className,
  style,
}: TUIImageProps) {
  const { rootRef } = useTUI()
  const cellSize = useCellSize(rootRef)
  const [halfBlockHtml, setHalfBlockHtml] = useState<string | null>(null)
  const [asciiOutput, setAsciiOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useLayoutEffect(() => {
    if (cellSize.w === 0) return

    const cacheKey = gridCacheKey(src, cols, rows, mode, invert, cellSize.w, cellSize.h)
    const cached = gridCache.get(cacheKey)

    if (cached) {
      // Restore from cache synchronously before paint — no loading state shown
      setError(null)
      if (cached.kind === 'half-block') {
        setHalfBlockHtml(cached.html)
      } else {
        setAsciiOutput(cached.output)
      }
      return
    }

    setHalfBlockHtml(null)
    setAsciiOutput(null)
    setError(null)

    let cancelled = false

    const pixelCols = cols
    const pixelRows = rows !== undefined
      ? (mode === 'half-block' ? rows * 2 : rows)
      : undefined

    const img = new Image()
    img.crossOrigin = crossOrigin

    img.onload = () => {
      const aspect = img.naturalHeight / img.naturalWidth
      const outCols = pixelCols
      const outRows = pixelRows !== undefined
        ? pixelRows
        : mode === 'half-block'
          ? Math.round(pixelCols * aspect * (cellSize.w / (cellSize.h / 2)))
          : Math.round(pixelCols * aspect * (cellSize.w / cellSize.h))

      const canvas = document.createElement('canvas')
      canvas.width = outCols
      canvas.height = outRows
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(img, 0, 0, outCols, outRows)

      let imageData: ImageData
      try {
        imageData = ctx.getImageData(0, 0, outCols, outRows)
      } catch {
        if (!cancelled) setError('CORS error: image pixel data could not be read.\nAdd Access-Control-Allow-Origin headers or use a CORS proxy.')
        return
      }

      if (mode === 'half-block') {
        const html = buildHalfBlockHtml(imageData.data, outCols, outRows, invert)
        gridCache.set(cacheKey, { kind: 'half-block', html })
        if (!cancelled) setHalfBlockHtml(html)
      } else {
        const result = processAsciiGray(imageData.data, outCols, outRows, invert)
        gridCache.set(cacheKey, { kind: 'ascii-gray', output: result })
        if (!cancelled) setAsciiOutput(result)
      }
    }

    img.onerror = () => {
      if (!cancelled) setError('Failed to load image.')
    }

    img.src = src
    return () => { cancelled = true }
  }, [src, cols, rows, mode, crossOrigin, invert, cellSize.w, cellSize.h])

  if (error) {
    return (
      fallback ?? (
        <pre
          style={{
            color: 'var(--tui-error)',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'var(--tui-line-height)',
          }}
        >
          {`⚠ ${error}`}
        </pre>
      )
    )
  }

  if (mode === 'ascii-gray') {
    if (asciiOutput === null) {
      return <span style={{ color: 'var(--tui-fg-subtle)' }}>...</span>
    }
    return (
      <pre
        className={className}
        style={{
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: 'var(--tui-line-height)',
          color: 'var(--tui-fg)',
          ...style,
        }}
      >
        {asciiOutput}
      </pre>
    )
  }

  if (halfBlockHtml === null) {
    return <span style={{ color: 'var(--tui-fg-subtle)' }}>...</span>
  }

  return (
    <div
      className={className}
      style={{
        fontFamily: 'inherit',
        fontSize: 'inherit',
        lineHeight: 'var(--tui-line-height)',
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: halfBlockHtml }}
    />
  )
})
