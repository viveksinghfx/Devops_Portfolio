// Premium Architecture Builder — core types.

export type NodeKind =
  | 'user' | 'cdn' | 'lb' | 'apigw' | 'waf'
  | 'k8s' | 'svc' | 'autoscaler' | 'sidecar'
  | 'db' | 'cache' | 'queue' | 'storage' | 'dwh'
  | 'github' | 'argo' | 'registry' | 'ciCd' | 'helm'
  | 'monitor' | 'logs' | 'tracing' | 'alerts'
  | 'vault' | 'iam' | 'kms'
  | 'llm' | 'vector' | 'gpu' | 'mlflow' | 'kubeflow' | 'featureStore' | 'modelRegistry'
  | 'region2' | 'route53' | 'multiRegionDb' | 'globalAccel'
  | 'eventBus' | 'chaosEngine' | 'sre' | 'edgeCompute'

export type Category =
  | 'edge' | 'compute' | 'data' | 'platform' | 'observability' | 'security' | 'ml' | 'global'

export interface NodeSpec {
  kind: NodeKind
  label: string
  shortLabel: string
  category: Category
  cost: number
  desc: string
  /** lore / tooltip flavor */
  flavor?: string
}

export interface EdgeReq {
  from: NodeKind
  to: NodeKind
  why: string
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'boss'

export interface PortfolioCallout {
  title: string
  body: string
  metrics?: { label: string; value: string }[]
}

export interface LevelDef {
  id: string
  index: number
  title: string
  codename: string             // mission codename, e.g. "OPERATION FIRSTLIGHT"
  brief: string
  longBrief: string            // mission-briefing screen
  reward: string               // achievement title earned
  rewardSubtitle: string
  badgeColor: 'amber' | 'cyan' | 'violet' | 'rose' | 'emerald' | 'sky' | 'gold'
  difficulty: Difficulty
  budget: number
  required: NodeKind[]
  bonus?: NodeKind[]
  forbidden?: NodeKind[]
  requiredEdges: EdgeReq[]
  hints: string[]
  /** target time for full bonus (seconds) */
  parTime: number
  /** prefilled starter board (optional) */
  starter?: { kind: NodeKind; x: number; y: number }[]
  /** topic taught */
  topic: string
  /** portfolio integration shown after passing */
  portfolio: PortfolioCallout
}

export interface SaveData {
  unlockedLevel: number
  bestScores: Record<string, number>
  bestRanks: Record<string, Rank>
  bestTimes: Record<string, number>
  achievements: string[]
  xp: number
  totalPlayMs: number
  completedAt: Record<string, number>
}

export type Rank = 'S' | 'A' | 'B' | 'C' | 'D'

export interface EvalResult {
  passed: boolean
  score: number
  rank: Rank
  matched: number
  totalRequired: number
  missingEdges: { from: NodeKind; to: NodeKind; why: string }[]
  missingNodes: NodeKind[]
  bonusHit: NodeKind[]
  forbiddenHit: NodeKind[]
  budgetUsed: number
  elapsedMs: number
  xp: number
  breakdown: { label: string; value: number }[]
}
