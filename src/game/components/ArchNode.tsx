import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { NODE_ICONS, NODE_LIBRARY, CATEGORIES } from '../nodes'
import type { NodeKind } from '../types'

export interface ArchNodeData extends Record<string, unknown> {
  kind: NodeKind
  required?: boolean
  bonus?: boolean
  forbidden?: boolean
  satisfied?: boolean   // wires it should have are all present
  pulse?: boolean
}

function ArchNodeBase({ data, selected }: NodeProps) {
  const d = data as ArchNodeData
  const spec = NODE_LIBRARY[d.kind]
  const Icon = NODE_ICONS[d.kind]
  const tint = CATEGORIES.find((c) => c.id === spec.category)?.tint ?? 'rgb(180 180 200)'

  // Status frame color
  const frame = d.forbidden
    ? 'rgb(255 86 86)'
    : d.satisfied
      ? 'rgb(86 246 162)'
      : d.required
        ? 'rgb(255 107 0)'
        : d.bonus
          ? 'rgb(110 178 255)'
          : 'rgb(64 64 74)'

  return (
    <div
      className="group relative"
      style={{
        // glow
        filter: selected
          ? `drop-shadow(0 0 16px ${frame})`
          : d.satisfied
            ? 'drop-shadow(0 0 8px rgba(86,246,162,0.35))'
            : undefined,
      }}
    >
      <Handle type="target" position={Position.Left}  style={handleStyle(tint)} />
      <Handle type="source" position={Position.Right} style={handleStyle(tint)} />
      <Handle type="target" position={Position.Top}    id="t" style={{ ...handleStyle(tint), top: -4 }} />
      <Handle type="source" position={Position.Bottom} id="b" style={{ ...handleStyle(tint), bottom: -4 }} />

      <div
        className="relative px-3 py-2.5 rounded-md backdrop-blur-md transition"
        style={{
          background: 'linear-gradient(140deg, rgba(22,22,28,0.92), rgba(16,16,20,0.92))',
          border: `1px solid ${frame}`,
          boxShadow: selected
            ? `0 0 0 1px ${frame}, 0 12px 32px -12px ${frame}`
            : '0 6px 24px -10px rgba(0,0,0,0.6)',
          minWidth: 134,
        }}
      >
        {/* category accent stripe */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l"
          style={{ background: tint, opacity: 0.85 }}
        />

        {/* satisfied check */}
        {d.satisfied && (
          <div
            className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border border-bg"
            style={{ background: 'rgb(86 246 162)' }}
          />
        )}

        <div className="flex items-center gap-2 pl-1.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            style={{
              background: `linear-gradient(140deg, ${withAlpha(tint, 0.22)}, ${withAlpha(tint, 0.06)})`,
              border: `1px solid ${withAlpha(tint, 0.35)}`,
            }}
          >
            <Icon size={14} className="text-text" />
          </div>
          <div className="leading-tight pr-1">
            <div className="text-[11.5px] text-text whitespace-nowrap font-medium">{spec.shortLabel}</div>
            <div className="mono text-[8.5px] tracking-[0.1em] uppercase" style={{ color: 'rgb(150 150 165)' }}>
              {spec.category} · ¢{spec.cost}
            </div>
          </div>
        </div>

        {/* animated pulse ring on hover */}
        <div
          className="absolute inset-0 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition"
          style={{ boxShadow: `0 0 0 1px ${withAlpha(tint, 0.5)}` }}
        />
      </div>
    </div>
  )
}

function handleStyle(tint: string): React.CSSProperties {
  return {
    width: 8,
    height: 8,
    background: tint,
    border: '1.5px solid rgb(10 10 12)',
    opacity: 0.85,
  }
}

function withAlpha(rgb: string, a: number) {
  // expects "rgb(r g b)"
  const m = rgb.match(/rgb\((\d+)\s+(\d+)\s+(\d+)\)/)
  if (!m) return rgb
  return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${a})`
}

export const ArchNode = memo(ArchNodeBase)
