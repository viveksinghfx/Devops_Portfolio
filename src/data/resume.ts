export const personalInfo = {
  name: 'Vivek Singh',
  title: 'DevOps Engineer | MLOps Engineer | LLMOps Engineer',
  location: 'New Delhi, India',
  phone: '+91-9818506148',
  email: 'viveksinghfx@gmail.com',
  linkedin: 'https://linkedin.com/in/vsdevop',
  website: 'https://viveksingh.tech',
  github: 'https://github.com/viveksinghfx/Devop_Portfolio',
}

export const professionalSummary = `DevOps, MLOps, and LLMOps Engineer with 3+ years of experience including internships, building and operating cloud-native infrastructure on AWS. Skilled in Kubernetes, Terraform, Docker, ArgoCD, and GitOps workflows. Experienced in designing end-to-end ML pipelines, LLM inference platforms, and deploying LLM-powered applications using the OpenAI API. Background in Python automation from VFX production environments. Proven ability to reduce deployment times, improve system reliability, and bridge the gap between development and production engineering.`

export interface WorkExperience {
  company: string
  location: string
  period: string
  role: string
  type?: string
  bullets: string[]
}

export const workExperience: WorkExperience[] = [
  {
    company: 'Neevya Therapy',
    location: 'Remote',
    period: '2024 - Present',
    role: 'DevOps Engineer',
    type: 'Freelance',
    bullets: [
      'Sole engineer for an AI-powered therapy chatbot platform; built and owned the entire infrastructure stack from scratch including AWS, Kubernetes, CI/CD, and monitoring.',
      'Provisioned all cloud infrastructure on AWS from scratch using Terraform, including EKS cluster, VPC, IAM roles, S3, and RDS, establishing a secure and production-ready foundation.',
      'Containerized the OpenAI API-based chatbot backend and Next.js frontend using Docker and deployed to Kubernetes; configured AWS API Gateway as the entry point for all chatbot API traffic with rate limiting, usage plans, and IAM-based access control.',
      'Built end-to-end CI/CD pipeline using GitHub Actions covering automated build, Docker image push to ECR, and canary deployments to Kubernetes using Argo Rollouts, gradually shifting traffic to new chatbot versions before full rollout.',
      'Set up Prometheus and Grafana monitoring stack with dashboards tracking chatbot API latency, error rates, pod health, and resource utilization across environments.',
    ],
  },
  {
    company: 'Harikatha Studio',
    location: 'Remote',
    period: '11/2024 - 01/2026',
    role: 'Associate 2 - Pipeline and Automation Engineer',
    bullets: [
      'Built a Houdini to Unreal Engine bridge enabling seamless transfer of procedural assets and simulations into real-time environments, cutting asset handoff time significantly.',
      'Developed Python automation scripts and introduced FastAPI microservices to expose internal studio tooling as REST APIs, improving cross-team productivity.',
      'Created procedural workflows in Houdini for asset generation and scene construction, significantly reducing manual authoring time.',
      'Supported ML-driven procedural generation research and wrote game logic for interactive experiences.',
    ],
  },
  {
    company: 'Technicolor Animation Productions',
    location: 'Bengaluru, India',
    period: '07/2023 - 06/2024',
    role: 'FX Artist TD',
    bullets: [
      'Developed Python automation tools and modular procedural simulation systems across high-volume VFX pipelines delivering to global broadcast deadlines.',
      'Designed and implemented pipeline APIs using FastAPI to integrate simulation tools with asset management systems, reducing inter-team handoff time.',
      'Maintained and optimized technical pipelines supporting large-scale film and TV deliverables.',
      'Key productions: Crater (Disney Plus), Transformers: Rise of the Beasts, Ant-Man and the Wasp: Quantumania.',
    ],
  },
]

export interface Project {
  id: string
  title: string
  category: string
  techStack: string[]
  description: string
  bullets?: string[]
  githubUrl?: string
  challenge?: string
  solution?: string
  outcomes?: string[]
}

