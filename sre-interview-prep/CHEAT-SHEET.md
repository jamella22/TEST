# 🧠 SRE / DevOps Master Cheat Sheet

**Goal**: Техническа подготовка за Site Reliability Engineer интервюта
**Last Updated**: 2025-10-24

---

## 🧩 1. Core Linux & Troubleshooting

### System Monitoring
| Purpose | Command | Notes |
|---------|---------|-------|
| CPU/Memory usage | `top`, `htop` | Interactive process viewer |
| Memory details | `free -m`, `vmstat 1` | Memory stats |
| Disk usage | `df -h`, `du -ah /var \| sort -rh \| head -20` | Disk space |
| I/O statistics | `iostat -x 1`, `iotop` | Disk I/O performance |
| Network ports | `ss -tulnp`, `sudo lsof -i :8080` | Active connections |
| Running processes | `ps aux --sort=-%mem` | Process list sorted |

### Logs & Services
```bash
# Systemd logs
journalctl -u nginx -f                    # Follow service logs
journalctl -p err -b                       # Errors since boot
journalctl --since "2 hours ago"          # Time-based filtering

# Service management
systemctl status nginx
systemctl restart nginx
systemctl enable nginx

# Find large files
find / -type f -size +500M 2>/dev/null
find /var/log -name "*.log" -mtime +30    # Older than 30 days
```

### Network Troubleshooting
```bash
# Check connectivity
curl -vvv https://api.example.com
nc -zv hostname 443                       # Port check

# DNS lookup
dig example.com
nslookup example.com

# Route tracing
traceroute example.com
mtr example.com                           # Real-time trace

# Packet capture
tcpdump -i eth0 port 80 -w capture.pcap
tcpdump -r capture.pcap 'port 443'
```

💡 **Pro Tip**: Always check logs + metrics + service status together for complete picture.

---

## ☁️ 2. Cloud & Infrastructure (AWS, Terraform, Ansible)

### Terraform Basics
```hcl
# main.tf example
terraform {
  required_version = ">= 1.0"
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "eu-central-1"
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_instance" "web" {
  ami           = var.ami_id
  instance_type = "t3.micro"
  
  tags = {
    Name = "web-server"
    Environment = var.environment
  }
}
```

**Key Commands**:
```bash
terraform init                # Initialize backend
terraform fmt                 # Format code
terraform validate            # Validate syntax
terraform plan                # Preview changes
terraform apply               # Apply changes
terraform destroy             # Destroy resources
terraform state list          # List resources
terraform state show aws_instance.web
```

**Key Concepts**:
- **State file**: Tracks real infrastructure
- **Idempotent**: Same config = same result
- **Variables**: Stored in `.tfvars` files
- **Modules**: Reusable components
- **Workspaces**: Multiple environments

### Ansible Basics
```yaml
# playbook.yml example
---
- hosts: webservers
  become: yes
  vars:
    nginx_port: 80
  
  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: present
        update_cache: yes
    
    - name: Copy configuration
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: restart nginx
    
    - name: Ensure nginx is running
      service:
        name: nginx
        state: started
        enabled: yes
  
  handlers:
    - name: restart nginx
      service:
        name: nginx
        state: restarted
```

**Key Commands**:
```bash
ansible-playbook -i inventory.ini playbook.yml
ansible-playbook playbook.yml --check          # Dry run
ansible-playbook playbook.yml --tags nginx     # Run specific tags
ansible all -m ping -i inventory.ini           # Test connectivity
ansible-vault encrypt secrets.yml              # Encrypt secrets
```

💡 **Remember**: Terraform = provision infrastructure, Ansible = configure and deploy

---

## 🐳 3. Containers & Kubernetes

### Docker
```bash
# Container management
docker ps -a                              # List all containers
docker logs -f container_name             # Follow logs
docker exec -it container_name bash       # Shell access
docker inspect container_name             # Detailed info
docker stats                              # Resource usage

# Image management
docker build -t myapp:v1.0 .
docker images
docker rmi image_id
docker system prune -a                    # Clean up

# Docker Compose
docker-compose up -d                      # Start services
docker-compose ps                         # List services
docker-compose logs -f service_name       # Service logs
docker-compose down                       # Stop and remove
```

### Kubernetes (kubectl)
```bash
# Pod operations
kubectl get pods -A                       # All pods in all namespaces
kubectl get pods -n production            # Specific namespace
kubectl describe pod pod-name             # Detailed info
kubectl logs pod-name -c container-name   # Container logs
kubectl logs pod-name --previous          # Previous crashed container
kubectl exec -it pod-name -- bash         # Shell access

# Deployments
kubectl get deployments
kubectl scale deployment myapp --replicas=5
kubectl rollout status deployment/myapp
kubectl rollout undo deployment/myapp     # Rollback
kubectl set image deployment/myapp web=myapp:v2.0

# Services & Networking
kubectl get svc
kubectl expose deployment myapp --port=80 --target-port=8080
kubectl port-forward pod-name 8080:80

# Configuration
kubectl get configmaps
kubectl create configmap app-config --from-file=config.json
kubectl get secrets
kubectl create secret generic db-pass --from-literal=password=secret123

# Debugging
kubectl describe node node-name
kubectl top pods                          # Resource usage
kubectl top nodes
kubectl get events --sort-by=.metadata.creationTimestamp
```

