import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'
import { GameShell } from '../game/components/GameShell'

export default function ArchitectGameSection() {
  return (
    <section id="architect" className="relative section border-t border-line overflow-hidden">
      {/* ambient glow */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-0 left-1/4 w-[480px] h-[480px] rounded-full blur-[140px] opacity-20"
             style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.45), transparent 60%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[520px] h-[520px] rounded-full blur-[160px] opacity-15"
             style={{ background: 'radial-gradient(circle, rgba(110,178,255,0.5), transparent 60%)' }} />
      </div>

      <div className="container-x relative">
        <Reveal>
          <SectionHeader
            index="05"
            kicker="ARCHITECTURE BUILDER · CAMPAIGN"
            title={
              <>Build the systems<br />
                <span className="serif italic text-accent">I build</span> — ten missions deep.
              </>
            }
            subtitle={
              <>
                A ten-level campaign across DevOps, Kubernetes, GitOps, CI/CD, Observability,
                MLOps, AI Infrastructure, and global multi-region. Drag components, draw wires,
                watch the data flow. Earn ranks. Unlock real engineering stories from my career.
              </>
            }
          />
        </Reveal>

        <Reveal>
          <div className="mt-12">
            <GameShell />
          </div>
        </Reveal>
      </div>

      {/* React Flow CSS overrides — keep within section for portability */}
      <style>{`
        .react-flow__attribution { display: none !important; }
        .react-flow__controls-button {
          background: rgb(16 16 20) !important;
          border-bottom: 1px solid rgb(38 38 46) !important;
          color: rgb(180 180 195) !important;
          fill: rgb(180 180 195) !important;
          width: 26px !important;
          height: 26px !important;
        }
        .react-flow__controls-button:hover {
          background: rgb(22 22 28) !important;
          color: rgb(240 240 245) !important;
          fill: rgb(240 240 245) !important;
        }
        .react-flow__handle {
          transition: transform 140ms ease;
        }
        .react-flow__handle:hover {
          transform: scale(1.5);
        }
        .react-flow__edge.selected .react-flow__edge-path {
          stroke-width: 2.4 !important;
        }
        .react-flow__minimap {
          border-radius: 2px !important;
        }
        @keyframes arch-dash {
          to { stroke-dashoffset: -24; }
        }
      `}</style>
    </section>
  )
}