export const projects: Project[] = [
  {
    id: 'gitops-platform',
    title: 'Zero-Downtime Kubernetes GitOps Deployment Platform',
    category: 'Personal',
    techStack: ['ArgoCD', 'Kubernetes', 'Helm', 'GitHub Actions', 'Prometheus', 'Grafana', 'Loki', 'AWS EKS'],
    description: 'A fully GitOps-driven deployment platform on AWS EKS with dev, staging, and production environments managed declaratively via ArgoCD app-of-apps pattern.',
    challenge: 'Managing multi-environment deployments with zero downtime, automated rollback, and complete visibility into deployment state across dev, staging, and production.',
    solution: 'Implemented ArgoCD app-of-apps pattern with automated sync and drift detection. Blue-green and canary release strategies using Argo Rollouts with GitHub Actions CI/CD.',
    outcomes: [
      'Full deploy cycle under 8 minutes with zero manual intervention',
      'Zero-downtime deployments across all environments',
      'Automated drift detection and self-healing infrastructure',
    ],
    githubUrl: 'https://github.com/viveksinghfx/Devop_Portfolio',
  },
  {
    id: 'llm-gateway',
    title: 'LLM Inference Gateway and Serving Platform',
    category: 'Personal / Open Source',
    techStack: ['FastAPI', 'vLLM', 'Kubernetes', 'Prometheus', 'Redis', 'AWS EKS'],
    description: 'A self-hosted LLM inference gateway using vLLM on Kubernetes, exposing an OpenAI-compatible FastAPI interface with JWT authentication, rate limiting, and per-model routing.',
    challenge: 'Serving LLM models at scale with low latency, efficient batching, and proper request routing while maintaining OpenAI API compatibility for seamless integration.',
    solution: 'Deployed vLLM on Kubernetes with custom FastAPI gateway layer. Instrumented token throughput, time-to-first-token, and queue depth with Prometheus and Grafana.',
    outcomes: [
      'Reduced p95 latency by 40% through batching configuration and HPA',
      'OpenAI-compatible API interface with JWT auth and rate limiting',
      'Real-time token throughput and queue depth monitoring',
    ],
    githubUrl: 'https://github.com/viveksinghfx/Devop_Portfolio',
  },
  {
    id: 'mlops-pipeline',
    title: 'End-to-End MLOps Pipeline on AWS',
    category: 'Personal',
    techStack: ['MLflow', 'Kubeflow Pipelines', 'ArgoCD', 'Terraform', 'AWS S3', 'RDS', 'EKS'],
    description: 'A complete MLOps lifecycle covering data versioning in S3, experiment tracking with MLflow, automated retraining pipelines in Kubeflow, and GitOps-driven model promotion via ArgoCD.',
    challenge: 'Bridging the gap between ML experimentation and production deployment with automated retraining, model versioning, and drift detection.',
    solution: 'Built automated pipeline from data versioning to production deployment with MLflow tracking, Kubeflow orchestration, and ArgoCD GitOps model promotion.',
    outcomes: [
      'New model versions reached production in under 15 minutes from merge',
      'Zero manual steps from experiment to production deployment',
      'Automated drift detection and alerting pipeline',
    ],
    githubUrl: 'https://github.com/viveksinghfx/Devop_Portfolio',
  },
]

export const skills = {
  devops: ['Kubernetes', 'Docker', 'Helm', 'ArgoCD', 'Argo Rollouts', 'GitHub Actions', 'GitOps', 'Backstage', 'Bash', 'Linux', 'Next.js'],
  mlops: ['MLflow', 'Kubeflow Pipelines', 'vLLM', 'TGI', 'OpenAI API', 'Model Registry', 'Model Versioning', 'A/B Model Rollouts', 'Drift Detection', 'Feature Stores', 'Prompt Pipelines'],
  apis: ['FastAPI', 'Pydantic', 'REST API Design', 'Async Python', 'Microservices', 'Swagger', 'OpenAPI'],
  cloud: ['AWS (EKS, VPC, IAM, S3, RDS, ECR, API Gateway)', 'Terraform', 'Ansible'],
  observability: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager', 'Custom ML Dashboards'],
  programming: ['Python', 'Bash'],
}

export const education = [
  { degree: 'MCA', institution: 'Maharaja Agrasen Himalayan Garhwal University', year: '09/2023' },
  { degree: 'BCA', institution: 'Maharaja Agrasen Himalayan Garhwal University', year: '09/2021' },
  { degree: 'Diploma in Animation & VFX', institution: 'MAAC', year: '08/2022' },
]

export const certifications = [
  'AI Engineer for Developers - Associate',
  'Python Data Associate',
  'Datacom Introduction to Cloud',
]
