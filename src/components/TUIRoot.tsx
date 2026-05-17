import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  CSSProperties,
} from 'react'
import { TUIContext, TUIContextValue } from '../context/TUIContext'
import { TUITheme, TUIFlavor, themes } from '../context/themes'

const CSS_SENTINEL = 'data-tui-base'

function injectBaseCSS() {
  if (document.querySelector(`[${CSS_SENTINEL}]`)) return
  const style = document.createElement('style')
  style.setAttribute(CSS_SENTINEL, '')
  style.textContent = `
[data-tui-root],
[data-tui-root] * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

[data-tui-root] {
  font-family: var(--tui-font, 'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Iosevka', monospace);
  font-size: var(--tui-font-size);
  line-height: var(--tui-line-height);
  color: var(--tui-fg);
  background: var(--tui-bg);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-variant-ligatures: none;
  position: relative;
}

[data-tui-root] pre,
[data-tui-root] code {
  font-family: inherit;
  font-size: inherit;
}

@keyframes tui-blink {
  50% { opacity: 0; }
}

.tui-blink {
  animation: tui-blink 1s step-start infinite;
}

@media (prefers-reduced-motion: reduce) {
  .tui-blink { animation: none !important; }
}
`
  document.head.appendChild(style)
}

function injectFont(fontUrl: string) {
  const id = 'tui-font-link'
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = fontUrl
  document.head.appendChild(link)
}

const JETBRAINS_MONO_URL =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,700;1,400&display=swap'

/** Props for the {@link TUIRoot} component. */
interface TUIRootProps {
  /**
   * Built-in color theme to apply.
   * @default 'mocha'
   */
  theme?: TUIFlavor
  /**
   * Override individual theme CSS variables. Merged on top of the active `theme`,
   * so you only need to specify the values you want to change.
   * @example { '--tui-bg': '#000000', '--tui-accent': '#ff0000' }
   */
  customTheme?: Partial<TUITheme>
  /**
   * Base font size in pixels. Sets the `--tui-font-size` CSS variable and
   * determines the cell height together with `lineHeight`.
   * @default 14
   */
  fontSize?: number
  /**
   * Line height multiplier. Sets `--tui-cell-h` = `fontSize × lineHeight`.
   * @default 1.2
   */
  lineHeight?: number
  /**
   * URL of a font stylesheet to inject into `<head>`.
   * Defaults to JetBrains Mono from Google Fonts. Pass `''` to skip font injection.
   */
  fontUrl?: string
  /**
   * When `true`, the root element fills the entire viewport (`100vw × 100vh`)
   * with `overflow: hidden`.
   */
  fullscreen?: boolean
  /** Content rendered inside the TUI context. Must include all other WebTUI components. */
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * Root provider for a WebTUI application. **Every other WebTUI component must be a descendant.**
 *
 * Injects base CSS resets and a blink animation into `<head>`, loads the configured font,
 * and sets all `--tui-*` CSS variables on the root element. Provides theme state and the
 * container registry to all descendants via React context.
 *
 * @example
 * ```tsx
 * <TUIRoot theme="nord" fontSize={16}>
 *   <Container border="single" cols={40} rows={10}>
 *     <Text>Hello, terminal world!</Text>
 *   </Container>
 * </TUIRoot>
 * ```
 */
export function TUIRoot({
  theme: initialFlavor = 'mocha',
  customTheme,
  fontSize = 14,
  lineHeight = 1.2,
  fontUrl = JETBRAINS_MONO_URL,
  fullscreen,
  children,
  className,
  style,
}: TUIRootProps) {
  const [flavor, setFlavorState] = useState<TUIFlavor>(initialFlavor)
  const rootRef = useRef<HTMLDivElement>(null)
  const containerRegistry = useRef<Map<string, React.RefObject<HTMLElement | null>>>(new Map())

  useEffect(() => {
    injectBaseCSS()
    if (fontUrl) injectFont(fontUrl)
  }, [fontUrl])

  // Sync flavor when prop changes
  useEffect(() => {
    setFlavorState(initialFlavor)
  }, [initialFlavor])

  const setFlavor = useCallback((f: TUIFlavor) => setFlavorState(f), [])

  const registerContainer = useCallback(
    (id: string, ref: React.RefObject<HTMLElement | null>) => {
      containerRegistry.current.set(id, ref)
    },
    []
  )

  const unregisterContainer = useCallback((id: string) => {
    containerRegistry.current.delete(id)
  }, [])

  const getContainerRect = useCallback((id: string): DOMRect | null => {
    const ref = containerRegistry.current.get(id)
    return ref?.current?.getBoundingClientRect() ?? null
  }, [])

  const resolvedTheme: TUITheme = { ...themes[flavor], ...customTheme }

  const cssVars = {
    '--tui-font-size': `${fontSize}px`,
    '--tui-line-height': String(lineHeight),
    '--tui-cell-w': '1ch',
    '--tui-cell-h': `${fontSize * lineHeight}px`,
    ...resolvedTheme,
  } as CSSProperties

  const ctx: TUIContextValue = {
    flavor,
    setFlavor,
    theme: resolvedTheme,
    rootRef,
    fontSize,
    lineHeight,
    registerContainer,
    unregisterContainer,
    getContainerRect,
  }

  return (
    <TUIContext.Provider value={ctx}>
      <div
        data-tui-root=""
        data-tui-flavor={flavor}
        ref={rootRef}
        className={className}
        style={{ ...(fullscreen && { width: '100vw', height: '100vh', overflow: 'hidden' }), ...cssVars, ...style }}
      >
        <div
          data-tui-content=""
          style={{ position: 'relative', width: '100%', height: '100%' }}
        >
          {children}
        </div>
        {/* SVG overlay: always present for future graphics/lines primitives */}
        <svg
          data-tui-overlay=""
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999,
            overflow: 'visible',
          }}
        />
      </div>
    </TUIContext.Provider>
  )
}
