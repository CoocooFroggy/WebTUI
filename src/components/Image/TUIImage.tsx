import React, { useEffect, useRef, useState } from 'react'
import { useTUI } from '../../hooks/useTUI'
import { useCellSize } from '../../hooks/useCellSize'

export type ImageMode = 'half-block' | 'ascii-gray'

export interface TUIImageProps {
  src: string
  cols: number
  rows?: number
  mode?: ImageMode
  crossOrigin?: 'anonymous' | 'use-credentials'
  invert?: boolean
  fallback?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

interface CharCell {
  char: string
  fg?: string
  bg?: string
}

const ASCII_RAMP = ' ░▒▓█'

function rgbToLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function toRgba(r: number, g: number, b: number, a: number): string {
  return `rgba(${r},${g},${b},${(a / 255).toFixed(2)})`
}

function processHalfBlock(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  invert: boolean,
): CharCell[][] {
  const rows: CharCell[][] = []
  const charRows = Math.floor(height / 2)

  for (let row = 0; row < charRows; row++) {
    const line: CharCell[] = []
    for (let col = 0; col < width; col++) {
      const topIdx = ((row * 2) * width + col) * 4
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
      let fg: string | undefined
      let bg: string | undefined

      if (topBright && botBright) {
        char = '▀'
        fg = toRgba(tr, tg, tb, ta)
        bg = toRgba(br, bg2, bb, ba)
      } else if (topBright && !botBright) {
        char = '▀'
        fg = toRgba(tr, tg, tb, ta)
        bg = 'transparent'
      } else if (!topBright && botBright) {
        char = '▄'
        fg = toRgba(br, bg2, bb, ba)
        bg = 'transparent'
      } else {
        char = ' '
        fg = undefined
        bg = 'transparent'
      }

      line.push({ char, fg, bg })
    }
    rows.push(line)
  }
  return rows
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

export function TUIImage({
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
  const [halfBlockRows, setHalfBlockRows] = useState<CharCell[][] | null>(null)
  const [asciiOutput, setAsciiOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (cellSize.w === 0) return

    setHalfBlockRows(null)
    setAsciiOutput(null)
    setError(null)

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
        setError('CORS error: image pixel data could not be read.\nAdd Access-Control-Allow-Origin headers or use a CORS proxy.')
        return
      }

      if (mode === 'half-block') {
        setHalfBlockRows(processHalfBlock(imageData.data, outCols, outRows, invert))
      } else {
        setAsciiOutput(processAsciiGray(imageData.data, outCols, outRows, invert))
      }
    }

    img.onerror = () => {
      setError('Failed to load image.')
    }

    img.src = src
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

  if (halfBlockRows === null) {
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
    >
      {halfBlockRows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', whiteSpace: 'pre', height: 'var(--tui-cell-h, 1.2em)' }}>
          {row.map((cell, ci) => (
            <span
              key={ci}
              style={{
                color: cell.fg,
                background: cell.bg,
                width: '1ch',
                display: 'inline-block',
                textAlign: 'center',
                flexShrink: 0,
              }}
            >
              {cell.char}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
