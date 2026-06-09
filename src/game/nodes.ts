import {
  Users, Globe, Shield, Network, Layers, Boxes, Server, Repeat, Database, Box,
  GitMerge, HardDrive, GitBranch, Workflow, Activity, ListChecks, Eye, Lock,
  KeySquare, Brain, FlaskConical, Cpu, Cog, Bell, GitFork, Zap, Map, Globe2,
  Database as DatabaseIcon, Cloud, Radio, Bot, Boxes as BoxesIcon,
  ShieldCheck, BookOpen, FunctionSquare,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type { NodeKind, NodeSpec } from './types'

export const NODE_ICONS: Record<NodeKind, ComponentType<{ size?: number | string; className?: string }>> = {
  user: Users, cdn: Globe, waf: Shield, lb: Network, apigw: Layers,
  k8s: Boxes, svc: Server, autoscaler: Repeat, sidecar: BoxesIcon,
  db: Database, cache: Box, queue: GitMerge, storage: HardDrive, dwh: DatabaseIcon,
  github: GitBranch, argo: Workflow, registry: Box, ciCd: GitFork, helm: BookOpen,
  monitor: Activity, logs: ListChecks, tracing: Eye, alerts: Bell,
  vault: Lock, iam: KeySquare, kms: ShieldCheck,
  llm: Brain, vector: FlaskConical, gpu: Cpu, mlflow: Cog, kubeflow: Workflow,
  featureStore: FunctionSquare, modelRegistry: BookOpen,
  region2: Cloud, route53: Globe2, multiRegionDb: DatabaseIcon, globalAccel: Zap,
  eventBus: Radio, chaosEngine: Bot, sre: ShieldCheck, edgeCompute: Map,
}

export const NODE_LIBRARY: Record<NodeKind, NodeSpec> = {
  // edge
  user:         { kind: 'user',         label: 'End User',           shortLabel: 'User',        category: 'edge',          cost: 0, desc: 'Origin of all traffic.', flavor: 'They are impatient. P95 matters.' },
  cdn:          { kind: 'cdn',          label: 'CDN / Edge',          shortLabel: 'CDN',         category: 'edge',          cost: 1, desc: 'Cache static assets at the edge.' },
  waf:          { kind: 'waf',          label: 'WAF',                 shortLabel: 'WAF',         category: 'security',      cost: 1, desc: 'Filter malicious traffic.' },
  lb:           { kind: 'lb',           label: 'Load Balancer',       shortLabel: 'LB',          category: 'edge',          cost: 1, desc: 'TLS termination + traffic spread.' },
  apigw:        { kind: 'apigw',        label: 'API Gateway',         shortLabel: 'API GW',      category: 'edge',          cost: 2, desc: 'Auth, throttle, route.' },

  // compute
  k8s:          { kind: 'k8s',          label: 'Kubernetes (EKS)',    shortLabel: 'K8s',         category: 'compute',       cost: 4, desc: 'Container orchestration.' },
  svc:          { kind: 'svc',          label: 'App Service',         shortLabel: 'App',         category: 'compute',       cost: 2, desc: 'Your microservice pods.' },
  autoscaler:   { kind: 'autoscaler',   label: 'HPA / Autoscaler',    shortLabel: 'HPA',         category: 'compute',       cost: 1, desc: 'Scale pods on demand.' },
  sidecar:      { kind: 'sidecar',      label: 'Service Mesh',        shortLabel: 'Mesh',        category: 'compute',       cost: 2, desc: 'Istio / Linkerd sidecar.' },

  // data
  db:           { kind: 'db',           label: 'PostgreSQL (RDS)',    shortLabel: 'DB',          category: 'data',          cost: 3, desc: 'Primary relational store.' },
  cache:        { kind: 'cache',        label: 'Redis Cache',         shortLabel: 'Cache',       category: 'data',          cost: 2, desc: 'Low-latency cache.' },
  queue:        { kind: 'queue',        label: 'Queue (SQS/Kafka)',   shortLabel: 'Queue',       category: 'data',          cost: 2, desc: 'Async work decoupling.' },
  storage:      { kind: 'storage',      label: 'Object Storage S3',   shortLabel: 'S3',          category: 'data',          cost: 1, desc: 'Blobs, datasets, weights.' },
  dwh:          { kind: 'dwh',          label: 'Data Warehouse',      shortLabel: 'DWH',         category: 'data',          cost: 3, desc: 'Snowflake / BigQuery.' },

  // platform
  github:       { kind: 'github',       label: 'GitHub Repo',         shortLabel: 'Git',         category: 'platform',      cost: 0, desc: 'Source of truth.' },
  argo:         { kind: 'argo',         label: 'ArgoCD',              shortLabel: 'Argo',        category: 'platform',      cost: 2, desc: 'GitOps reconciliation.' },
  registry:     { kind: 'registry',     label: 'Container Registry',  shortLabel: 'ECR',         category: 'platform',      cost: 1, desc: 'Built images live here.' },
  ciCd:         { kind: 'ciCd',         label: 'CI/CD Runner',        shortLabel: 'CI',          category: 'platform',      cost: 2, desc: 'GitHub Actions / GitLab CI.' },
  helm:         { kind: 'helm',         label: 'Helm Chart',          shortLabel: 'Helm',        category: 'platform',      cost: 1, desc: 'Templated manifests.' },

  // observability
  monitor:      { kind: 'monitor',      label: 'Prometheus',          shortLabel: 'Prom',        category: 'observability', cost: 1, desc: 'Metric scraping.' },
  logs:         { kind: 'logs',         label: 'Loki Logs',           shortLabel: 'Loki',        category: 'observability', cost: 1, desc: 'Log aggregation.' },
  tracing:      { kind: 'tracing',      label: 'Grafana / Tempo',     shortLabel: 'Grafana',     category: 'observability', cost: 1, desc: 'Dashboards & traces.' },
  alerts:       { kind: 'alerts',       label: 'Alertmanager',        shortLabel: 'Alerts',      category: 'observability', cost: 1, desc: 'Page the on-call.' },

  // security
  vault:        { kind: 'vault',        label: 'Secrets (Vault)',     shortLabel: 'Vault',       category: 'security',      cost: 1, desc: 'Encrypted secrets.' },
  iam:          { kind: 'iam',          label: 'IAM Roles',           shortLabel: 'IAM',         category: 'security',      cost: 1, desc: 'Least-priv access.' },
  kms:          { kind: 'kms',          label: 'KMS',                 shortLabel: 'KMS',         category: 'security',      cost: 1, desc: 'Encryption keys.' },

  // ml
  llm:          { kind: 'llm',          label: 'vLLM Inference',      shortLabel: 'vLLM',        category: 'ml',            cost: 4, desc: 'LLM serving with batching.' },
  vector:       { kind: 'vector',       label: 'Vector DB',           shortLabel: 'Vector',      category: 'ml',            cost: 2, desc: 'Embeddings retrieval.' },
  gpu:          { kind: 'gpu',          label: 'GPU Node Pool',       shortLabel: 'GPU',         category: 'ml',            cost: 3, desc: 'A100/H100 capacity.' },
  mlflow:       { kind: 'mlflow',       label: 'MLflow',              shortLabel: 'MLflow',      category: 'ml',            cost: 1, desc: 'Experiment tracking.' },
  kubeflow:     { kind: 'kubeflow',     label: 'Kubeflow Pipelines',  shortLabel: 'Kubeflow',    category: 'ml',            cost: 2, desc: 'ML pipeline orchestration.' },
  featureStore: { kind: 'featureStore', label: 'Feature Store',       shortLabel: 'Feast',       category: 'ml',            cost: 2, desc: 'Online + offline features.' },
  modelRegistry:{ kind: 'modelRegistry',label: 'Model Registry',      shortLabel: 'Models',      category: 'ml',            cost: 1, desc: 'Versioned model artifacts.' },

  // global
  region2:      { kind: 'region2',      label: 'Region B (Failover)', shortLabel: 'Region 2',    category: 'global',        cost: 5, desc: 'Hot standby region.' },
  route53:      { kind: 'route53',      label: 'Route53 / GeoDNS',    shortLabel: 'GeoDNS',      category: 'global',        cost: 1, desc: 'Latency-based routing.' },
  multiRegionDb:{ kind: 'multiRegionDb',label: 'Aurora Global DB',    shortLabel: 'Global DB',   category: 'global',        cost: 4, desc: 'Cross-region replication.' },
  globalAccel:  { kind: 'globalAccel',  label: 'Global Accelerator',  shortLabel: 'Accel',       category: 'global',        cost: 2, desc: 'Anycast frontdoor.' },

  // misc advanced
  eventBus:     { kind: 'eventBus',     label: 'Event Bus',           shortLabel: 'EventBus',    category: 'data',          cost: 2, desc: 'EventBridge / NATS.' },
  chaosEngine:  { kind: 'chaosEngine',  label: 'Chaos Engine',        shortLabel: 'Chaos',       category: 'observability', cost: 1, desc: 'Inject failure on purpose.' },
  sre:          { kind: 'sre',          label: 'SLO Engine',          shortLabel: 'SLO',         category: 'observability', cost: 1, desc: 'Error budget burn alerts.' },
  edgeCompute:  { kind: 'edgeCompute',  label: 'Edge Compute',        shortLabel: 'Edge Fn',     category: 'edge',          cost: 2, desc: 'Cloudflare Workers / Lambda@Edge.' },
}

export const CATEGORIES: { id: import('./types').Category; label: string; tint: string }[] = [
  { id: 'edge',          label: 'Edge & Traffic',   tint: 'rgb(110 178 255)' },
  { id: 'compute',       label: 'Compute',          tint: 'rgb(255 142 60)' },
  { id: 'data',          label: 'Data',             tint: 'rgb(180 110 255)' },
  { id: 'platform',      label: 'Platform / CI',    tint: 'rgb(86 246 162)' },
  { id: 'observability', label: 'Observability',    tint: 'rgb(255 200 0)' },
  { id: 'security',      label: 'Security',         tint: 'rgb(255 86 86)' },
  { id: 'ml',            label: 'ML & AI',          tint: 'rgb(255 110 200)' },
  { id: 'global',        label: 'Global / HA',      tint: 'rgb(120 220 220)' },
]
