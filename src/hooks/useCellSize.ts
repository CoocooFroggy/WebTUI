import { useEffect, useState, RefObject } from 'react'

export interface CellSize {
  w: number
  h: number
}

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
