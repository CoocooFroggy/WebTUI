import React, {
  useEffect,
  useRef,
  ReactNode,
  CSSProperties,
} from 'react'
export type { BorderStyle } from './border'
import { BorderStyle, BORDERS } from './border'
import { useTUI } from '../../hooks/useTUI'

export interface ContainerProps {
  /** Width in character cells. Omit to fill parent width. */
  cols?: number
  /** Height in character cells. Omit to size to content. */
  rows?: number
  border?: BorderStyle
  title?: string
  titleSide?: 'left' | 'center' | 'right'
  direction?: 'row' | 'column'
  gap?: number
  /** Inner padding in cells: number applies to all sides, [v, h] for vertical/horizontal. */
  padding?: number | [number, number]
  align?: 'start' | 'center' | 'end'
  justify?: 'start' | 'center' | 'end' | 'space-between'
  fill?: boolean
  bg?: string
  borderColor?: string
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
