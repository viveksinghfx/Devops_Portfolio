import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ReactFlow, ReactFlowProvider, Background, BackgroundVariant, MiniMap, Controls,
  addEdge, applyNodeChanges, applyEdgeChanges, MarkerType,
  type Node, type Edge, type NodeChange, type EdgeChange, type Connection, type ReactFlowInstance,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { ArchNode, type ArchNodeData } from './ArchNode'
import { FlowEdge, type FlowEdgeData } from './FlowEdge'
import type { LevelDef, NodeKind } from '../types'
import { NODE_LIBRARY } from '../nodes'
import { Play, Trash2, Eye, EyeOff, Lightbulb, Pause, RotateCcw, Wand2 } from 'lucide-react'

const nodeTypes = { arch: ArchNode }
const edgeTypes = { flow: FlowEdge }

interface Props {
  level: LevelDef | null
  isSandbox: boolean
  onEvaluate: () => void
  evaluateTrigger: number
  onBoardChange: (nodes: Node<ArchNodeData>[], edges: Edge<FlowEdgeData>[]) => void
  initialNodes?: Node<ArchNodeData>[]
  initialEdges?: Edge<FlowEdgeData>[]
  showHint: () => void
  hintText: string | null
}

function GameCanvasInner({
  level, isSandbox, onEvaluate, onBoardChange, showHint, hintText,
}: Props) {
  const rfRef = useRef<HTMLDivElement>(null)
  const [rf, setRf] = useState<ReactFlowInstance | null>(null)
  const [nodes, setNodes] = useState<Node<ArchNodeData>[]>([])
  const [edges, setEdges] = useState<Edge<FlowEdgeData>[]>([])
  const [simulating, setSimulating] = useState(true)
  const [showMinimap, setShowMinimap] = useState(true)

  // Note: parent remounts via `key` when level changes, so local reset effect is unnecessary.

  useEffect(() => {
    onBoardChange(nodes, edges)
  }, [nodes, edges, onBoardChange])

  // Decorate nodes with required/bonus/satisfied flags
  const decoratedNodes = useMemo(() => {
    if (!level) {
      // sandbox: just show node base
      return nodes
    }
    const placedKinds = new Set<NodeKind>(nodes.map((n) => (n.data as ArchNodeData).kind))
    const kindIds = new Map<NodeKind, string[]>()
    nodes.forEach((n) => {
      const arr = kindIds.get((n.data as ArchNodeData).kind) ?? []
      arr.push(n.id)
      kindIds.set((n.data as ArchNodeData).kind, arr)
    })
    return nodes.map((n) => {
      const d = n.data as ArchNodeData
      const required = level.required.includes(d.kind)
      const bonus = level.bonus?.includes(d.kind) ?? false
      const forbidden = level.forbidden?.includes(d.kind) ?? false
      // satisfied = all required edges involving this kind exist
      const kind = d.kind
      const involved = level.requiredEdges.filter((re) => re.from === kind || re.to === kind)
      const satisfied = required && involved.length > 0 && involved.every((re) => {
        const aIds = kindIds.get(re.from) ?? []
        const bIds = kindIds.get(re.to) ?? []
        if (!aIds.length || !bIds.length) return false
        return edges.some((e) =>
          (aIds.includes(e.source) && bIds.includes(e.target)) ||
          (bIds.includes(e.source) && aIds.includes(e.target))
        )
      }) && placedKinds.has(kind)
      return { ...n, data: { ...d, required, bonus, forbidden, satisfied } }
    })
  }, [nodes, edges, level])

  // Decorate edges with valid/active
  const decoratedEdges = useMemo(() => {
    return edges.map((e) => {
      const d = (e.data ?? {}) as FlowEdgeData
      let valid: boolean | undefined
      if (level) {
        const src = nodes.find((n) => n.id === e.source)
        const tgt = nodes.find((n) => n.id === e.target)
        if (src && tgt) {
          const sk = (src.data as ArchNodeData).kind
          const tk = (tgt.data as ArchNodeData).kind
          valid = level.requiredEdges.some((re) =>
            (re.from === sk && re.to === tk) || (re.from === tk && re.to === sk)
          )
        }
      }
      return { ...e, data: { ...d, valid, active: simulating } }
    })
  }, [edges, nodes, level, simulating])

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds) as Node<ArchNodeData>[])
  }, [])
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds) as Edge<FlowEdgeData>[])
  }, [])
  const onConnect = useCallback((c: Connection) => {
    setEdges((eds) => addEdge({
      ...c,
      type: 'flow',
      animated: false,
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgb(86 246 162)' },
    }, eds) as Edge<FlowEdgeData>[])
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const kind = e.dataTransfer.getData('application/arch-node') as NodeKind
    if (!kind || !rf || !rfRef.current) return

    // budget check
    if (!isSandbox && level) {
      const used = nodes.reduce((s, n) => s + (NODE_LIBRARY[(n.data as ArchNodeData).kind]?.cost ?? 0), 0)
      const cost = NODE_LIBRARY[kind]?.cost ?? 0
      if (used + cost > level.budget) return
    }

    const pos = rf.screenToFlowPosition({ x: e.clientX, y: e.clientY })
    const id = `${kind}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
    setNodes((prev) => [...prev, {
      id,
      type: 'arch',
      position: pos,
      data: { kind } as ArchNodeData,
    }])
  }, [rf, level, isSandbox, nodes])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const clear = () => { setNodes([]); setEdges([]) }

  // Auto-layout sandbox demo
  const seedDemo = useCallback(() => {
    if (!rf) return
    const demo: { kind: NodeKind; x: number; y: number }[] = [
      { kind: 'user', x: 60, y: 200 },
      { kind: 'cdn', x: 220, y: 200 },
      { kind: 'lb', x: 380, y: 200 },
      { kind: 'k8s', x: 540, y: 200 },
      { kind: 'svc', x: 700, y: 140 },
      { kind: 'db', x: 860, y: 140 },
      { kind: 'cache', x: 860, y: 260 },
      { kind: 'github', x: 220, y: 380 },
      { kind: 'registry', x: 380, y: 380 },
      { kind: 'argo', x: 540, y: 380 },
      { kind: 'monitor', x: 700, y: 380 },
      { kind: 'tracing', x: 860, y: 380 },
    ]
    const ids = demo.map((d) => `${d.kind}_seed_${Math.random().toString(36).slice(2, 6)}`)
    setNodes(demo.map((d, i) => ({
      id: ids[i],
      type: 'arch',
      position: { x: d.x, y: d.y },
      data: { kind: d.kind } as ArchNodeData,
    })))
    const link = (a: number, b: number): Edge<FlowEdgeData> => ({
      id: `${ids[a]}->${ids[b]}`,
      source: ids[a],
      target: ids[b],
      type: 'flow',
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgb(86 246 162)' },
    })
    setEdges([
      link(0, 1), link(1, 2), link(2, 3), link(3, 4), link(4, 5), link(4, 6),
      link(7, 8), link(8, 9), link(9, 3), link(3, 10), link(10, 11),
    ])
  }, [rf])

  return (
    <div className="relative h-full bg-bg" ref={rfRef} onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={decoratedNodes}
        edges={decoratedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRf}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'flow' }}
        fitView
        minZoom={0.4}
        maxZoom={1.4}
        proOptions={{ hideAttribution: true }}
        connectionLineStyle={{ stroke: 'rgb(255 107 0)', strokeWidth: 1.5, strokeDasharray: '4 4' }}
        snapToGrid
        snapGrid={[14, 14]}
        colorMode="dark"
        style={{ background: 'transparent' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(255,255,255,0.08)" />
        <Controls position="bottom-right" showInteractive={false} className="!bg-elevated !border !border-line" style={{ borderRadius: 2 }} />
        {showMinimap && (
          <MiniMap
            position="bottom-left"
            pannable
            zoomable
            maskColor="rgba(10,10,12,0.85)"
            style={{ background: 'rgba(16,16,20,0.9)', border: '1px solid rgb(38 38 46)', borderRadius: 2 }}
            nodeColor={(n) => {
              const k = (n.data as ArchNodeData)?.kind
              const cat = k ? NODE_LIBRARY[k]?.category : undefined
              switch (cat) {
                case 'edge': return 'rgb(110 178 255)'
                case 'compute': return 'rgb(255 142 60)'
                case 'data': return 'rgb(180 110 255)'
                case 'platform': return 'rgb(86 246 162)'
                case 'observability': return 'rgb(255 200 0)'
                case 'security': return 'rgb(255 86 86)'
                case 'ml': return 'rgb(255 110 200)'
                case 'global': return 'rgb(120 220 220)'
                default: return 'rgb(140 140 150)'
              }
            }}
          />
        )}
      </ReactFlow>

      {/* empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6">
          <div className="w-12 h-12 rounded-full border border-line/60 flex items-center justify-center mb-3 anim-pulse">
            <Wand2 size={18} className="text-faint" />
          </div>
          <div className="mono text-[10.5px] tracking-[0.16em] uppercase text-faint mb-2">DRAG TO START</div>
          <p className="text-muted text-[13px] max-w-xs leading-relaxed">
            Drag a component from the palette onto the board. Drag from a handle to wire two nodes together.
          </p>
        </div>
      )}

      {/* hint overlay */}
      {hintText && (
        <div className="absolute top-3 left-3 max-w-md glass border border-accent/30 rounded-sm p-3 flex items-start gap-2 z-10">
          <Lightbulb size={12} className="text-accent shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-text leading-snug">{hintText}</p>
        </div>
      )}

      {/* toolbar */}
      <div className="absolute top-3 right-3 z-10 flex gap-1.5">
        {isSandbox && (
          <ToolBtn label="Demo" onClick={seedDemo}><Wand2 size={11} /></ToolBtn>
        )}
        <ToolBtn label={simulating ? 'Pause flow' : 'Resume flow'} onClick={() => setSimulating((s) => !s)}>
          {simulating ? <Pause size={11} /> : <Play size={11} />}
        </ToolBtn>
        <ToolBtn label={showMinimap ? 'Hide map' : 'Show map'} onClick={() => setShowMinimap((s) => !s)}>
          {showMinimap ? <EyeOff size={11} /> : <Eye size={11} />}
        </ToolBtn>
        <ToolBtn label="Hint" onClick={showHint}><Lightbulb size={11} /></ToolBtn>
        <ToolBtn label="Reset" onClick={clear}><RotateCcw size={11} /></ToolBtn>
        <ToolBtn label="Clear" onClick={() => setEdges([])}><Trash2 size={11} /></ToolBtn>
        {!isSandbox && (
          <button
            onClick={onEvaluate}
            className="px-3 py-1.5 rounded-sm bg-accent text-bg mono text-[10px] tracking-[0.16em] uppercase font-medium hover:bg-accent/90 transition flex items-center gap-1.5"
          >
            <Play size={11} /> Validate
          </button>
        )}
      </div>
    </div>
  )
}

function ToolBtn({ label, children, onClick }: { label: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="w-7 h-7 flex items-center justify-center rounded-sm border border-line bg-elevated/90 backdrop-blur hover:border-line-strong hover:bg-elevated text-muted hover:text-text transition"
    >
      {children}
    </button>
  )
}

export function GameCanvas(props: Props) {
  return (
    <ReactFlowProvider>
      <GameCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
