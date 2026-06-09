// Cross-component achievement bus. Lives in its own file so the toaster
// component can be hot-reloaded cleanly (react-refresh).

type Listener = (title: string, subtitle?: string) => void

let listener: Listener | null = null

export function setAchievementListener(fn: Listener | null) {
  listener = fn
}

export function pushAchievement(title: string, subtitle?: string) {
  listener?.(title, subtitle)
}
