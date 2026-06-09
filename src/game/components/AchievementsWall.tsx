import { Trophy, Briefcase, Sparkles } from 'lucide-react'
import type { LevelDef, SaveData } from '../types'

interface Props {
  levels: LevelDef[]
  save: SaveData
}

export function AchievementsWall({ levels, save }: Props) {
  const unlocked = levels.filter((L) => save.achievements.includes(L.reward))

  if (unlocked.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
      <div className="md:col-span-1 bg-elevated p-6">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={14} className="text-accent" />
          <span className="mono-label text-faint">ACHIEVEMENTS</span>
        </div>
        <div className="text-4xl font-light text-text">{unlocked.length}<span className="text-faint text-lg"> / {levels.length}</span></div>
        <p className="text-muted text-[12.5px] leading-relaxed mt-2">
          Each badge here corresponds to a real piece of infrastructure I\'ve shipped.
        </p>
      </div>
      <div className="md:col-span-2 bg-elevated p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {unlocked.map((L) => (
            <div key={L.id} className="border border-line rounded-sm p-3 bg-bg/40">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-accent/10 border border-accent/40 flex items-center justify-center shrink-0">
                  <Sparkles size={14} className="text-accent" />
                </div>
                <div className="min-w-0">
                  <div className="text-text text-sm font-medium truncate">{L.reward}</div>
                  <div className="text-faint text-[10.5px] mono uppercase tracking-[0.14em] mt-0.5">L{L.index} · {L.topic}</div>
                  <div className="mt-2 text-muted text-[11.5px] flex items-start gap-1.5">
                    <Briefcase size={10} className="text-accent shrink-0 mt-0.5" />
                    <span className="leading-snug">{L.portfolio.title}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
