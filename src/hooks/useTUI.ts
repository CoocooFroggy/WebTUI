import { useContext } from 'react'
import { TUIContext, TUIContextValue } from '../context/TUIContext'

export function useTUI(): TUIContextValue {
  const ctx = useContext(TUIContext)
  if (!ctx) throw new Error('useTUI must be used inside <TUIRoot>')
  return ctx
}
