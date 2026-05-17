/**
 * Style of Unicode box-drawing border rendered by a {@link Container}.
 *
 * | Value      | Characters      |
 * |------------|-----------------|
 * | `'none'`   | (no border)     |
 * | `'single'` | `┌─┐│└┘`        |
 * | `'double'` | `╔═╗║╚╝`        |
 * | `'rounded'`| `╭─╮│╰╯`        |
 * | `'heavy'`  | `┏━┓┃┗┛`        |
 */
export type BorderStyle = 'none' | 'single' | 'double' | 'rounded' | 'heavy'

/** The six Unicode characters that define a single border style. */
export interface BorderCharSet {
  /** Top-left corner. */
  tl: string
  /** Top-right corner. */
  tr: string
  /** Bottom-left corner. */
  bl: string
  /** Bottom-right corner. */
  br: string
  /** Horizontal segment. */
  h: string
  /** Vertical segment. */
  v: string
}

export const BORDERS: Record<Exclude<BorderStyle, 'none'>, BorderCharSet> = {
  single:  { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
  double:  { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
  rounded: { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' },
  heavy:   { tl: '┏', tr: '┓', bl: '┗', br: '┛', h: '━', v: '┃' },
}

/**
 * Generates a complete multi-line border string suitable for rendering inside a `<pre>`.
 * Intended for static/server-side rendering — the {@link Container} component uses a
 * CSS-overflow approach instead and does not call this function.
 *
 * @param style - Border character set to use.
 * @param cols - Total column width, including the two border characters on each side.
 * @param rows - Total row height, including the top and bottom border rows.
 * @param title - Optional title inserted in the top border. Silently omitted if the box is too narrow.
 * @param titleSide - Horizontal alignment of the title within the top border.
 * @returns A newline-separated string forming the complete box, or `''` if dimensions are too small.
 *
 * @example
 * ```ts
 * buildBorderString('single', 22, 4, 'Hello', 'left')
 * // ┌─ Hello ────────────┐
 * // │                    │
 * // │                    │
 * // └────────────────────┘
 * ```
 */
export function buildBorderString(
  style: Exclude<BorderStyle, 'none'>,
  cols: number,
  rows: number,
  title?: string,
  titleSide: 'left' | 'center' | 'right' = 'left',
): string {
  const c = BORDERS[style]
  const innerW = cols - 2

  if (innerW < 0 || rows < 2) return ''

  let topLine: string
  if (title && title.length > 0 && innerW >= title.length + 4) {
    const label = ` ${title} `
    const remaining = innerW - label.length
    if (titleSide === 'right') {
      topLine = c.tl + c.h.repeat(remaining - 2) + c.h + c.h + label + c.tr
    } else if (titleSide === 'center') {
      const leftPad = Math.floor(remaining / 2)
      const rightPad = remaining - leftPad
      topLine = c.tl + c.h.repeat(leftPad) + label + c.h.repeat(rightPad) + c.tr
    } else {
      topLine = c.tl + c.h + c.h + label + c.h.repeat(remaining - 2) + c.tr
    }
  } else {
    topLine = c.tl + c.h.repeat(innerW) + c.tr
  }

  const midLine = c.v + ' '.repeat(innerW) + c.v
  const botLine = c.bl + c.h.repeat(innerW) + c.br

  const lines: string[] = [topLine]
  for (let i = 0; i < rows - 2; i++) lines.push(midLine)
  lines.push(botLine)

  return lines.join('\n')
}
