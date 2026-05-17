import React, { useEffect, useState } from 'react'
import figlet from 'figlet'
import { TextVariant } from './Text'

const FONT_PATH = 'https://unpkg.com/figlet@1/fonts'

let fontPathSet = false
function ensureFontPath() {
  if (fontPathSet) return
  figlet.defaults({ fontPath: FONT_PATH })
  fontPathSet = true
}

function renderFiglet(text: string, font: figlet.Fonts): Promise<string> {
  return new Promise((resolve, reject) => {
    figlet.text(text, { font }, (err, result) => {
      if (err) reject(err)
      else resolve(result ?? '')
    })
  })
}

const VARIANT_COLORS: Record<TextVariant, string> = {
  default:  'var(--tui-fg)',
  muted:    'var(--tui-fg-muted)',
  subtle:   'var(--tui-fg-subtle)',
  inverted: 'var(--tui-bg)',
  accent:   'var(--tui-accent)',
  success:  'var(--tui-success)',
  warning:  'var(--tui-warning)',
  error:    'var(--tui-error)',
  info:     'var(--tui-info)',
}

/** Props for the {@link BigText} component. */
export interface BigTextProps {
  /** Text string to render as ASCII art. */
  children: string
  /**
   * Figlet font name. Any font bundled with the `figlet` npm package is valid.
   * Fonts are loaded asynchronously from `https://unpkg.com/figlet@1/fonts` on first use.
   * @default 'Standard'
   */
  font?: figlet.Fonts
  /**
   * Color variant (same options as {@link TextVariant}).
   * @default 'default'
   */
  variant?: TextVariant
  /**
   * Text alignment of the rendered ASCII art block.
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right'
  /**
   * Node displayed while the figlet font is loading.
   * Defaults to a subtle `...` span.
   */
  fallback?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * Renders text as large ASCII art using the [figlet](https://www.npmjs.com/package/figlet) library.
 *
 * Fonts are fetched from the unpkg CDN on first use and cached in memory for subsequent renders.
 * A `fallback` node is shown while loading. If figlet fails (e.g. unknown font name or network
 * error), an error message is shown in `--tui-error` color.
 *
 * @example
 * ```tsx
 * <BigText font="Big">WebTUI</BigText>
 * <BigText variant="accent" align="center">Hello</BigText>
 * ```
 */
export function BigText({
  children,
  font = 'Standard',
  variant = 'default',
  align = 'left',
  fallback,
  className,
  style,
}: BigTextProps) {
  const [output, setOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ensureFontPath()
    let cancelled = false
    setOutput(null)
    setError(null)

    renderFiglet(children, font)
      .then(result => { if (!cancelled) setOutput(result) })
      .catch(err => { if (!cancelled) setError(String(err)) })

    return () => { cancelled = true }
  }, [children, font])

  if (error) {
    return (
      <span style={{ color: 'var(--tui-error)' }}>
        BigText error: {error}
      </span>
    )
  }

  if (output === null) {
    return <>{fallback ?? <span style={{ color: 'var(--tui-fg-subtle)' }}>...</span>}</>
  }

  return (
    <pre
      role="img"
      aria-label={children}
      className={className}
      style={{
        color: variant === 'inverted' ? 'var(--tui-bg)' : VARIANT_COLORS[variant],
        ...(variant === 'inverted' && { background: 'var(--tui-fg)' }),
        textAlign: align,
        fontFamily: 'inherit',
        fontSize: 'inherit',
        lineHeight: 'var(--tui-line-height)',
        ...style,
      }}
    >
      {output}
    </pre>
  )
}
