import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { NODE_ICONS, NODE_LIBRARY, CATEGORIES } from '../nodes'
import type { NodeKind, LevelDef, Category } from '../types'
import { Search, Check, Lock as LockIcon } from 'lucide-react'

interface Props {
  level: LevelDef | null            // null in sandbox
  placedKinds: Set<NodeKind>
  budgetUsed: number
  budgetMax: number
  isSandbox: boolean
}

export function NodePalette({ level, placedKinds, budgetUsed, budgetMax, isSandbox }: Props) {
  const [query, setQuery] = useState('')
  const [openCat, setOpenCat] = useState<Category | 'all'>('all')

  const grouped = useMemo(() => {
    const g: Record<Category, NodeKind[]> = {
      edge: [], compute: [], data: [], platform: [], observability: [], security: [], ml: [], global: [],
    }
    Object.values(NODE_LIBRARY).forEach((spec) => g[spec.category].push(spec.kind))
    return g
  }, [])

  const q = query.trim().toLowerCase()

  const onDragStart = (e: React.DragEvent, kind: NodeKind) => {
    e.dataTransfer.setData('application/arch-node', kind)
    e.dataTransfer.effectAllowed = 'move'
  }

  const left = budgetMax - budgetUsed
  const budgetPct = Math.min(100, (budgetUsed / Math.max(1, budgetMax)) * 100)

  return (
    <aside className="bg-elevated flex flex-col h-full min-h-0">
      {/* header */}
      <div className="p-4 border-b border-line">
        <div className="flex items-center justify-between mb-3">
          <span className="mono-label text-faint">PALETTE</span>
          {!isSandbox && (
            <span className="mono text-[10.5px]">
              <span className={left < 0 ? 'text-danger' : 'text-text'}>{budgetUsed}</span>
              <span className="text-faint"> / {budgetMax}</span>
            </span>
          )}
        </div>
        {!isSandbox && (
          <div className="h-1 bg-bg rounded overflow-hidden">
            <motion.div
              className="h-full"
              initial={{ width: 0 }}
              animate={{ width: `${budgetPct}%` }}
              transition={{ type: 'spring', stiffness: 180, damping: 24 }}
              style={{
                background: budgetPct > 100 ? 'rgb(255 86 86)' : budgetPct > 80 ? 'rgb(255 200 0)' : 'rgb(86 246 162)',
              }}
            />
          </div>
        )}

        {/* search */}
        <div className="mt-3 flex items-center gap-2 px-2 py-1.5 border border-line rounded-sm bg-bg">
          <Search size={11} className="text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search nodes"
            className="bg-transparent text-[11.5px] text-text placeholder-faint flex-1 outline-none"
          />
        </div>

        {/* category tabs */}
        <div className="mt-3 flex gap-1 flex-wrap">
          <CatTab id="all" active={openCat === 'all'} onClick={() => setOpenCat('all')} label="ALL" tint="rgb(180 180 200)" />
          {CATEGORIES.map((c) => (
            <CatTab
              key={c.id}
              id={c.id}
              active={openCat === c.id}
              onClick={() => setOpenCat(c.id)}
              label={c.id.toUpperCase().slice(0, 4)}
              tint={c.tint}
            />
          ))}
        </div>
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {CATEGORIES.filter((c) => openCat === 'all' || openCat === c.id).map((cat) => {
          const kinds = grouped[cat.id].filter((k) => {
            if (!q) return true
            const s = NODE_LIBRARY[k]
            return s.label.toLowerCase().includes(q) || s.shortLabel.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
          })
          if (!kinds.length) return null
          return (
            <div key={cat.id}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: cat.tint }} />
                <span className="mono text-[10px] tracking-[0.14em] uppercase text-faint">{cat.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {kinds.map((k) => {
                  const spec = NODE_LIBRARY[k]
                  const Icon = NODE_ICONS[k]
                  const required = level?.required.includes(k)
                  const bonus = level?.bonus?.includes(k)
                  const placed = placedKinds.has(k)
                  const overBudget = !isSandbox && spec.cost > left && !placed
                  return (
                    <button
                      key={k}
                      draggable={!overBudget}
                      onDragStart={(e) => onDragStart(e, k)}
                      title={`${spec.label} — ${spec.desc}${required ? ' · REQUIRED' : bonus ? ' · BONUS' : ''}`}
                      className={`relative text-left p-2 border rounded-sm transition group cursor-grab active:cursor-grabbing ${
                        overBudget
                          ? 'border-danger/30 bg-danger/5 opacity-60 cursor-not-allowed'
                          : required
                            ? 'border-accent/40 bg-bg hover:bg-accent/10 hover:border-accent'
                            : bonus
                              ? 'border-info/30 bg-bg hover:bg-info/10 hover:border-info'
                              : 'border-line bg-bg hover:border-line-strong'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon size={12} />
                        <span className="text-[11px] text-text whitespace-nowrap truncate flex-1">{spec.shortLabel}</span>
                        {placed && <Check size={10} className="text-signal" />}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="mono text-[9px] text-faint">¢{spec.cost}</span>
                        {required && <span className="mono text-[8.5px] text-accent">REQ</span>}
                        {bonus && !required && <span className="mono text-[8.5px] text-info">BNS</span>}
                        {overBudget && <LockIcon size={9} className="text-danger" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-3 border-t border-line text-[10.5px] text-muted leading-snug">
        <span className="mono text-faint">DRAG </span>nodes onto the canvas. Drag from a node\'s handle to wire it.
      </div>
    </aside>
  )
}

function CatTab({ active, onClick, label, tint }: { id: string; active: boolean; onClick: () => void; label: string; tint: string }) {
  return (
    <button
      onClick={onClick}
      className={`mono text-[9px] tracking-[0.12em] px-1.5 py-0.5 rounded-sm border transition ${
        active ? 'border-text/40 bg-bg text-text' : 'border-line text-faint hover:text-muted'
      }`}
      style={active ? { boxShadow: `inset 0 -2px 0 ${tint}` } : undefined}
    >
      {label}
    </button>
  )
}