### Key Kubernetes Concepts
| Concept | Description |
|---------|-------------|
| **Pod** | Smallest deployable unit (one or more containers) |
| **Deployment** | Manages replicas and rolling updates |
| **Service** | Exposes pods (ClusterIP, NodePort, LoadBalancer) |
| **ConfigMap** | Configuration data as key-value pairs |
| **Secret** | Sensitive data (base64 encoded) |
| **Namespace** | Virtual cluster for resource isolation |
| **Ingress** | HTTP/HTTPS routing to services |
| **StatefulSet** | For stateful applications (databases) |
| **DaemonSet** | Runs pod on every node (monitoring agents) |

💡 **Debugging Flow**: Check logs → Describe pod → Check events → Check node → Check metrics

---

## 📊 4. Monitoring & Observability

### The Four Golden Signals
1. **Latency** - Response time (ms)
2. **Traffic** - Request volume (req/sec)
3. **Errors** - Rate of failed requests (%)
4. **Saturation** - Resource usage (CPU, RAM, I/O)

### Prometheus Basics
```promql
# Uptime check
up

# Request rate (5min average)
rate(http_requests_total[5m])

# CPU usage
avg_over_time(cpu_usage_seconds_total[5m])

# Container CPU by pod
sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)

# Memory usage percentage
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100

# HTTP error rate
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100

# P95 latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Alert example (in Prometheus rules)
groups:
  - name: sre_alerts
    rules:
      - alert: HighErrorRate
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
```

### Grafana
- **Dashboards**: Visualize metrics from Prometheus
- **Alerts**: Trigger on threshold violations → Slack/Email
- **Variables**: Dynamic dashboards (filter by env, pod, etc.)

### Logging Stack (ELK/Loki)
```bash
# Loki query examples (LogQL)
{app="nginx"} |= "error"                  # Filter by text
{namespace="production"} | json | level="error"
rate({app="api"}[5m])                     # Log rate
```

💡 **Best Practice**: Build alerts for **symptoms** (user-facing), not just causes (server down)

---

## 🧠 5. SRE Core Concepts

### Key Metrics
| Term | Meaning | Example |
|------|---------|---------|
| **SLA** | Service Level Agreement (contract) | 99.9% uptime guarantee |
| **SLO** | Service Level Objective (internal target) | 99.95% uptime goal |
| **SLI** | Service Level Indicator (measurement) | Actual 99.93% last month |
| **Error Budget** | Allowed downtime before SLA breach | 43 min/month for 99.9% |
| **MTTD** | Mean Time To Detect | Avg time to notice issue |
| **MTTR** | Mean Time To Repair | Avg time to fix issue |
| **MTBF** | Mean Time Between Failures | Avg time between incidents |

### Error Budget Calculation
```
Error Budget = (1 - SLO) × Time Period

Example: 99.9% SLO for 30 days
Error Budget = (1 - 0.999) × 30 days × 24 hours × 60 minutes
            = 0.001 × 43,200 minutes
            = 43.2 minutes of downtime allowed
```

### Incident Response Process

```
┌─────────────┐
│   DETECT    │  Via monitoring/alerts/user reports
└──────┬──────┘
       │
┌──────▼──────┐
│  MITIGATE   │  Stop bleeding, restore service
└──────┬──────┘
       │
┌──────▼──────┐
│ COMMUNICATE │  Update stakeholders, status page
└──────┬──────┘
       │
┌──────▼──────┐
│ ROOT CAUSE  │  Find failure chain
└──────┬──────┘
       │
┌──────▼──────┐
│  PREVENT    │  Fix permanently, update runbooks
└─────────────┘
```

### Blameless Postmortem Template
```markdown
# Incident Postmortem: [TITLE]

## Summary
- **Date**: YYYY-MM-DD
- **Duration**: X hours
- **Impact**: X users affected, Y% error rate
- **Severity**: Critical/High/Medium/Low

## Timeline
- 14:00 - Alert triggered: High error rate
- 14:05 - Oncall engineer notified
- 14:10 - Root cause identified: DB connection pool exhausted
- 14:30 - Mitigation applied: Increased pool size
- 14:45 - Service fully recovered

## Root Cause
Database connection pool was set to 10 (too low for current traffic).
Recent traffic increase (Black Friday) exceeded capacity.

## Resolution
- Increased pool size from 10 to 50
- Added monitoring alert for pool usage > 80%

## Action Items
- [ ] Review all connection pool settings (Owner: DevOps, Due: 2025-11-01)
- [ ] Add capacity planning review to quarterly process
- [ ] Update runbook with pool increase procedure

## Lessons Learned
- Need better capacity planning before traffic spikes
- Pool metrics were not monitored
```

