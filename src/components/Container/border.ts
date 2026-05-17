export type BorderStyle = 'none' | 'single' | 'double' | 'rounded' | 'heavy'

export interface BorderCharSet {
  tl: string; tr: string; bl: string; br: string
  h: string; v: string
}

export const BORDERS: Record<Exclude<BorderStyle, 'none'>, BorderCharSet> = {
  single:  { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
  double:  { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
  rounded: { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' },
  heavy:   { tl: '┏', tr: '┓', bl: '┗', br: '┛', h: '━', v: '┃' },
}

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
