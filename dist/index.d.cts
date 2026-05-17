import * as react_jsx_runtime from 'react/jsx-runtime';
import React, { ReactNode, CSSProperties, RefObject } from 'react';

/**
 * A complete set of CSS custom property values that define a WebTUI color theme.
 * All variables are scoped to `[data-tui-root]` and cascade to every child component.
 * Pass a `Partial<TUITheme>` as `customTheme` on {@link TUIRoot} to override individual values.
 */
interface TUITheme {
    /** Primary foreground / text color. */
    '--tui-fg': string;
    /** Secondary foreground for de-emphasized text. */
    '--tui-fg-muted': string;
    /** Tertiary foreground for placeholder or ghost text. */
    '--tui-fg-subtle': string;
    /** Primary background color. */
    '--tui-bg': string;
    /** Elevated surface background (e.g. panels, cards). */
    '--tui-bg-surface': string;
    /** Overlay background (e.g. modals, tooltips). */
    '--tui-bg-overlay': string;
    /** Primary accent / highlight color. */
    '--tui-accent': string;
    /** Secondary accent for softer highlights. */
    '--tui-accent-muted': string;
    /** Default border color. */
    '--tui-border': string;
    /** Border color when an element is focused. */
    '--tui-border-focus': string;
    /** Color for success / positive state indicators. */
    '--tui-success': string;
    /** Color for warning / caution state indicators. */
    '--tui-warning': string;
    /** Color for error / danger state indicators. */
    '--tui-error': string;
    /** Color for informational state indicators. */
    '--tui-info': string;
    /** Foreground color inside a cursor block. */
    '--tui-cursor-fg': string;
    /** Background color of a cursor block. */
    '--tui-cursor-bg': string;
    /** Background color of selected text. */
    '--tui-selection-bg': string;
    /** Foreground color of selected text. */
    '--tui-selection-fg': string;
}
/**
 * Built-in color theme identifier passed to `<TUIRoot theme="...">`.
 *
 * | Value       | Style                    |
 * |-------------|--------------------------|
 * | `'mocha'`   | Catppuccin Mocha (dark)  |
 * | `'latte'`   | Catppuccin Latte (light) |
 * | `'nord'`    | Nord (dark, arctic)      |
 * | `'gruvbox'` | Gruvbox (warm dark)      |
 */
type TUIFlavor = 'mocha' | 'latte' | 'nord' | 'gruvbox';
declare const themes: Record<TUIFlavor, TUITheme>;