💡 **Remember**: Incidents are learning opportunities, not blame sessions

---

## 🔐 6. Security & Networking

### Security Best Practices
```bash
# SSH key authentication (no passwords)
ssh-keygen -t ed25519 -C "your_email@example.com"
ssh-copy-id user@server

# Firewall (ufw)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Check open ports
sudo ss -tulpn
sudo lsof -i -P -n | grep LISTEN

# SSL/TLS certificate check
openssl s_client -connect example.com:443 -showcerts
```

### Security Scanning Types
| Type | Description | When |
|------|-------------|------|
| **SAST** | Static Application Security Testing | Code analysis before build |
| **DAST** | Dynamic Application Security Testing | Runtime/black-box testing |
| **IAST** | Interactive Application Security Testing | Runtime with instrumentation |

### Secrets Management
- **Never** commit secrets to Git
- Use **Vault**, **SOPS**, or cloud KMS
- Rotate secrets regularly
- Use **IAM roles** instead of access keys (AWS)

---

## ⚙️ 7. CI/CD Pipeline

### Pipeline Stages
```
┌──────┐   ┌──────┐   ┌──────┐   ┌────────┐   ┌────────┐
│ BUILD│──▶│ TEST │──▶│ SCAN │──▶│ STAGING│──▶│  PROD  │
└──────┘   └──────┘   └──────┘   └────────┘   └────────┘
           ├lint     ├security    (auto)      (approval)
           ├unit     ├SAST
           └e2e      └dependency
```

### Example: GitHub Actions
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .
      
      - name: Run tests
        run: docker run myapp:${{ github.sha }} npm test
      
      - name: Security scan
        run: trivy image myapp:${{ github.sha }}
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push myapp:${{ github.sha }}
  
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/myapp web=myapp:${{ github.sha }}
          kubectl rollout status deployment/myapp
```

### Deployment Strategies
| Strategy | Description | Use Case |
|----------|-------------|----------|
| **Rolling** | Gradual pod replacement | Standard deployments |
| **Blue-Green** | Switch traffic to new version | Zero-downtime |
| **Canary** | Route small % to new version | Risk mitigation |
| **Feature Flags** | Toggle features without deploy | A/B testing |

---

## 🧰 8. Useful Tools Reference

| Category | Tools | Purpose |
|----------|-------|---------|
| **Logs** | ELK, Loki, Fluentd | Centralized logging |
| **Metrics** | Prometheus, Grafana, Datadog | Time-series data |
| **Traces** | Jaeger, Zipkin | Distributed tracing |
| **IaC** | Terraform, Pulumi, CloudFormation | Infrastructure provisioning |
| **Config Mgmt** | Ansible, Chef, Puppet | Configuration automation |
| **CI/CD** | Jenkins, GitLab CI, GitHub Actions | Build & deploy automation |
| **Cloud** | AWS, Azure, GCP, VMware | Infrastructure platforms |
| **Container** | Docker, Podman | Containerization |
| **Orchestration** | Kubernetes, OpenShift, Nomad | Container management |
| **Secrets** | Vault, SOPS, AWS KMS | Secret management |
| **Debugging** | curl, netcat, tcpdump, strace | Network & system debug |

---

## 🚀 9. Interview Quick Tips

### Technical Demonstration
✅ **Always explain your thinking process**:
> "First I'd check the logs with `kubectl logs`, then examine metrics in Grafana, and finally describe the pod to see events..."

✅ **Show automation mindset**:
> "After fixing this manually, I'd create an Ansible playbook to prevent it and add monitoring to detect it earlier..."

✅ **Demonstrate SRE principles**:
> "I'd check if we're within our error budget before doing the rollout, and set up canary deployment to minimize risk..."

### STAR Method for Experience Questions
- **S**ituation: Brief context
- **T**ask: Your responsibility
- **A**ction: What you did (technical details)
- **R**esult: Outcome and learning

### Questions to Ask Interviewer
1. "What's your incident response process and on-call rotation?"
2. "How do you balance feature development with reliability work?"
3. "What monitoring and observability tools does the team use?"
4. "How do you handle technical debt and prioritize improvements?"
5. "What's the team's approach to automation and IaC?"

---

## 📚 10. VMware Cloud Foundation Focus

### Core Components
- **vSphere** - Virtualization platform
- **vSAN** - Software-defined storage
- **NSX-T** - Software-defined networking
- **SDDC Manager** - Lifecycle management
- **vRealize** - Automation & operations

### Key Skills
- Deploy greenfield VCF via automation
- Plan rolling upgrades of VCF components
- Integration with external services (AD/LDAP, monitoring)
- High availability and disaster recovery

### Automation
- **Terraform VMware Provider**
- **vRealize Automation**
- **PowerCLI** (PowerShell for VMware)
- **Ansible VMware modules**

---

**Last Updated**: 2025-10-24
**Version**: 1.0 - Banfico & VMware SRE Interview Prep
