import { useEffect, useState, useCallback } from 'react'
import type { SaveData, Rank } from './types'

const STORAGE_KEY = 'vs_arch_game_v2'

export const DEFAULT_SAVE: SaveData = {
  unlockedLevel: 1,
  bestScores: {},
  bestRanks: {},
  bestTimes: {},
  achievements: [],
  xp: 0,
  totalPlayMs: 0,
  completedAt: {},
}

function loadSave(): SaveData {
  if (typeof window === 'undefined') return DEFAULT_SAVE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SAVE
    return { ...DEFAULT_SAVE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SAVE
  }
}

function persist(save: SaveData) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(save)) } catch { /* */ }
}

export function useSave() {
  const [save, setSave] = useState<SaveData>(() => loadSave())

  useEffect(() => { persist(save) }, [save])

  const recordResult = useCallback((args: {
    levelId: string
    levelIndex: number
    totalLevels: number
    score: number
    rank: Rank
    elapsedMs: number
    xpEarned: number
    achievement: string
  }) => {
    setSave((prev) => {
      const prevScore = prev.bestScores[args.levelId] ?? 0
      const prevTime = prev.bestTimes[args.levelId] ?? Infinity
      const rankOrder: Rank[] = ['D', 'C', 'B', 'A', 'S']
      const prevRank = prev.bestRanks[args.levelId] ?? 'D'
      const bestRank = rankOrder.indexOf(args.rank) > rankOrder.indexOf(prevRank) ? args.rank : prevRank
      const wasNewBest = args.score > prevScore
      return {
        ...prev,
        unlockedLevel: Math.max(prev.unlockedLevel, Math.min(args.levelIndex + 1, args.totalLevels)),
        bestScores: { ...prev.bestScores, [args.levelId]: Math.max(prevScore, args.score) },
        bestRanks: { ...prev.bestRanks, [args.levelId]: bestRank },
        bestTimes: { ...prev.bestTimes, [args.levelId]: Math.min(prevTime, args.elapsedMs) },
        achievements: Array.from(new Set([...prev.achievements, args.achievement])),
        xp: prev.xp + (wasNewBest ? args.xpEarned : Math.floor(args.xpEarned * 0.3)),
        completedAt: { ...prev.completedAt, [args.levelId]: Date.now() },
      }
    })
  }, [])

  const reset = useCallback(() => setSave(DEFAULT_SAVE), [])

  return { save, recordResult, reset }
}

export function xpForLevel(level: number): number {
  // simple curve: lvl 1 → 0xp, lvl 2 → 100xp, lvl 3 → 250xp, etc.
  return Math.floor(50 * level * (level - 1))
}

export function levelFromXp(xp: number): { level: number; into: number; need: number } {
  let lvl = 1
  while (xpForLevel(lvl + 1) <= xp) lvl++
  const base = xpForLevel(lvl)
  const next = xpForLevel(lvl + 1)
  return { level: lvl, into: xp - base, need: next - base }
}
