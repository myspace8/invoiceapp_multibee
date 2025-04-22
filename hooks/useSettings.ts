import { usePersistedState } from "./usePersistedState"
import { Settings } from "@/types/invoice"

export function useSettings(initialSettings: Settings) {
  const [settings, setSettings] = usePersistedState<Settings>("settings", initialSettings)

  return {
    settings,
    updateSettings: setSettings,
  }
}