import React, { CSSProperties } from 'react'
import { TUIRoot, Container, Text, BigText, TUIImage, useTUI } from '@webtui'
import type { TUIFlavor, BorderStyle } from '@webtui'

const DEMO_COLS = 110

export default function App() {
  return (
    <TUIRoot
      theme="mocha"
      fontSize={14}
      style={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 'calc(2 * var(--tui-cell-h)) 2ch',
        boxSizing: 'border-box' as const,
        overflowX: 'auto',
      }}
    >
      <Dashboard />
    </TUIRoot>
  )
}

function Dashboard() {
  const { flavor, setFlavor } = useTUI()
  const FLAVORS: TUIFlavor[] = ['mocha', 'latte', 'nord', 'gruvbox']

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--tui-cell-h)',
        width: `calc(${DEMO_COLS} * 1ch)`,
      }}
    >
      {/* ── Header: auto-sized to content, double border ── */}
      <Container border="double" title="WebTUI v0.1.0" titleSide="right" padding={[1, 2]}>
        <BigText
          font="Standard"
          variant="accent"
          fallback={
            <Text variant="accent" as="p" style={{ fontSize: '2em' }}>
              WebTUI
            </Text>
          }
        >
          WebTUI
        </BigText>
        <Text variant="muted" as="p" style={{ marginTop: 'calc(0.5 * var(--tui-cell-h))' }}>
          Terminal aesthetics for the modern web — built with React
        </Text>
      </Container>

      {/* ── Theme Switcher: auto-height, explicit width ── */}
      <Container cols={DEMO_COLS} border="single" title="Theme" direction="row" gap={1} padding={[0, 1]}>
        {FLAVORS.map(f => (
          <span
            key={f}
            onClick={() => setFlavor(f)}
            style={{ cursor: 'pointer', userSelect: 'none', width: `calc(24 * 1ch)`, display: 'inline-block' }}
          >
            <Text variant={f === flavor ? 'inverted' : 'muted'}>
              {f === flavor ? '● ' : '○ '}{f}
            </Text>
          </span>
        ))}
      </Container>

      {/* ── Main Layout: Sidebar + Content ── */}
      <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
        {/* Sidebar: auto-width, auto-height */}
        <Container
          cols={22}
          border="rounded"
          title="Components"
          style={{ flexShrink: 0 }}
        >
          <NavItem active>Container</NavItem>
          <NavItem>Text</NavItem>
          <NavItem>BigText</NavItem>
          <NavItem>Image</NavItem>
          <Divider cols={20} />
          <NavItem>useTUI</NavItem>
          <NavItem>useCellSize</NavItem>
          <Divider cols={20} />
          <Text variant="subtle" as="p" style={{ marginTop: 'calc(0.5 * var(--tui-cell-h))' }}>
            Themes
          </Text>
          {FLAVORS.map(f => (
            <NavItem key={f} active={f === flavor}>
              {f === flavor ? '▶ ' : '  '}{f}
            </NavItem>
          ))}
        </Container>

        {/* Content pane: fills remaining space */}
        <Container
          border="single"
          title="Component Showcase"
          padding={[1, 1]}
          style={{ flex: 1 }}
        >
          {/* Border styles — no explicit cols/rows, just padding */}
          <SectionHeader>Border Styles</SectionHeader>
          <div style={{ display: 'flex', gap: '2ch', marginTop: 'var(--tui-cell-h)', flexWrap: 'wrap' as const }}>
            {(['single', 'double', 'rounded', 'heavy'] as BorderStyle[]).map(b => (
              <Container key={b} cols={18} rows={5} border={b} title={b} titleSide="center" />
            ))}
          </div>

          {/* Text variants */}
          <SectionHeader style={{ marginTop: 'calc(2 * var(--tui-cell-h))' }}>Text Variants</SectionHeader>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '2ch', marginTop: 'var(--tui-cell-h)' }}>
            {(['default', 'muted', 'subtle', 'accent', 'success', 'warning', 'error', 'info'] as const).map(v => (
              <Text key={v} variant={v}>{v}</Text>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '2ch', marginTop: 'calc(0.5 * var(--tui-cell-h))' }}>
            <Text variant="inverted"> inverted </Text>
            <Text bold>bold</Text>
            <Text italic>italic</Text>
            <Text caps>caps</Text>
            <Text dim>dim</Text>
            <Text underline>underline</Text>
            <Text strikethrough>strikethrough</Text>
            <Text blink variant="accent">blink</Text>
          </div>

          {/* Auto-sized bordered containers demo */}
          <SectionHeader style={{ marginTop: 'calc(2 * var(--tui-cell-h))' }}>
            Auto-Sized Containers
          </SectionHeader>
          <Text variant="muted" as="p" style={{ marginTop: 'calc(0.5 * var(--tui-cell-h))' }}>
            These borders adapt to their content — no cols/rows needed:
          </Text>
          <div style={{ display: 'flex', gap: '2ch', marginTop: 'var(--tui-cell-h)', flexWrap: 'wrap' as const }}>
            <Container border="rounded" title="auto" padding={[0, 1]}>
              <Text variant="success">✓ Sized to content</Text>
            </Container>
            <Container border="single" title="nested" padding={[0, 1]}>
              <Text variant="accent">outer</Text>
              <Container border="rounded" padding={[0, 1]}>
                <Text variant="muted">inner</Text>
              </Container>
            </Container>
            <Container border="double" title="multiline" padding={[0, 1]}>
              <Text as="p">Line one</Text>
              <Text as="p" variant="muted">Line two</Text>
              <Text as="p" variant="subtle">Line three</Text>
            </Container>
          </div>

          {/* Image */}
          <SectionHeader style={{ marginTop: 'calc(2 * var(--tui-cell-h))' }}>Image (half-block)</SectionHeader>
          <div style={{ display: 'flex', gap: '4ch', marginTop: 'var(--tui-cell-h)', alignItems: 'flex-start' }}>
            <Container border="rounded" title="color" padding={[0, 1]}>
              <TUIImage src="https://picsum.photos/seed/webtui/200/150" cols={38} mode="half-block" />
            </Container>
            <Container border="rounded" title="ascii-gray" padding={[0, 1]}>
              <TUIImage src="https://picsum.photos/seed/webtui/200/150" cols={38} mode="ascii-gray" />
            </Container>
          </div>

          <div style={{ marginTop: 'calc(2 * var(--tui-cell-h))' }}>
            <Text variant="subtle">Theme: </Text>
            <Text variant="accent">{flavor}</Text>
            <Text variant="subtle">  ·  Click a theme above to switch  ·  Built with WebTUI</Text>
          </div>
        </Container>
      </div>

      {/* ── Status Bar ── */}
      <Container cols={DEMO_COLS} rows={3} border="single" direction="row" justify="space-between" padding={[0, 1]}>
        <Text variant="muted">WebTUI</Text>
        <Text variant="subtle">Container · Text · BigText · TUIImage · useTUI · useCellSize</Text>
        <Text variant="accent">{flavor}</Text>
      </Container>
    </div>
  )
}

function NavItem({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <Text
      as="p"
      variant={active ? 'accent' : 'muted'}
      style={{ paddingLeft: '1ch', paddingTop: 'calc(0.15 * var(--tui-cell-h))' }}
    >
      {children}
    </Text>
  )
}

function Divider({ cols }: { cols: number }) {
  return (
    <Text variant="subtle" as="p" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
      {'─'.repeat(cols)}
    </Text>
  )
}

function SectionHeader({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <Text variant="accent" caps bold as="p" style={style}>
      {children}
    </Text>
  )
}
