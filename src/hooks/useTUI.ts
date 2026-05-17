import { useContext } from 'react'
import { TUIContext, TUIContextValue } from '../context/TUIContext'

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
export function useTUI(): TUIContextValue {
  const ctx = useContext(TUIContext)
  if (!ctx) throw new Error('useTUI must be used inside <TUIRoot>')
  return ctx
}
