# 🧪 DevOps & SRE Hands-On Lab

This lab provides practical exercises to prepare for Site Reliability Engineer interviews.

## 🎯 Lab Structure

```
lab/
├── 01-linux-troubleshooting/     # System diagnostics & debugging
├── 02-monitoring-stack/           # Prometheus + Grafana + Loki
├── 03-kubernetes/                 # K8s deployments & debugging
├── 04-terraform/                  # Infrastructure as Code
├── 05-ansible/                    # Configuration management
├── 06-incident-simulation/        # Break things & fix them
└── 07-cicd-pipeline/              # Jenkins/GitHub Actions examples
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Minikube or kind (for Kubernetes)
- Terraform (optional)
- Ansible (optional)

### Launch Full Lab Environment

```bash
# Start monitoring stack
cd lab/02-monitoring-stack
docker-compose up -d

# Start Kubernetes
minikube start --memory=4096 --cpus=2

# Access services
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3000 (admin/admin)
```

## 📚 Lab Exercises

### Level 1: Linux Fundamentals
- Find processes consuming high CPU/memory
- Analyze system logs for errors
- Diagnose network connectivity issues
- Find and clean large files

### Level 2: Monitoring & Observability
- Deploy Prometheus + Grafana stack
- Create custom metrics exporter
- Build dashboards for golden signals
- Set up alerts with thresholds

### Level 3: Kubernetes Operations
- Deploy microservices application
- Debug crashloop pods
- Scale deployments
- Manage ConfigMaps and Secrets
- Simulate pod failures

### Level 4: Infrastructure Automation
- Write Terraform modules
- Create Ansible playbooks
- Automate deployment pipeline

### Level 5: Incident Response
- Respond to simulated outages
- Perform root cause analysis
- Write postmortem reports

## 🎓 Learning Path

1. **Day 1-2:** Linux troubleshooting & monitoring basics
2. **Day 3-4:** Kubernetes & container orchestration
3. **Day 5-6:** IaC with Terraform & Ansible
4. **Day 7:** Incident simulation & response

---

**Let's get started! 🚀**

