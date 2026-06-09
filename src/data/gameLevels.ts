// Architecture Builder game level definitions.
// Each level provides a scenario, required components, optional bonus components,
// and validation rules (which connections must exist).

export type NodeKind =
  | 'user' | 'cdn' | 'lb' | 'apigw' | 'k8s' | 'svc' | 'db' | 'cache'
  | 'queue' | 'storage' | 'argo' | 'github' | 'registry'
  | 'monitor' | 'logs' | 'tracing' | 'vault'
  | 'llm' | 'vector' | 'gpu' | 'mlflow' | 'kubeflow'
  | 'waf' | 'iam' | 'autoscaler'

export interface NodeSpec {
  kind: NodeKind
  label: string
  shortLabel: string
  category: 'edge' | 'compute' | 'data' | 'platform' | 'ml' | 'observability' | 'security'
  cost: number               // each component costs "budget"
  desc: string
}

export const NODE_LIBRARY: Record<NodeKind, NodeSpec> = {
  user:       { kind: 'user',       label: 'End User',          shortLabel: 'User',       category: 'edge',          cost: 0, desc: 'Origin of all traffic.' },
  cdn:        { kind: 'cdn',        label: 'CDN / Edge',        shortLabel: 'CDN',        category: 'edge',          cost: 1, desc: 'Cache static assets at the edge.' },
  waf:        { kind: 'waf',        label: 'WAF',               shortLabel: 'WAF',        category: 'security',      cost: 1, desc: 'Filter malicious requests.' },
  lb:         { kind: 'lb',         label: 'Load Balancer',     shortLabel: 'LB',         category: 'edge',          cost: 1, desc: 'Distribute traffic across pods.' },
  apigw:      { kind: 'apigw',      label: 'API Gateway',       shortLabel: 'API GW',     category: 'edge',          cost: 2, desc: 'Auth, rate-limit, route.' },
  k8s:        { kind: 'k8s',        label: 'Kubernetes (EKS)',  shortLabel: 'K8s',        category: 'compute',       cost: 4, desc: 'Container orchestration.' },
  svc:        { kind: 'svc',        label: 'Application Service', shortLabel: 'App',      category: 'compute',       cost: 2, desc: 'Your service pods.' },
  autoscaler: { kind: 'autoscaler', label: 'HPA / Autoscaler',  shortLabel: 'HPA',        category: 'compute',       cost: 1, desc: 'Scale pods on demand.' },
  db:         { kind: 'db',         label: 'PostgreSQL (RDS)',  shortLabel: 'DB',         category: 'data',          cost: 3, desc: 'Primary relational store.' },
  cache:      { kind: 'cache',      label: 'Redis Cache',       shortLabel: 'Cache',      category: 'data',          cost: 2, desc: 'Low-latency cache.' },
  queue:      { kind: 'queue',      label: 'Queue (SQS/Kafka)', shortLabel: 'Queue',      category: 'data',          cost: 2, desc: 'Async work decoupling.' },
  storage:    { kind: 'storage',    label: 'Object Storage S3', shortLabel: 'S3',         category: 'data',          cost: 1, desc: 'Blobs, datasets, models.' },
  github:     { kind: 'github',     label: 'GitHub Repo',       shortLabel: 'Git',        category: 'platform',      cost: 0, desc: 'Source of truth.' },
  argo:       { kind: 'argo',       label: 'ArgoCD',            shortLabel: 'Argo',       category: 'platform',      cost: 2, desc: 'GitOps sync to cluster.' },
  registry:   { kind: 'registry',   label: 'Container Registry',shortLabel: 'ECR',        category: 'platform',      cost: 1, desc: 'Built container images.' },
  monitor:    { kind: 'monitor',    label: 'Prometheus',        shortLabel: 'Prom',       category: 'observability', cost: 1, desc: 'Metric scraping.' },
  logs:       { kind: 'logs',       label: 'Loki Logs',         shortLabel: 'Loki',       category: 'observability', cost: 1, desc: 'Log aggregation.' },
  tracing:    { kind: 'tracing',    label: 'Grafana / Traces',  shortLabel: 'Grafana',    category: 'observability', cost: 1, desc: 'Dashboards & SLOs.' },
  vault:      { kind: 'vault',      label: 'Secrets (Vault)',   shortLabel: 'Vault',      category: 'security',      cost: 1, desc: 'Encrypted secrets.' },
  iam:        { kind: 'iam',        label: 'IAM Roles',         shortLabel: 'IAM',        category: 'security',      cost: 1, desc: 'Least-priv access.' },
  llm:        { kind: 'llm',        label: 'vLLM Inference',    shortLabel: 'vLLM',       category: 'ml',            cost: 4, desc: 'LLM serving with batching.' },
  vector:     { kind: 'vector',     label: 'Vector DB',         shortLabel: 'Vector',     category: 'ml',            cost: 2, desc: 'Embeddings retrieval.' },
  gpu:        { kind: 'gpu',        label: 'GPU Node Pool',     shortLabel: 'GPU',        category: 'ml',            cost: 3, desc: 'A100/H100 capacity.' },
  mlflow:     { kind: 'mlflow',     label: 'MLflow',            shortLabel: 'MLflow',     category: 'ml',            cost: 1, desc: 'Experiment tracking.' },
  kubeflow:   { kind: 'kubeflow',   label: 'Kubeflow Pipelines',shortLabel: 'Kubeflow',   category: 'ml',            cost: 2, desc: 'ML pipeline orchestration.' },
}

