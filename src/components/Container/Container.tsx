import React, {
  useEffect,
  useRef,
  ReactNode,
  CSSProperties,
} from 'react'
export type { BorderStyle } from './border'
import { BorderStyle, BORDERS } from './border'
import { useTUI } from '../../hooks/useTUI'

/** Props for the {@link Container} component. */
export interface ContainerProps {
  /** Width in character cells (`1ch` units). Omit to fill parent width. */
  cols?: number
  /** Height in character cells. Omit to size to content. */
  rows?: number
  /**
   * Border style drawn with Unicode box-drawing characters.
   * @default 'none'
   */
  border?: BorderStyle
  /** Text displayed in the top border. Only visible when `border` is not `'none'`. */
  title?: string
  /**
   * Horizontal placement of `title` within the top border.
   * @default 'left'
   */
  titleSide?: 'left' | 'center' | 'right'
  /**
   * Flex direction for children.
   * @default 'column'
   */
  direction?: 'row' | 'column'
  /**
   * Gap between children in character cells.
   * @default 0
   */
  gap?: number
  /** Inner padding in cells: a single number applies to all sides; `[vertical, horizontal]` applies separately. */
  padding?: number | [number, number]
  /** Cross-axis alignment (`align-items`). */
  align?: 'start' | 'center' | 'end'
  /** Main-axis alignment (`justify-content`). */
  justify?: 'start' | 'center' | 'end' | 'space-between'
  /** When `true`, the container stretches to fill its parent's full height. */
  fill?: boolean
  /** Background CSS color value. */
  bg?: string
  /** Border color. Defaults to the theme's `--tui-border` variable. */
  borderColor?: string
  /**
   * Registers this container in the TUI context registry under the given key,
   * making its bounding rect retrievable via `getContainerRect(id)`.
   */
  id?: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const CELL_H = 'var(--tui-cell-h, 1.2em)'
const REP = 200

function HFill({ char }: { char: string }) {
  return <>{char.repeat(REP)}</>
}

function VFill({ char }: { char: string }) {
  return <>{(char + '\n').repeat(REP)}</>
}

function TopFill({ char, title, titleSide }: { char: string; title?: string; titleSide?: 'left' | 'center' | 'right' }) {
  if (!title) {
    return <HFill char={char} />
  }
  const label = ` ${title} `
  const anchor = char + char
  if (titleSide === 'right') {
    return (
      <div style={{ display: 'flex', width: '100%', overflow: 'hidden', whiteSpace: 'pre' }}>
        <span style={{ flex: 1, overflow: 'hidden' }}><HFill char={char} /></span>
        <span style={{ flexShrink: 0 }}>{anchor}{label}</span>
      </div>
    )
  }
  if (titleSide === 'center') {
    return (
      <div style={{ display: 'flex', width: '100%', overflow: 'hidden', whiteSpace: 'pre' }}>
        <span style={{ flex: 1, overflow: 'hidden' }}><HFill char={char} /></span>
        <span style={{ flexShrink: 0 }}>{label}</span>
        <span style={{ flex: 1, overflow: 'hidden' }}><HFill char={char} /></span>
      </div>
    )
  }
  // left (default)
  return (
    <div style={{ display: 'flex', width: '100%', overflow: 'hidden', whiteSpace: 'pre' }}>
      <span style={{ flexShrink: 0 }}>{label}{anchor}</span>
      <span style={{ flex: 1, overflow: 'hidden' }}><HFill char={char} /></span>
    </div>
  )
}

/**
 * Flexible layout box with an optional Unicode border and title.
 *
 * All dimensions are expressed in character cells — the fundamental unit of the TUI grid.
 * Children are arranged with flexbox; use `direction`, `gap`, `padding`, `align`, and
 * `justify` to compose complex layouts.
 *
 * @example
 * ```tsx
 * <Container border="rounded" cols={30} rows={8} title="Stats" padding={1}>
 *   <Text>Uptime: 3d 14h</Text>
 *   <Text variant="success">Status: OK</Text>
 * </Container>
 * ```
 */
export function Container({
  cols,
  rows,
  border = 'none',
  title,
  titleSide = 'left',
  direction = 'column',
  gap = 0,
  padding,
  align,
  justify,
  fill,
  bg,
  borderColor,
  id,
  className,
  style,
  children,
}: ContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { registerContainer, unregisterContainer } = useTUI()

  useEffect(() => {
    if (!id) return
    registerContainer(id, ref)
    return () => unregisterContainer(id)
  }, [id, registerContainer, unregisterContainer])

  const hasBorder = border !== 'none'
  const c = hasBorder ? BORDERS[border as Exclude<BorderStyle, 'none'>] : null

  const [padV, padH] = Array.isArray(padding)
    ? padding
    : [padding ?? 0, padding ?? 0]

  const outerStyle: CSSProperties = {
    position: 'relative',
    ...(cols !== undefined
      ? { width: `calc(${cols} * 1ch)`, flexShrink: 0 }
      : { width: '100%' }),
    ...(rows !== undefined
      ? { height: `calc(${rows} * ${CELL_H})` }
      : fill
      ? { height: '100%' }
      : {}),
    ...(hasBorder && {
      paddingTop: CELL_H,
      paddingBottom: CELL_H,
      paddingLeft: '1ch',
      paddingRight: '1ch',
      boxSizing: 'border-box' as const,
    }),
    ...(bg && { background: bg }),
    ...style,
  }

  const innerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    ...((rows !== undefined || fill) ? { height: '100%' } : {}),
    display: 'flex',
    flexDirection: direction,
    ...(gap > 0 && {
      gap: `calc(${gap} * ${CELL_H}) calc(${gap} * 1ch)`,
    }),
    ...(padV > 0 && {
      paddingTop: `calc(${padV} * ${CELL_H})`,
      paddingBottom: `calc(${padV} * ${CELL_H})`,
    }),
    ...(padH > 0 && {
      paddingLeft: `calc(${padH} * 1ch)`,
      paddingRight: `calc(${padH} * 1ch)`,
    }),
    ...(align && {
      alignItems:
        align === 'start' ? 'flex-start'
        : align === 'end' ? 'flex-end'
        : 'center',
    }),
    ...(justify && {
      justifyContent:
        justify === 'start' ? 'flex-start'
        : justify === 'end' ? 'flex-end'
        : justify === 'space-between' ? 'space-between'
        : 'center',
    }),
    overflow: 'hidden',
    boxSizing: 'border-box' as const,
  }

