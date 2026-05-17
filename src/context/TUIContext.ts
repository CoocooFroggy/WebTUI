import { createContext, RefObject } from 'react'
import { TUITheme, TUIFlavor } from './themes'

/**
 * Value provided by the TUI context to all descendants of {@link TUIRoot}.
 * Access via the {@link useTUI} hook.
 */
export interface TUIContextValue {
  /** The currently active theme flavor. */
  flavor: TUIFlavor
  /** Changes the active theme flavor. Triggers a re-render of all TUI components. */
  setFlavor: (flavor: TUIFlavor) => void
  /** The resolved theme object containing all CSS variable values for the active flavor. */
  theme: TUITheme
  /** Ref to the root `<div data-tui-root>` element. */
  rootRef: RefObject<HTMLDivElement | null>
  /** Font size in pixels, as passed to `<TUIRoot fontSize>`. */
  fontSize: number
  /** Line height multiplier, as passed to `<TUIRoot lineHeight>`. */
  lineHeight: number
  /**
   * Registers a container in the registry under `id`.
   * Called automatically by `<Container id="...">` — you rarely need this directly.
   */
  registerContainer: (id: string, ref: RefObject<HTMLElement | null>) => void
  /**
   * Removes a previously registered container from the registry.
   * Called automatically on unmount by `<Container id="...">`.
   */
  unregisterContainer: (id: string) => void
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
  getContainerRect: (id: string) => DOMRect | null
}

export const TUIContext = createContext<TUIContextValue | null>(null)
