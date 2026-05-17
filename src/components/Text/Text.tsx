import React, { CSSProperties, ElementType, ReactNode } from 'react'

/**
 * Semantic color role for a {@link Text} node.
 *
 * | Variant      | CSS variable / style                          |
 * |--------------|-----------------------------------------------|
 * | `'default'`  | `--tui-fg`                                    |
 * | `'muted'`    | `--tui-fg-muted`                              |
 * | `'subtle'`   | `--tui-fg-subtle`                             |
 * | `'inverted'` | fg = `--tui-bg`, background = `--tui-fg`      |
 * | `'accent'`   | `--tui-accent`                                |
 * | `'success'`  | `--tui-success`                               |
 * | `'warning'`  | `--tui-warning`                               |
 * | `'error'`    | `--tui-error`                                 |
 * | `'info'`     | `--tui-info`                                  |
 */
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

/** Props for the {@link Text} component. */
export interface TextProps {
  /**
   * Color variant based on the active theme.
   * @default 'default'
   */
  variant?: TextVariant
  /** Uppercase with slight letter-spacing. */
  caps?: boolean
  /** Bold (font-weight 700). */
  bold?: boolean
  /** Italic. */
  italic?: boolean
  /** Underline text decoration. */
  underline?: boolean
  /** Strikethrough text decoration. Can be combined with `underline`. */
  strikethrough?: boolean
  /** Halves the element's opacity. */
  dim?: boolean
  /** Blinks the text with a CSS step animation. Respects `prefers-reduced-motion`. */
  blink?: boolean
  /** Prevents text from wrapping (`white-space: nowrap`). */
  nowrap?: boolean
  /**
   * HTML element to render. All styling features work with every tag.
   * @default 'span'
   */
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

/**
 * Inline or block text node with theme-aware color variants and common TUI text decorations.
 *
 * Renders as a `<span>` by default; use the `as` prop to emit a different HTML element
 * without losing any styling features. Multiple decorations (e.g. `underline` + `strikethrough`)
 * can be combined freely.
 *
 * @example
 * ```tsx
 * <Text variant="success" bold>Build passed</Text>
 * <Text variant="error" blink>Disk full!</Text>
 * <Text variant="muted" italic>last updated 2m ago</Text>
 * ```
 */
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
