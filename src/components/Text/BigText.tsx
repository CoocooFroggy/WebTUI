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

export interface BigTextProps {
  children: string
  font?: figlet.Fonts
  variant?: TextVariant
  align?: 'left' | 'center' | 'right'
  fallback?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

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