export interface EdgeReq {
  from: NodeKind
  to: NodeKind
  /** explanation shown when missing */
  why: string
}

export interface LevelDef {
  id: string
  index: number
  title: string
  brief: string
  reward: string                 // achievement title
  budget: number                 // total cost ceiling
  required: NodeKind[]           // must place
  bonus?: NodeKind[]             // optional good-to-haves with bonus score
  forbidden?: NodeKind[]         // placing these subtracts score
  requiredEdges: EdgeReq[]
  hints: string[]
}

export const LEVELS: LevelDef[] = [
  {
    id: 'L1',
    index: 1,
    title: 'Ship a Stateless Web Service',
    brief: 'Your team needs to serve a Next.js front end at scale. Build the minimum production path from user to running pods, with TLS, autoscaling, and a single source of truth.',
    reward: 'TWELVE-FACTOR INITIATE',
    budget: 18,
    required: ['user', 'cdn', 'lb', 'k8s', 'svc', 'autoscaler', 'github', 'registry'],
    bonus: ['monitor', 'tracing', 'waf'],
    requiredEdges: [
      { from: 'user',     to: 'cdn',   why: 'Users hit the edge first for cached assets.' },
      { from: 'cdn',      to: 'lb',    why: 'CDN forwards dynamic requests to your load balancer.' },
      { from: 'lb',       to: 'k8s',   why: 'LB terminates TLS and routes into the cluster.' },
      { from: 'k8s',      to: 'svc',   why: 'Pods host your service.' },
      { from: 'autoscaler', to: 'svc', why: 'HPA needs to scale your service pods.' },
      { from: 'github',   to: 'registry', why: 'CI builds and pushes images to a registry.' },
      { from: 'registry', to: 'k8s',   why: 'The cluster pulls images from the registry.' },
    ],
    hints: [
      'Always cache before you compute.',
      'Pods need an image source and a thing that scales them.',
      'Observability is a bonus here — start collecting points by adding Prometheus + Grafana.',
    ],
  },
  {
    id: 'L2',
    index: 2,
    title: 'GitOps in Production',
    brief: 'Same service, new mandate: ZERO manual kubectl. Use ArgoCD so every prod change is a pull request, with metrics, logs, and signed images.',
    reward: 'GITOPS PRACTITIONER',
    budget: 22,
    required: ['user','cdn','lb','k8s','svc','autoscaler','github','registry','argo','monitor','logs','tracing'],
    bonus: ['vault','iam','waf'],
    forbidden: [],
    requiredEdges: [
      { from: 'user', to: 'cdn', why: 'Users hit the edge.' },
      { from: 'cdn',  to: 'lb',  why: 'Edge routes to the LB.' },
      { from: 'lb',   to: 'k8s', why: 'LB into cluster.' },
      { from: 'k8s',  to: 'svc', why: 'Pods host service.' },
      { from: 'github', to: 'registry', why: 'CI builds images.' },
      { from: 'github', to: 'argo',     why: 'ArgoCD watches Git manifests.' },
      { from: 'argo',   to: 'k8s',      why: 'ArgoCD reconciles state into the cluster.' },
      { from: 'registry', to: 'k8s',    why: 'Cluster pulls images.' },
      { from: 'monitor', to: 'tracing', why: 'Prometheus metrics power Grafana dashboards.' },
      { from: 'logs',    to: 'tracing', why: 'Loki logs land in Grafana too.' },
      { from: 'k8s',     to: 'monitor', why: 'Cluster exposes metrics to Prometheus.' },
    ],
    hints: [
      'ArgoCD reads Git; the cluster reads ArgoCD.',
      'Observability is THREE components — metrics, logs, dashboards.',
      'Security bonuses: Vault for secrets, WAF in front of edge.',
    ],
  },
  {
    id: 'L3',
    index: 3,
    title: 'Self-Healing Data Service',
    brief: 'Now add stateful flows: an async worker, a primary database, a cache, and a queue. Keep p95 latency healthy at peak. Drift must self-correct, secrets must not live in Git.',
    reward: 'PLATFORM ARCHITECT',
    budget: 30,
    required: ['user','apigw','k8s','svc','autoscaler','db','cache','queue','github','argo','registry','monitor','logs','tracing','vault'],
    bonus: ['storage','iam','waf','cdn'],
    requiredEdges: [
      { from: 'user',     to: 'apigw', why: 'API Gateway is your front door — auth, rate-limit.' },
      { from: 'apigw',    to: 'k8s',   why: 'Gateway routes into the cluster.' },
      { from: 'k8s',      to: 'svc',   why: 'Pods host the service.' },
      { from: 'svc',      to: 'cache', why: 'Cache reads/writes from service.' },
      { from: 'svc',      to: 'db',    why: 'Primary persistence.' },
      { from: 'svc',      to: 'queue', why: 'Decouple heavy work via queue.' },
      { from: 'autoscaler', to: 'svc', why: 'Scale service pods at peak.' },
      { from: 'github',   to: 'argo',  why: 'GitOps source of truth.' },
      { from: 'argo',     to: 'k8s',   why: 'ArgoCD syncs cluster.' },
      { from: 'github',   to: 'registry', why: 'CI builds images.' },
      { from: 'registry', to: 'k8s',   why: 'Cluster pulls images.' },
      { from: 'vault',    to: 'svc',   why: 'Service reads secrets from Vault, not env files.' },
      { from: 'k8s',      to: 'monitor', why: 'Cluster metrics scraped.' },
      { from: 'k8s',      to: 'logs',  why: 'Pod logs into Loki.' },
      { from: 'monitor',  to: 'tracing', why: 'Dashboards from Prometheus.' },
    ],
    hints: [
      'API Gateway > raw LB when you need auth, throttling, per-route rules.',
      'Cache and DB sit beside the service, not in front of it.',
      'Vault must connect to the workload that uses secrets.',
    ],
  },
  {
    id: 'L4',
    index: 4,
    title: 'LLM Inference Platform',
    brief: 'Ship an OpenAI-compatible inference gateway: vLLM on GPU nodes, embeddings retrieval, observability for token throughput. RAG-ready.',
    reward: 'AI-INFRA ENGINEER',
    budget: 40,
    required: ['user','apigw','k8s','svc','llm','gpu','vector','cache','storage','autoscaler','github','argo','registry','monitor','logs','tracing','vault'],
    bonus: ['mlflow','kubeflow','iam','cdn'],
    requiredEdges: [
      { from: 'user',     to: 'apigw', why: 'Gateway authenticates LLM API callers.' },
      { from: 'apigw',    to: 'svc',   why: 'Gateway forwards into the inference frontend.' },
      { from: 'svc',      to: 'llm',   why: 'Service routes prompts to vLLM.' },
      { from: 'svc',      to: 'cache', why: 'Cache repeat prompts to save tokens.' },
      { from: 'svc',      to: 'vector',why: 'Retrieve embeddings for RAG.' },
      { from: 'llm',      to: 'gpu',   why: 'vLLM runs on the GPU node pool.' },
      { from: 'llm',      to: 'storage', why: 'Model weights loaded from object storage.' },
      { from: 'k8s',      to: 'svc',   why: 'Pods host the gateway.' },
      { from: 'k8s',      to: 'llm',   why: 'vLLM runs as a workload inside cluster.' },
      { from: 'autoscaler', to: 'llm', why: 'Scale LLM replicas under load.' },
      { from: 'github',   to: 'argo',  why: 'GitOps for the platform.' },
      { from: 'argo',     to: 'k8s',   why: 'Sync into cluster.' },
      { from: 'github',   to: 'registry', why: 'Build images for gateway.' },
      { from: 'registry', to: 'k8s',   why: 'Cluster pulls images.' },
      { from: 'vault',    to: 'svc',   why: 'API keys & JWT secrets from Vault.' },
      { from: 'k8s',      to: 'monitor', why: 'Cluster & GPU metrics scraped.' },
      { from: 'k8s',      to: 'logs',  why: 'Logs to Loki.' },
      { from: 'monitor',  to: 'tracing', why: 'Token throughput dashboards in Grafana.' },
    ],
    hints: [
      'vLLM has two dependencies that always trip people up: GPU and weights storage.',
      'Don\u2019t forget caching prompts — token cost adds up.',
      'Bonus: add MLflow + Kubeflow to manage model lifecycle.',
    ],
  },
]
