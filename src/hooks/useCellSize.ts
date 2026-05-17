import { useEffect, useState, RefObject } from 'react'

/**
 * Pixel dimensions of a single monospace character cell in the TUI root.
 * Measured at runtime by inserting a probe element — values reflect the
 * actual rendered font and font-size, not CSS estimates.
 */
export interface CellSize {
  /** Cell width in pixels (approximately `1ch`). */
  w: number
  /** Cell height in pixels (approximately `fontSize × lineHeight`). */
  h: number
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
export function useCellSize(rootRef: RefObject<HTMLElement | null>): CellSize {
  const [size, setSize] = useState<CellSize>({ w: 8, h: 16.8 })

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const probe = document.createElement('span')
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;pointer-events:none;'
    probe.textContent = '0'
    root.appendChild(probe)

    const rect = probe.getBoundingClientRect()
    setSize({ w: rect.width || 8, h: rect.height || 16.8 })
    root.removeChild(probe)
  }, [rootRef])

  return size
}
