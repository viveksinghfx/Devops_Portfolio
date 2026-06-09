import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'
import { Activity, Boxes, GitBranch, Brain, Shield, Telescope } from 'lucide-react'

const PILLARS = [
  {
    icon: <GitBranch size={18} />,
    title: 'GitOps as truth',
    body: 'Everything that touches prod is a pull request. ArgoCD, Helm, Argo Rollouts — drift detected, drift reconciled.',
  },
  {
    icon: <Boxes size={18} />,
    title: 'Kubernetes is the unit',
    body: 'EKS with infra-as-code Terraform, hardened IAM, multi-env via app-of-apps, blue/green and canary by default.',
  },
  {
    icon: <Brain size={18} />,
    title: 'LLMs are services',
    body: 'vLLM on Kubernetes behind an OpenAI-compatible FastAPI gateway with JWT, rate limits, and per-model routing.',
  },
  {
    icon: <Telescope size={18} />,
    title: 'Observability or it didn\u2019t happen',
    body: 'Prometheus + Grafana + Loki, model-aware dashboards: time-to-first-token, queue depth, drift, error budgets.',
  },
  {
    icon: <Activity size={18} />,
    title: 'Reliability is humane',
    body: 'Pagers for humans, not panic. Runbooks, SLOs, postmortems without blame, automation that earns trust.',
  },
  {
    icon: <Shield size={18} />,
    title: 'Security from minute zero',
    body: 'Least-privilege IAM, network segmentation, secrets via SSM/Vault, signed images, supply-chain awareness.',
  },
]

export default function ManifestoSection() {
  return (
    <section id="manifesto" className="relative section">
      <div className="container-x">
        <Reveal>
          <SectionHeader
            index="01"
            kicker="MANIFESTO"
            title={<>The internet does not <span className="serif italic text-accent">run itself</span>.<br/>Someone has to design it to.</>}
            subtitle={<>Six principles I bring to every platform I touch — whether it&rsquo;s a four-engineer startup
              or a multi-region fleet serving LLMs at midnight.</>}
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.04}>
              <div className="card p-7 lg:p-9 h-full card-hover group relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none" style={{
                  background: 'radial-gradient(circle at 30% 0%, rgba(255,107,0,0.07), transparent 60%)'
                }}/>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex w-10 h-10 items-center justify-center rounded-sm border border-line text-accent">
                      {p.icon}
                    </span>
                    <span className="mono text-[10.5px] tracking-[0.16em] text-faint">/0{i + 1}</span>
                  </div>
                  <h3 className="text-xl text-text font-light tracking-tight mb-2">{p.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{p.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
