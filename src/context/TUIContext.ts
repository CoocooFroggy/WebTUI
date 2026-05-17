import { createContext, RefObject } from 'react'
import { TUITheme, TUIFlavor } from './themes'

export interface TUIContextValue {
  flavor: TUIFlavor
  setFlavor: (flavor: TUIFlavor) => void
  theme: TUITheme
  rootRef: RefObject<HTMLDivElement | null>
  fontSize: number
  lineHeight: number
  registerContainer: (id: string, ref: RefObject<HTMLElement | null>) => void
  unregisterContainer: (id: string) => void
  getContainerRect: (id: string) => DOMRect | null
}

export const TUIContext = createContext<TUIContextValue | null>(null)
