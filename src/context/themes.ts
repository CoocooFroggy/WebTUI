/**
 * A complete set of CSS custom property values that define a WebTUI color theme.
 * All variables are scoped to `[data-tui-root]` and cascade to every child component.
 * Pass a `Partial<TUITheme>` as `customTheme` on {@link TUIRoot} to override individual values.
 */
export interface TUITheme {
  /** Primary foreground / text color. */
  '--tui-fg': string
  /** Secondary foreground for de-emphasized text. */
  '--tui-fg-muted': string
  /** Tertiary foreground for placeholder or ghost text. */
  '--tui-fg-subtle': string
  /** Primary background color. */
  '--tui-bg': string
  /** Elevated surface background (e.g. panels, cards). */
  '--tui-bg-surface': string
  /** Overlay background (e.g. modals, tooltips). */
  '--tui-bg-overlay': string
  /** Primary accent / highlight color. */
  '--tui-accent': string
  /** Secondary accent for softer highlights. */
  '--tui-accent-muted': string
  /** Default border color. */
  '--tui-border': string
  /** Border color when an element is focused. */
  '--tui-border-focus': string
  /** Color for success / positive state indicators. */
  '--tui-success': string
  /** Color for warning / caution state indicators. */
  '--tui-warning': string
  /** Color for error / danger state indicators. */
  '--tui-error': string
  /** Color for informational state indicators. */
  '--tui-info': string
  /** Foreground color inside a cursor block. */
  '--tui-cursor-fg': string
  /** Background color of a cursor block. */
  '--tui-cursor-bg': string
  /** Background color of selected text. */
  '--tui-selection-bg': string
  /** Foreground color of selected text. */
  '--tui-selection-fg': string
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
export type TUIFlavor = 'mocha' | 'latte' | 'nord' | 'gruvbox'

export const themes: Record<TUIFlavor, TUITheme> = {
  mocha: {
    '--tui-fg':           '#cdd6f4',
    '--tui-fg-muted':     '#a6adc8',
    '--tui-fg-subtle':    '#6c7086',
    '--tui-bg':           '#1e1e2e',
    '--tui-bg-surface':   '#313244',
    '--tui-bg-overlay':   '#45475a',
    '--tui-accent':       '#89b4fa',
    '--tui-accent-muted': '#74c7ec',
    '--tui-border':       '#585b70',
    '--tui-border-focus': '#89b4fa',
    '--tui-success':      '#a6e3a1',
    '--tui-warning':      '#f9e2af',
    '--tui-error':        '#f38ba8',
    '--tui-info':         '#89dceb',
    '--tui-cursor-fg':    '#1e1e2e',
    '--tui-cursor-bg':    '#cdd6f4',
    '--tui-selection-bg': '#45475a',
    '--tui-selection-fg': '#cdd6f4',
  },
  latte: {
    '--tui-fg':           '#4c4f69',
    '--tui-fg-muted':     '#5c5f77',
    '--tui-fg-subtle':    '#9ca0b0',
    '--tui-bg':           '#eff1f5',
    '--tui-bg-surface':   '#e6e9ef',
    '--tui-bg-overlay':   '#dce0e8',
    '--tui-accent':       '#1e66f5',
    '--tui-accent-muted': '#209fb5',
    '--tui-border':       '#bcc0cc',
    '--tui-border-focus': '#1e66f5',
    '--tui-success':      '#40a02b',
    '--tui-warning':      '#df8e1d',
    '--tui-error':        '#d20f39',
    '--tui-info':         '#04a5e5',
    '--tui-cursor-fg':    '#eff1f5',
    '--tui-cursor-bg':    '#4c4f69',
    '--tui-selection-bg': '#dce0e8',
    '--tui-selection-fg': '#4c4f69',
  },
  nord: {
    '--tui-fg':           '#d8dee9',
    '--tui-fg-muted':     '#81a1c1',
    '--tui-fg-subtle':    '#4c566a',
    '--tui-bg':           '#2e3440',
    '--tui-bg-surface':   '#3b4252',
    '--tui-bg-overlay':   '#434c5e',
    '--tui-accent':       '#88c0d0',
    '--tui-accent-muted': '#5e81ac',
    '--tui-border':       '#4c566a',
    '--tui-border-focus': '#88c0d0',
    '--tui-success':      '#a3be8c',
    '--tui-warning':      '#ebcb8b',
    '--tui-error':        '#bf616a',
    '--tui-info':         '#b48ead',
    '--tui-cursor-fg':    '#2e3440',
    '--tui-cursor-bg':    '#d8dee9',
    '--tui-selection-bg': '#434c5e',
    '--tui-selection-fg': '#d8dee9',
  },
  gruvbox: {
    '--tui-fg':           '#ebdbb2',
    '--tui-fg-muted':     '#d5c4a1',
    '--tui-fg-subtle':    '#928374',
    '--tui-bg':           '#1d2021',
    '--tui-bg-surface':   '#282828',
    '--tui-bg-overlay':   '#3c3836',
    '--tui-accent':       '#fabd2f',
    '--tui-accent-muted': '#d3869b',
    '--tui-border':       '#504945',
    '--tui-border-focus': '#fabd2f',
    '--tui-success':      '#b8bb26',
    '--tui-warning':      '#fabd2f',
    '--tui-error':        '#fb4934',
    '--tui-info':         '#83a598',
    '--tui-cursor-fg':    '#1d2021',
    '--tui-cursor-bg':    '#ebdbb2',
    '--tui-selection-bg': '#3c3836',
    '--tui-selection-fg': '#ebdbb2',
  },
}
