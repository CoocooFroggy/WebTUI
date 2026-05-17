import React, { CSSProperties, ElementType, ReactNode } from 'react'

export type TextVariant =
  | 'default'
  | 'muted'
  | 'subtle'
  | 'inverted'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

export interface TextProps {
  variant?: TextVariant
  caps?: boolean
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  dim?: boolean
  blink?: boolean
  nowrap?: boolean
  as?: 'span' | 'p' | 'div' | 'label' | 'code' | 'pre'
  className?: string
  style?: CSSProperties
  children?: ReactNode
  onClick?: (e: React.MouseEvent) => void
}

const VARIANT_STYLES: Record<TextVariant, CSSProperties> = {
  default:    { color: 'var(--tui-fg)' },
  muted:      { color: 'var(--tui-fg-muted)' },
  subtle:     { color: 'var(--tui-fg-subtle)' },
  inverted:   { color: 'var(--tui-bg)', background: 'var(--tui-fg)' },
  accent:     { color: 'var(--tui-accent)' },
  success:    { color: 'var(--tui-success)' },
  warning:    { color: 'var(--tui-warning)' },
  error:      { color: 'var(--tui-error)' },
  info:       { color: 'var(--tui-info)' },
}

export function Text({
  variant = 'default',
  caps,
  bold,
  italic,
  underline,
  strikethrough,
  dim,
  blink,
  nowrap,
  as: Tag = 'span',
  className,
  style,
  children,
  onClick,
}: TextProps) {
  const decorations: string[] = []
  if (underline) decorations.push('underline')
  if (strikethrough) decorations.push('line-through')

  const computedStyle: CSSProperties = {
    ...VARIANT_STYLES[variant],
    ...(caps && { textTransform: 'uppercase', letterSpacing: '0.08ch' }),
    ...(bold && { fontWeight: 700 }),
    ...(italic && { fontStyle: 'italic' }),
    ...(decorations.length > 0 && { textDecoration: decorations.join(' ') }),
    ...(dim && { opacity: 0.5 }),
    ...(nowrap && { whiteSpace: 'nowrap' }),
    ...style,
  }

  const classNames = [className, blink ? 'tui-blink' : ''].filter(Boolean).join(' ')

  return (
    <Tag
      className={classNames || undefined}
      style={computedStyle}
      onClick={onClick}
    >
      {children}
    </Tag>
  )
}