  const borderStyle: CSSProperties = {
    position: 'absolute',
    pointerEvents: 'none',
    color: borderColor ?? 'var(--tui-border)',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'var(--tui-line-height, 1.2)',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    whiteSpace: 'pre',
  }

  return (
    <div
      data-tui-container=""
      ref={ref}
      className={className}
      style={outerStyle}
    >
      {hasBorder && c && (
        <>
          {/* Top-left corner */}
          <span aria-hidden style={{ ...borderStyle, top: 0, left: 0, width: '1ch', height: CELL_H, overflow: 'visible' }}>{c.tl}</span>
          {/* Top-right corner */}
          <span aria-hidden style={{ ...borderStyle, top: 0, right: 0, width: '1ch', height: CELL_H, overflow: 'visible' }}>{c.tr}</span>
          {/* Bottom-left corner */}
          <span aria-hidden style={{ ...borderStyle, bottom: 0, left: 0, width: '1ch', height: CELL_H, overflow: 'visible' }}>{c.bl}</span>
          {/* Bottom-right corner */}
          <span aria-hidden style={{ ...borderStyle, bottom: 0, right: 0, width: '1ch', height: CELL_H, overflow: 'visible' }}>{c.br}</span>

          {/* Top horizontal fill */}
          <div aria-hidden style={{ ...borderStyle, top: 0, left: '1ch', right: '1ch', height: CELL_H, display: 'flex', alignItems: 'flex-start' }}>
            <TopFill char={c.h} title={title} titleSide={titleSide} />
          </div>

          {/* Bottom horizontal fill */}
          <div aria-hidden style={{ ...borderStyle, bottom: 0, left: '1ch', right: '1ch', height: CELL_H }}>
            <HFill char={c.h} />
          </div>

          {/* Left vertical fill */}
          <div aria-hidden style={{ ...borderStyle, top: CELL_H, bottom: CELL_H, left: 0, width: '1ch' }}>
            <VFill char={c.v} />
          </div>

          {/* Right vertical fill — anchored to right:0 for pixel-perfect alignment */}
          <div aria-hidden style={{ ...borderStyle, top: CELL_H, bottom: CELL_H, right: 0, width: '1ch' }}>
            <VFill char={c.v} />
          </div>
        </>
      )}
      <div style={innerStyle}>
        {children}
      </div>
    </div>
  )
}
