import { motion } from 'framer-motion'
import { Trophy, Zap, Star, Clock, Flag } from 'lucide-react'
import { levelFromXp } from '../useSave'
import type { SaveData } from '../types'

interface Props {
  save: SaveData
  totalLevels: number
  currentLevelIndex: number
  elapsedMs: number | null
}

export function HUD({ save, totalLevels, currentLevelIndex, elapsedMs }: Props) {
  const { level, into, need } = levelFromXp(save.xp)
  const pct = need > 0 ? (into / need) * 100 : 0
  const stars = Object.values(save.bestRanks).filter((r) => r === 'S' || r === 'A').length
  const time = elapsedMs == null ? '—' : formatTime(elapsedMs)

  return (
    <div className="bg-elevated border border-line rounded-sm p-3 grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
      <Stat icon={<Zap size={12} />} label={`COMMANDER · LV ${level}`} value={`${save.xp.toLocaleString()} XP`} accent>
        <div className="mt-1.5 h-1 bg-bg rounded overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          />
        </div>
        <div className="mono text-[9px] text-faint mt-0.5">{into}/{need} to LV {level + 1}</div>
      </Stat>

      <Stat icon={<Star size={12} />} label="STARS" value={`${stars}/${totalLevels}`} />
      <Stat icon={<Trophy size={12} />} label="ACHIEVEMENTS" value={`${save.achievements.length}/${totalLevels}`} />
      <Stat icon={<Flag size={12} />} label="MISSION" value={`L${currentLevelIndex.toString().padStart(2, '0')}`} />
      <Stat icon={<Clock size={12} />} label="TIME" value={time} />
    </div>
  )
}

function Stat({
  icon, label, value, accent, children,
}: { icon: React.ReactNode; label: string; value: string; accent?: boolean; children?: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-faint">
        {icon}
        <span className="mono text-[9.5px] tracking-[0.16em] uppercase">{label}</span>
      </div>
      <div className={`mt-0.5 text-[15px] font-light tracking-tight ${accent ? 'text-accent' : 'text-text'}`}>{value}</div>
      {children}
    </div>
  )
}

function formatTime(ms: number) {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60).toString().padStart(2, '0')
  const s = (total % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