/** Props for the {@link TUIRoot} component. */
interface TUIRootProps {
    /**
     * Built-in color theme to apply.
     * @default 'mocha'
     */
    theme?: TUIFlavor;
    /**
     * Override individual theme CSS variables. Merged on top of the active `theme`,
     * so you only need to specify the values you want to change.
     * @example { '--tui-bg': '#000000', '--tui-accent': '#ff0000' }
     */
    customTheme?: Partial<TUITheme>;
    /**
     * Base font size in pixels. Sets the `--tui-font-size` CSS variable and
     * determines the cell height together with `lineHeight`.
     * @default 14
     */
    fontSize?: number;
    /**
     * Line height multiplier. Sets `--tui-cell-h` = `fontSize × lineHeight`.
     * @default 1.2
     */
    lineHeight?: number;
    /**
     * URL of a font stylesheet to inject into `<head>`.
     * Defaults to JetBrains Mono from Google Fonts. Pass `''` to skip font injection.
     */
    fontUrl?: string;
    /**
     * When `true`, the root element fills the entire viewport (`100vw × 100vh`)
     * with `overflow: hidden`.
     */
    fullscreen?: boolean;
    /** Content rendered inside the TUI context. Must include all other WebTUI components. */
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
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
declare function TUIRoot({ theme: initialFlavor, customTheme, fontSize, lineHeight, fontUrl, fullscreen, children, className, style, }: TUIRootProps): react_jsx_runtime.JSX.Element;

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
type BorderStyle = 'none' | 'single' | 'double' | 'rounded' | 'heavy';

/** Props for the {@link Container} component. */
interface ContainerProps {
    /** Width in character cells (`1ch` units). Omit to fill parent width. */
    cols?: number;
    /** Height in character cells. Omit to size to content. */
    rows?: number;
    /**
     * Border style drawn with Unicode box-drawing characters.
     * @default 'none'
     */
    border?: BorderStyle;
    /** Text displayed in the top border. Only visible when `border` is not `'none'`. */
    title?: string;
    /**
     * Horizontal placement of `title` within the top border.
     * @default 'left'
     */
    titleSide?: 'left' | 'center' | 'right';
    /**
     * Flex direction for children.
     * @default 'column'
     */
    direction?: 'row' | 'column';
    /**
     * Gap between children in character cells.
     * @default 0
     */
    gap?: number;
    /** Inner padding in cells: a single number applies to all sides; `[vertical, horizontal]` applies separately. */
    padding?: number | [number, number];
    /** Cross-axis alignment (`align-items`). */
    align?: 'start' | 'center' | 'end';
    /** Main-axis alignment (`justify-content`). */
    justify?: 'start' | 'center' | 'end' | 'space-between';
    /** When `true`, the container stretches to fill its parent's full height. */
    fill?: boolean;
    /** Background CSS color value. */
    bg?: string;
    /** Border color. Defaults to the theme's `--tui-border` variable. */
    borderColor?: string;
    /**
     * Registers this container in the TUI context registry under the given key,
     * making its bounding rect retrievable via `getContainerRect(id)`.
     */
    id?: string;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
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
declare function Container({ cols, rows, border, title, titleSide, direction, gap, padding, align, justify, fill, bg, borderColor, id, className, style, children, }: ContainerProps): react_jsx_runtime.JSX.Element;

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
type TextVariant = 'default' | 'muted' | 'subtle' | 'inverted' | 'accent' | 'success' | 'warning' | 'error' | 'info';
/** Props for the {@link Text} component. */
interface TextProps {
    /**
     * Color variant based on the active theme.
     * @default 'default'
     */
    variant?: TextVariant;
    /** Uppercase with slight letter-spacing. */
    caps?: boolean;
    /** Bold (font-weight 700). */
    bold?: boolean;
    /** Italic. */
    italic?: boolean;
    /** Underline text decoration. */
    underline?: boolean;
    /** Strikethrough text decoration. Can be combined with `underline`. */
    strikethrough?: boolean;
    /** Halves the element's opacity. */
    dim?: boolean;
    /** Blinks the text with a CSS step animation. Respects `prefers-reduced-motion`. */
    blink?: boolean;
    /** Prevents text from wrapping (`white-space: nowrap`). */
    nowrap?: boolean;
    /**
     * HTML element to render. All styling features work with every tag.
     * @default 'span'
     */
    as?: 'span' | 'p' | 'div' | 'label' | 'code' | 'pre';
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    onClick?: (e: React.MouseEvent) => void;
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
declare function Text({ variant, caps, bold, italic, underline, strikethrough, dim, blink, nowrap, as: Tag, className, style, children, onClick, }: TextProps): react_jsx_runtime.JSX.Element;

/** Props for the {@link BigText} component. */
interface BigTextProps {
    /** Text string to render as ASCII art. */
    children: string;
    /**
     * Figlet font name. Any font bundled with the `figlet` npm package is valid.
     * Fonts are loaded asynchronously from `https://unpkg.com/figlet@1/fonts` on first use.
     * @default 'Standard'
     */
    font?: figlet.Fonts;
    /**
     * Color variant (same options as {@link TextVariant}).
     * @default 'default'
     */
    variant?: TextVariant;
    /**
     * Text alignment of the rendered ASCII art block.
     * @default 'left'
     */
    align?: 'left' | 'center' | 'right';
    /**
     * Node displayed while the figlet font is loading.
     * Defaults to a subtle `...` span.
     */
    fallback?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
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
declare function BigText({ children, font, variant, align, fallback, className, style, }: BigTextProps): react_jsx_runtime.JSX.Element;

/**
 * Rendering algorithm used by {@link TUIImage}.
 *
 * - `'half-block'` — Uses Unicode half-block characters (`▀` / `▄`) with per-cell RGBA colors.
 *   Produces full-color output; each character cell represents **two** pixel rows.
 * - `'ascii-gray'` — Maps pixel luminance to the ASCII ramp ` ░▒▓█`.
 *   Produces monochrome output using the active `--tui-fg` color.
 */
type ImageMode = 'half-block' | 'ascii-gray';
/** Props for the {@link TUIImage} component. */
interface TUIImageProps {
    /** URL of the source image. Must be CORS-accessible when hosted on a different origin. */
    src: string;
    /** Output width in character cells. */
    cols: number;
    /**
     * Output height in character cells. When omitted, the source image's aspect ratio is
     * preserved, accounting for the actual rendered cell dimensions.
     */
    rows?: number;
    /**
     * Rendering algorithm to use.
     * @default 'half-block'
     */
    mode?: ImageMode;
    /**
     * CORS credential mode forwarded to the internal `<img>` element.
     * @default 'anonymous'
     */
    crossOrigin?: 'anonymous' | 'use-credentials';
    /**
     * When `true`, pixel brightness values are inverted before character mapping.
     * @default false
     */
    invert?: boolean;
    /**
     * Fallback content shown when the image fails to load or a CORS error occurs.
     * Defaults to a preformatted error message in `--tui-error` color.
     */
    fallback?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Converts a raster image to a character-art representation rendered entirely in HTML.
 *
 * Image pixels are sampled via an off-screen `<canvas>` and mapped to Unicode characters.
 * The output respects the current cell dimensions from {@link useCellSize} so the result
 * stays proportional at any font size.
 *
 * **CORS note:** The source image must serve an `Access-Control-Allow-Origin` header,
 * or the canvas `getImageData` call will be blocked. Use a CORS proxy if you cannot
 * control the server headers.
 *
 * @example
 * ```tsx
 * <TUIImage src="/avatar.png" cols={40} mode="half-block" />
 * <TUIImage src="/logo.png" cols={60} rows={20} mode="ascii-gray" invert />
 * ```
 */
declare const TUIImage: React.NamedExoticComponent<TUIImageProps>;

/**
 * Value provided by the TUI context to all descendants of {@link TUIRoot}.
 * Access via the {@link useTUI} hook.
 */
interface TUIContextValue {
    /** The currently active theme flavor. */
    flavor: TUIFlavor;
    /** Changes the active theme flavor. Triggers a re-render of all TUI components. */
    setFlavor: (flavor: TUIFlavor) => void;
    /** The resolved theme object containing all CSS variable values for the active flavor. */
    theme: TUITheme;
    /** Ref to the root `<div data-tui-root>` element. */
    rootRef: RefObject<HTMLDivElement | null>;
    /** Font size in pixels, as passed to `<TUIRoot fontSize>`. */
    fontSize: number;
    /** Line height multiplier, as passed to `<TUIRoot lineHeight>`. */
    lineHeight: number;
    /**
     * Registers a container in the registry under `id`.
     * Called automatically by `<Container id="...">` — you rarely need this directly.
     */
    registerContainer: (id: string, ref: RefObject<HTMLElement | null>) => void;
    /**
     * Removes a previously registered container from the registry.
     * Called automatically on unmount by `<Container id="...">`.
     */
    unregisterContainer: (id: string) => void;
    /**
     * Returns the bounding rect of a registered container, or `null` if not found.
     * Useful for positioning graphics overlays relative to a named container.
     *
     * @example
     * ```ts
     * const { getContainerRect } = useTUI()
     * const rect = getContainerRect('sidebar')
     * // rect.x, rect.y, rect.width, rect.height in viewport coordinates
     * ```
     */
    getContainerRect: (id: string) => DOMRect | null;
}

/**
 * Returns the {@link TUIContextValue} from the nearest {@link TUIRoot} ancestor.
 *
 * Use this hook to read or change the active theme, access cell measurements,
 * or query the container registry.
 *
 * @throws {Error} When called outside of a `<TUIRoot>` tree.
 *
 * @example
 * ```tsx
 * function ThemeSwitcher() {
 *   const { flavor, setFlavor } = useTUI()
 *   return <Text onClick={() => setFlavor('nord')}>{flavor}</Text>
 * }
 * ```
 */
declare function useTUI(): TUIContextValue;

/**
 * Pixel dimensions of a single monospace character cell in the TUI root.
 * Measured at runtime by inserting a probe element — values reflect the
 * actual rendered font and font-size, not CSS estimates.
 */
interface CellSize {
    /** Cell width in pixels (approximately `1ch`). */
    w: number;
    /** Cell height in pixels (approximately `fontSize × lineHeight`). */
    h: number;
}
/**
 * Measures the actual pixel dimensions of a character cell within the given root element.
 *
 * Inserts a hidden `'0'` span into `rootRef.current`, reads its bounding rect,
 * then removes it. Returns `{ w: 8, h: 16.8 }` as a fallback until the ref mounts.
 *
 * Primarily used by {@link TUIImage} to correctly preserve image aspect ratios.
 *
 * @param rootRef - Ref to the element whose font metrics should be measured.
 *   Normally the `rootRef` from {@link useTUI}.
 *
 * @example
 * ```tsx
 * const { rootRef } = useTUI()
 * const { w, h } = useCellSize(rootRef)
 * // e.g. w ≈ 8.4, h ≈ 16.8 for 14px JetBrains Mono at 1.2 line-height
 * ```
 */
declare function useCellSize(rootRef: RefObject<HTMLElement | null>): CellSize;

export { BigText, type BigTextProps, type BorderStyle, type CellSize, Container, type ContainerProps, type ImageMode, type TUIContextValue, type TUIFlavor, TUIImage, type TUIImageProps, TUIRoot, type TUITheme, Text, type TextProps, type TextVariant, themes, useCellSize, useTUI };
