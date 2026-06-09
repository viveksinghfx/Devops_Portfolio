import type { Edge, Node } from '@xyflow/react'
import type { EdgeReq, EvalResult, LevelDef, NodeKind, Rank } from './types'
import { NODE_LIBRARY } from './nodes'

export interface BoardNodeData extends Record<string, unknown> { kind: NodeKind }

export function evaluateBoard(
  level: LevelDef,
  nodes: Node<BoardNodeData>[],
  edges: Edge[],
  elapsedMs: number
): EvalResult {
  const placedKinds = new Set<NodeKind>(nodes.map((n) => n.data.kind))
  const kindToIds = new Map<NodeKind, string[]>()
  nodes.forEach((n) => {
    const arr = kindToIds.get(n.data.kind) ?? []
    arr.push(n.id)
    kindToIds.set(n.data.kind, arr)
  })

  // Helper: does an edge exist between two kinds (either direction)?
  const hasEdgeBetween = (a: NodeKind, b: NodeKind) => {
    const aIds = kindToIds.get(a) ?? []
    const bIds = kindToIds.get(b) ?? []
    if (!aIds.length || !bIds.length) return false
    return edges.some((e) =>
      (aIds.includes(e.source) && bIds.includes(e.target)) ||
      (bIds.includes(e.source) && aIds.includes(e.target))
    )
  }

  let matched = 0
  const missingEdges: EdgeReq[] = []
  for (const re of level.requiredEdges) {
    if (hasEdgeBetween(re.from, re.to)) matched++
    else missingEdges.push(re)
  }

  const missingNodes: NodeKind[] = level.required.filter((k) => !placedKinds.has(k))
  const bonusHit: NodeKind[] = (level.bonus ?? []).filter((k) => placedKinds.has(k))
  const forbiddenHit: NodeKind[] = (level.forbidden ?? []).filter((k) => placedKinds.has(k))

  const budgetUsed = nodes.reduce((s, n) => s + (NODE_LIBRARY[n.data.kind]?.cost ?? 0), 0)

  // ── Scoring (out of 100)
  const requiredPct = level.requiredEdges.length ? matched / level.requiredEdges.length : 1
  const nodesPct    = level.required.length ? (level.required.length - missingNodes.length) / level.required.length : 1

  const wireScore = Math.round(requiredPct * 55)               // 55%
  const nodeScore = Math.round(nodesPct * 20)                  // 20%
  const bonusScore = Math.min(15, bonusHit.length * 4)         // up to 15
  const penalty = forbiddenHit.length * 8

  // efficiency: under budget gives up to 5
  const efficiency = Math.max(0, level.budget - budgetUsed)
  const efficiencyScore = Math.min(5, Math.round(efficiency / 2))

  // time bonus: under par gives up to 5
  const elapsedSec = elapsedMs / 1000
  const timeRatio = level.parTime > 0 ? Math.max(0, (level.parTime - elapsedSec) / level.parTime) : 0
  const timeScore = Math.round(Math.min(1, timeRatio) * 5)

  const score = Math.max(0, wireScore + nodeScore + bonusScore + efficiencyScore + timeScore - penalty)
  const passed = matched === level.requiredEdges.length && missingNodes.length === 0 && forbiddenHit.length === 0

  let rank: Rank
  if (!passed)           rank = 'D'
  else if (score >= 95)  rank = 'S'
  else if (score >= 85)  rank = 'A'
  else if (score >= 75)  rank = 'B'
  else                   rank = 'C'

  const xp = passed
    ? Math.round(score * (level.difficulty === 'boss' ? 5 : level.difficulty === 'hard' ? 3 : level.difficulty === 'medium' ? 2 : 1.5))
    : Math.round(score * 0.4)

  return {
    passed,
    score,
    rank,
    matched,
    totalRequired: level.requiredEdges.length,
    missingEdges,
    missingNodes,
    bonusHit,
    forbiddenHit,
    budgetUsed,
    elapsedMs,
    xp,
    breakdown: [
      { label: 'Wires',         value: wireScore },
      { label: 'Components',    value: nodeScore },
      { label: 'Bonus',         value: bonusScore },
      { label: 'Efficiency',    value: efficiencyScore },
      { label: 'Speed',         value: timeScore },
      { label: 'Penalty',       value: -penalty },
    ],
  }
}

export function rankColor(rank: Rank): string {
  switch (rank) {
    case 'S': return 'text-yellow-300'
    case 'A': return 'text-signal'
    case 'B': return 'text-info'
    case 'C': return 'text-accent'
    default:  return 'text-muted'
  }
}
