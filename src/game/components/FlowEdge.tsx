import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react'

export interface FlowEdgeData extends Record<string, unknown> {
  valid?: boolean        // wire is part of the required topology
  active?: boolean       // simulation running
  invalid?: boolean      // illegal wire
}

/** Animated edge with dashed flow + glowing particles when active. */
export function FlowEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, selected } = props
  const d = (data ?? {}) as FlowEdgeData

  const [path] = getBezierPath({
    sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
    curvature: 0.32,
  })

  const color = d.invalid
    ? 'rgb(255 86 86)'
    : d.valid
      ? 'rgb(86 246 162)'
      : 'rgb(255 107 0)'

  const glow = d.active ? color : 'transparent'

  return (
    <>
      {/* underlay glow */}
      <BaseEdge
        id={`${id}-glow`}
        path={path}
        style={{
          stroke: glow,
          strokeWidth: 6,
          opacity: d.active ? 0.18 : 0,
          filter: 'blur(2px)',
          transition: 'opacity 240ms',
        }}
      />
      {/* main edge */}
      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke: color,
          strokeWidth: selected ? 2.2 : 1.6,
          opacity: 0.85,
          strokeDasharray: d.active ? '6 6' : undefined,
          animation: d.active ? 'arch-dash 1.2s linear infinite' : undefined,
        }}
      />
      {/* moving packet */}
      {d.active && (
        <circle r={3} fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
          <animateMotion dur="1.6s" repeatCount="indefinite" path={path} />
        </circle>
      )}
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${(sourceX + targetX) / 2}px, ${(sourceY + targetY) / 2}px)`,
              pointerEvents: 'all',
            }}
            className="mono text-[9px] tracking-[0.14em] uppercase px-1.5 py-0.5 rounded glass text-text/80 nodrag"
          >
            {d.invalid ? 'invalid' : d.valid ? 'valid' : 'wire'}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
