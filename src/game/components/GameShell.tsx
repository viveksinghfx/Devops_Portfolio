import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Node, Edge } from '@xyflow/react'

import { LEVELS } from '../levels'
import { useSave } from '../useSave'
import { evaluateBoard } from '../scoring'
import type { EvalResult, LevelDef, NodeKind } from '../types'
import { NODE_LIBRARY } from '../nodes'

import { GameCanvas } from './GameCanvas'
import { NodePalette } from './NodePalette'
import { HUD } from './HUD'
import { MissionBriefing } from './MissionBriefing'
import { LevelComplete } from './LevelComplete'
import { CampaignMap } from './CampaignMap'
import { AchievementToaster } from './AchievementToaster'
import { pushAchievement } from '../achievementBus'
import { AchievementsWall } from './AchievementsWall'
import type { ArchNodeData } from './ArchNode'
import type { FlowEdgeData } from './FlowEdge'

import { Maximize2, Minimize2, ChevronLeft, Map, Wand2 } from 'lucide-react'

type Mode = 'campaign' | 'sandbox'

export function GameShell() {
  const { save, recordResult } = useSave()
  const [mode, setMode] = useState<Mode>('campaign')
  const [levelIdx, setLevelIdx] = useState(0)
  const [showBrief, setShowBrief] = useState(false)
  const [running, setRunning] = useState(false)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [boardNodes, setBoardNodes] = useState<Node<ArchNodeData>[]>([])
  const [boardEdges, setBoardEdges] = useState<Edge<FlowEdgeData>[]>([])
  const [result, setResult] = useState<EvalResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [hintIdx, setHintIdx] = useState(-1)
  const [showMap, setShowMap] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [evaluateTrigger, setEvaluateTrigger] = useState(0)
  const [briefingShown, setBriefingShown] = useState<Record<string, boolean>>({})

  const level = mode === 'campaign' ? LEVELS[levelIdx] : null
  const isSandbox = mode === 'sandbox'
  const hasNext = mode === 'campaign' && levelIdx < LEVELS.length - 1

  // tick clock for HUD
  useEffect(() => {
    if (!running) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [running])

  const elapsedMs = running && startedAt ? now - startedAt : null

  const placedKinds = useMemo(
    () => new Set<NodeKind>(boardNodes.map((n) => n.data.kind)),
    [boardNodes]
  )
  const budgetUsed = useMemo(
    () => boardNodes.reduce((s, n) => s + (NODE_LIBRARY[n.data.kind]?.cost ?? 0), 0),
    [boardNodes]
  )
  const budgetMax = level?.budget ?? 999

  const startLevel = useCallback((idx: number) => {
    setLevelIdx(idx)
    setMode('campaign')
    setHintIdx(-1)
    setResult(null)
    setShowResult(false)
    setShowBrief(true)
    setShowMap(false)
  }, [])

  const startMission = useCallback(() => {
    setShowBrief(false)
    setStartedAt(Date.now())
    setNow(Date.now())
    setRunning(true)
    if (level) setBriefingShown((b) => ({ ...b, [level.id]: true }))
  }, [level])

  const openSandbox = useCallback(() => {
    setMode('sandbox')
    setShowMap(false)
    setShowBrief(false)
    setRunning(false)
    setStartedAt(null)
  }, [])

  const backToMap = useCallback(() => {
    setShowMap(true)
    setRunning(false)
    setStartedAt(null)
    setResult(null)
    setShowResult(false)
    setShowBrief(false)
  }, [])

  const showHint = useCallback(() => {
    if (!level) return
    setHintIdx((h) => Math.min(level.hints.length - 1, h + 1))
  }, [level])

  const hintText = level && hintIdx >= 0 ? level.hints[hintIdx] : null

  const handleEvaluate = useCallback(() => {
    if (!level) return
    const elapsed = startedAt ? Date.now() - startedAt : 0
    const r = evaluateBoard(level, boardNodes, boardEdges, elapsed)
    setResult(r)
    setShowResult(true)
    if (r.passed) {
      setRunning(false)
      recordResult({
        levelId: level.id,
        levelIndex: level.index,
        totalLevels: LEVELS.length,
        score: r.score,
        rank: r.rank,
        elapsedMs: elapsed,
        xpEarned: r.xp,
        achievement: level.reward,
      })
      // achievement toast (deferred so modal animation has air)
      setTimeout(() => {
        pushAchievement(level.reward, level.rewardSubtitle)
      }, 700)
    }
  }, [level, boardNodes, boardEdges, startedAt, recordResult])

  const retry = useCallback(() => {
    setShowResult(false)
    setResult(null)
    setStartedAt(Date.now())
    setNow(Date.now())
    setHintIdx(-1)
    setRunning(true)
    // force canvas remount to clear board
    setEvaluateTrigger((t) => t + 1)
  }, [])

  const nextMission = useCallback(() => {
    setShowResult(false)
    setResult(null)
    if (hasNext) {
      startLevel(levelIdx + 1)
    }
  }, [hasNext, levelIdx, startLevel])

  const handleBoardChange = useCallback((nodes: Node<ArchNodeData>[], edges: Edge<FlowEdgeData>[]) => {
    setBoardNodes(nodes)
    setBoardEdges(edges)
  }, [])

  // ── render ──────────────────────────────────────────────
  return (
    <div className={fullscreen ? 'fixed inset-0 z-[450] bg-bg overflow-y-auto' : ''}>
      <div className={fullscreen ? 'h-full flex flex-col' : ''}>
        {/* HUD */}
        <div className={fullscreen ? 'p-4 border-b border-line' : 'mb-4'}>
          <HUD
            save={save}
            totalLevels={LEVELS.length}
            currentLevelIndex={level?.index ?? 0}
            elapsedMs={elapsedMs}
          />
        </div>

        {/* Map view */}
        {showMap ? (
          <div className={fullscreen ? 'flex-1 overflow-y-auto p-4' : ''}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="mono-label text-accent">CAMPAIGN MAP</div>
                <div className="text-text text-lg font-light mt-0.5">Pick a mission</div>
              </div>
              <button onClick={() => setFullscreen((f) => !f)} className="btn py-2 px-3">
                {fullscreen ? <><Minimize2 size={11} /> Exit</> : <><Maximize2 size={11} /> Fullscreen</>}
              </button>
            </div>
            <CampaignMap
              levels={LEVELS}
              save={save}
              currentIdx={levelIdx}
              onPick={startLevel}
              onSandbox={openSandbox}
            />
            {save.achievements.length > 0 && (
              <div className="mt-8">
                <AchievementsWall levels={LEVELS} save={save} />
              </div>
            )}
          </div>
        ) : (
          // ── Game board ────────────────────────────────────
          <div className={fullscreen ? 'flex-1 grid grid-cols-12 gap-px bg-line min-h-0' : 'grid grid-cols-12 gap-px bg-line border border-line min-h-[640px]'}>
            {/* left: palette */}
            <div className="col-span-12 lg:col-span-3 min-h-0 max-h-[640px] lg:max-h-none">
              <NodePalette
                level={level}
                placedKinds={placedKinds}
                budgetUsed={budgetUsed}
                budgetMax={budgetMax}
                isSandbox={isSandbox}
              />
            </div>

            {/* middle: canvas with brief bar */}
            <div className="col-span-12 lg:col-span-9 flex flex-col bg-bg min-h-0">
              {/* mission bar */}
              <div className="border-b border-line p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <button onClick={backToMap} className="btn py-1.5 px-2.5" title="Back to map">
                    <ChevronLeft size={11} /> Map
                  </button>
                  <div className="min-w-0">
                    {isSandbox ? (
                      <>
                        <div className="mono text-[10px] tracking-[0.18em] text-accent">FREE PLAY</div>
                        <div className="text-text text-sm font-light truncate">Sandbox · build whatever</div>
                      </>
                    ) : level ? (
                      <>
                        <div className="mono text-[10px] tracking-[0.18em]" style={{ color: badgeTint(level) }}>
                          {level.codename}
                        </div>
                        <div className="text-text text-sm font-light truncate">
                          L{level.index.toString().padStart(2, '0')} · {level.title}
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!isSandbox && level && (
                    <>
                      <Pill label={`${level.requiredEdges.length}`} sub="wires" />
                      <Pill label={`${level.required.length - level.required.filter((k) => !placedKinds.has(k)).length}/${level.required.length}`} sub="parts" />
                      {level && briefingShown[level.id] && (
                        <button onClick={() => setShowBrief(true)} className="btn py-1.5 px-2.5" title="Mission briefing">
                          <Map size={11} />
                        </button>
                      )}
                    </>
                  )}
                  <button onClick={() => setFullscreen((f) => !f)} className="btn py-1.5 px-2.5" title="Fullscreen">
                    {fullscreen ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
                  </button>
                </div>
              </div>

              {/* canvas */}
              <div className="relative flex-1 min-h-[560px]" style={fullscreen ? undefined : { height: 'min(72vh, 620px)' }}>
                <GameCanvas
                  key={`${mode}-${level?.id ?? 'sand'}-${evaluateTrigger}`}
                  level={level}
                  isSandbox={isSandbox}
                  onEvaluate={handleEvaluate}
                  evaluateTrigger={evaluateTrigger}
                  onBoardChange={handleBoardChange}
                  showHint={showHint}
                  hintText={hintText}
                />
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen exit FAB for sandbox header */}
        <AnimatePresence>
          {!showMap && mode === 'sandbox' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none"
            >
              <div className="sr-only">
                <Wand2 />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mission briefing overlay */}
      <MissionBriefing
        level={level}
        open={showBrief}
        onStart={startMission}
        onClose={() => { setShowBrief(false); if (!running) setShowMap(true) }}
      />

      {/* Level complete overlay */}
      <LevelComplete
        level={level}
        result={result}
        open={showResult}
        onClose={() => setShowResult(false)}
        onRetry={retry}
        onNext={nextMission}
        hasNext={hasNext}
      />

      {/* Toaster */}
      <AchievementToaster />
    </div>
  )
}

function Pill({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="px-2 py-1 border border-line rounded-sm bg-elevated mono text-[10px] flex items-baseline gap-1">
      <span className="text-text">{label}</span>
      <span className="text-faint">{sub}</span>
    </div>
  )
}

function badgeTint(level: LevelDef): string {
  switch (level.badgeColor) {
    case 'amber':   return 'rgb(255 180 60)'
    case 'cyan':    return 'rgb(110 200 255)'
    case 'violet':  return 'rgb(180 110 255)'
    case 'rose':    return 'rgb(255 110 200)'
    case 'emerald': return 'rgb(86 246 162)'
    case 'sky':     return 'rgb(110 178 255)'
    case 'gold':    return 'rgb(255 215 90)'
  }
}
