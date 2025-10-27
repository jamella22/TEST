# 🚀 DevOps & SRE Technical Interview Cheat Sheet

**Purpose:** Fast reference for Site Reliability Engineer / DevOps Engineer interviews  
**Focus:** Linux, Cloud, IaC, Kubernetes, Monitoring, CI/CD, Incident Management  
**Target Roles:** Banfico SRE, VMware Cloud Foundation SRE, similar positions

---

## 🧩 1. Core Linux & Troubleshooting

### Essential Commands
```bash
# CPU & Memory
top                    # interactive process viewer
htop                   # enhanced top
free -m                # memory usage in MB
vmstat 1               # virtual memory stats
sar -u 5 10            # CPU usage, 5s intervals, 10 times

# Disk
df -h                  # disk space human-readable
du -ah / | sort -rh | head -20   # top 20 largest files/dirs
iotop                  # disk I/O by process
lsblk                  # block devices

# Processes
ps aux --sort=-%mem | head        # top memory consumers
ps aux --sort=-%cpu | head        # top CPU consumers
pgrep -a nginx                    # find process by name
kill -15 <PID>                    # graceful termination
kill -9 <PID>                     # force kill

# Services & Logs
systemctl status nginx
systemctl restart nginx
journalctl -u nginx -f            # follow logs for unit
journalctl --since "10 min ago"
dmesg -T                          # kernel messages with timestamps
tail -f /var/log/syslog

# Networking
ss -tulnp                         # listening ports
sudo lsof -i :8080                # what's using port 8080
netstat -rn                       # routing table
curl -vk https://example.com      # verbose SSL debug
dig +trace example.com            # DNS resolution path
traceroute example.com
tcpdump -i eth0 port 443          # packet capture

# Files & Permissions
stat file.txt                     # detailed file info
ls -lah                           # list with hidden files
chmod 600 ~/.ssh/id_rsa
chown user:group file.txt
```

### Troubleshooting Methodology
1. **Reproduce** the issue
2. **Isolate** affected components (logs, metrics, network)
3. **Analyze** root cause (check dependencies, configs, resources)
4. **Fix** and verify
5. **Document** in postmortem

**Pro Tip:** Always triangulate: **Logs + Metrics + Service Status**

---

## ☁️ 2. Cloud & Infrastructure as Code

### Terraform Basics

```bash
# Workflow
terraform init                    # initialize providers
terraform fmt                     # format code
terraform validate                # syntax check
terraform plan -out=plan.tfplan   # preview changes
terraform apply plan.tfplan       # apply changes
terraform destroy                 # tear down

# State management
terraform state list              # list resources
terraform state show aws_instance.web
terraform import aws_instance.web i-abc123
```

**Key Concepts:**
- **State file:** tracks real infrastructure
- **Modules:** reusable components (network, compute, etc.)
- **Remote backend:** S3 + DynamoDB for locking
- **Workspaces:** separate environments (dev, staging, prod)

### Ansible Basics

```bash
# Run playbook
ansible-playbook -i inventory.ini site.yml

# Dry-run (check mode)
ansible-playbook -i inventory.ini site.yml --check

# With secrets
ansible-playbook -i inventory.ini site.yml --ask-vault-pass
```

**Example Playbook:**
```yaml
---
- hosts: web
  become: yes
  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: present
        update_cache: yes

    - name: Start nginx
      service:
        name: nginx
        state: started
        enabled: yes

    - name: Copy config
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: restart nginx

  handlers:
    - name: restart nginx
      service:
        name: nginx
        state: restarted
```

**Key Concepts:**
- **Idempotency:** safe to run multiple times
- **Roles:** organize tasks by function
- **Inventory:** define hosts and groups
- **Vault:** encrypt sensitive variables

---

## 🐳 3. Containers & Kubernetes

### Docker Essentials

```bash
# Basic operations
docker ps -a                      # all containers
docker logs <container>           # view logs
docker logs -f <container>        # follow logs
docker exec -it <container> bash  # shell into container
docker inspect <container>        # detailed info

# Images
docker build -t myapp:v1 .
docker images
docker rmi <image>

# Docker Compose
docker-compose up -d
docker-compose logs -f
docker-compose down
```

### Kubernetes Commands

```bash
# Pods
kubectl get pods -A               # all namespaces
kubectl describe pod <name>       # detailed info
kubectl logs <pod>                # view logs
kubectl logs <pod> -c <container> # specific container
kubectl exec -it <pod> -- bash    # shell into pod

# Deployments
kubectl get deployments
kubectl scale deployment myapp --replicas=5
kubectl rollout status deployment/myapp
kubectl rollout undo deployment/myapp

# Services
kubectl get svc
kubectl expose deployment myapp --port=80 --target-port=8080 --type=LoadBalancer

# ConfigMaps & Secrets
kubectl create configmap app-config --from-file=config.yaml
kubectl create secret generic db-pass --from-literal=password=secret123

# Debugging
kubectl describe pod <name>       # check events
kubectl get events --sort-by='.lastTimestamp'
```

### StatefulSet Example

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
spec:
  serviceName: redis
  replicas: 3
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: data
          mountPath: /data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 5Gi
```

**Key Concepts:**
- **Pod:** smallest deployable unit
- **Deployment:** manages replicas, rolling updates
- **Service:** stable network endpoint (ClusterIP, NodePort, LoadBalancer)
- **StatefulSet:** ordered deployment, stable network IDs, persistent storage
- **ConfigMap/Secret:** externalized configuration

---

## 📊 4. Monitoring & Observability

### The Four Golden Signals
1. **Latency** — response time
2. **Traffic** — requests per second
3. **Errors** — rate of failed requests
4. **Saturation** — resource utilization (CPU, memory, disk)

### SRE Metrics (SLI/SLO/SLA)

- **SLI (Service Level Indicator):** actual measurement (e.g., 99.93% uptime)
- **SLO (Service Level Objective):** internal target (e.g., 99.95%)
- **SLA (Service Level Agreement):** contractual commitment (e.g., 99.9%)

**Error Budget:** `1 - SLO`

| SLO    | Monthly Downtime | Daily Downtime |
|--------|------------------|----------------|
| 99.9%  | 43m 49s          | 1m 26s         |
| 99.95% | 21m 54s          | 43s            |
| 99.99% | 4m 23s           | 8.6s           |

### Prometheus Queries (PromQL)

```promql
# Check service is up
up

# Request rate over 5 minutes
rate(http_requests_total[5m])

# Error rate
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))

# CPU usage by pod
sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)

# 95th percentile latency
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))

# Memory usage
container_memory_usage_bytes / 1024 / 1024
```

### Alerting Best Practices

- **Alert on symptoms**, not causes (user-facing impact)
- **Avoid alert fatigue**: tune thresholds, deduplicate, use aggregation
- **Link runbooks** in alert descriptions
- **Escalation paths**: L1 → L2 → L3 → on-call manager
- **Silence during maintenance windows**

### Log Analysis

```bash
# EFK/ELK pattern
# Search for errors in last hour
journalctl --since "1 hour ago" | grep -i error

# Count 5xx errors
grep "HTTP/1.1 5" /var/log/nginx/access.log | wc -l

# Slow queries
grep "slow query" /var/log/mysql/slow.log
```

---

## 🔄 5. CI/CD Pipeline Design

### Pipeline Stages

1. **Build** — compile, package (Docker image)
2. **Test** — unit tests, integration tests
3. **Scan** — security (SAST/DAST), dependency vulnerabilities
4. **Deploy to Staging** — automated
5. **Approval Gate** — manual review for production
6. **Deploy to Production** — canary or blue-green
7. **Monitor** — track metrics post-deploy

### Deployment Strategies

- **Rolling Update:** gradual replacement, zero downtime
- **Blue-Green:** switch traffic between two environments
- **Canary:** route small % of traffic to new version, monitor, then scale
- **Feature Flags:** toggle features without redeployment

### Example Jenkins Pipeline

```groovy
pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'docker build -t myapp:${GIT_COMMIT} .'
      }
    }
    stage('Test') {
      steps {
        sh 'pytest tests/'
      }
    }
    stage('Security Scan') {
      steps {
        sh 'trivy image --exit-code 0 myapp:${GIT_COMMIT}'
      }
    }
    stage('Deploy Staging') {
      steps {
        sh 'kubectl apply -f k8s/staging/'
      }
    }
    stage('Approve Production') {
      steps {
        input 'Deploy to production?'
      }
    }
    stage('Deploy Production') {
      steps {
        sh 'kubectl apply -f k8s/prod/'
      }
    }
  }
  post {
    failure {
      sh 'kubectl rollout undo deployment/myapp'
    }
  }
}
```

**Key Concepts:**
- **Continuous Delivery:** manual approval before prod
- **Continuous Deployment:** fully automated to prod
- **Rollback mechanism:** automated revert on failure
- **Quality gates:** must pass tests & scans to proceed

---

## 🚨 6. Incident Management

### Incident Response Process

1. **Detect** — monitoring alert fires
2. **Assess** — severity, impact (how many users?)
3. **Mitigate** — restore service quickly (rollback, scale, failover)
4. **Communicate** — status page, stakeholder updates
5. **Diagnose** — root cause analysis
6. **Resolve** — permanent fix
7. **Learn** — blameless postmortem

### Key Metrics

- **MTTD (Mean Time to Detect):** how fast you notice
- **MTTR (Mean Time to Repair):** how fast you fix
- **MTBF (Mean Time Between Failures):** reliability measure

### Blameless Postmortem Template

```markdown
# Incident Summary
- **Date/Time:** 2025-10-27 14:32 UTC
- **Duration:** 23 minutes
- **Impact:** 15% of users saw 5xx errors
- **Severity:** P1 (customer-facing)

## Timeline
- 14:32 — alert fired (error rate > 5%)
- 14:35 — on-call engineer acknowledged
- 14:40 — identified root cause (DB connection pool exhausted)
- 14:45 — mitigation applied (increased pool size, restarted pods)
- 14:55 — error rate back to normal

## Root Cause
Database connection pool set to 10; traffic spike exceeded capacity.

## Resolution
- Immediate: increased pool to 50, restarted application pods
- Long-term: implement autoscaling based on connection pool saturation

## Action Items
- [ ] Add alert for connection pool usage (owner: Alice, due: Nov 3)
- [ ] Load test with 2x traffic (owner: Bob, due: Nov 10)
- [ ] Document runbook for DB connection issues (owner: Carol, due: Nov 5)

## Lessons Learned
- Connection pool monitoring was missing
- Need capacity planning for traffic spikes
```

**Pro Tip:** Focus on **system failures**, not individual blame. Culture of learning prevents recurrence.

---

## 🔐 7. Security in DevOps

### Security Scanning Types

- **SAST (Static):** analyze source code (SonarQube, Semgrep)
- **DAST (Dynamic):** runtime black-box testing (OWASP ZAP)
- **IAST (Interactive):** instrumented hybrid approach
- **Container Scanning:** Trivy, Grype, Clair
- **Dependency Scanning:** Snyk, Dependabot

### Best Practices

```bash
# Scan Docker image
trivy image --severity HIGH,CRITICAL myapp:latest

# Secrets scanning
git-secrets --scan

# Infrastructure security
tfsec .                  # Terraform security scanner
checkov -d .             # policy-as-code for IaC
```

- **Least privilege IAM:** minimal permissions needed
- **MFA everywhere:** especially production access
- **Rotate secrets regularly:** use Vault, AWS Secrets Manager
- **TLS everywhere:** mTLS in service mesh
- **Audit logs:** enable CloudTrail, audit logs
- **Network segmentation:** VPCs, security groups, firewalls

---

## 🧠 8. Interview Questions & Answers

### Q1: CI/CD Philosophy
**Q:** How do you balance deployment frequency with stability?  
**A:** Small, reversible changes; canary/blue-green deployments; feature flags; strong test automation; error budgets to limit rollout speed when SLOs are at risk.

**Q:** Continuous Delivery vs Continuous Deployment?  
**A:** Delivery = manual approval before prod; Deployment = fully automated to prod.

---

### Q2: Infrastructure as Code
**Q:** When choose Terraform over CloudFormation/ARM/Pulumi?  
**A:** Multi-cloud support, rich provider ecosystem, modularity, large community. Use native tools for single-cloud deep integration.

**Q:** How to handle secrets in IaC?  
**A:** Externalize via Vault/SOPS/KMS; pass references, not values; avoid storing in state; use CI secrets management.

---

### Q3: Monitoring & Observability
**Q:** Monitoring vs Observability?  
**A:** Monitoring = known failure symptoms; Observability = ability to understand unknown failures via metrics, logs, traces.

**Q:** How to determine SLIs for new service?  
**A:** Map critical user journeys → measure availability, latency, error rate, throughput.

---

### Q4: Incident Management
**Q:** MTTD / MTTR / MTBF differences?  
**A:** MTTD = detect; MTTR = repair; MTBF = time between failures.

**Q:** How to run blameless postmortems?  
**A:** Focus on timeline, contributing factors, systemic fixes; action items with owners; no personal blame; emphasize learning.

---

### Q5: Container Orchestration
**Q:** What problems does service mesh solve?  
**A:** Traffic control, retries/timeouts, circuit breaking, mTLS, fine-grained telemetry, canary/A-B routing.

**Q:** How to handle stateful workloads?  
**A:** Use StatefulSets + PVCs; stable network IDs; backup/restore; ordered rollout.

---

### Q6: Automation Strategy
**Q:** When is automation not worth it?  
**A:** Low frequency × low impact; unstable processes; unclear requirements; ROI negative.

**Q:** How to measure ROI of automation?  
**A:** (time_saved × frequency × defect_reduction) − build_cost. Track: deployment frequency, lead time, change fail rate, MTTR.

---

### Q7: Reliability Engineering
**Q:** How to calculate SLA/SLO budget?  
**A:** Error budget = 1 - SLO. Example: 99.9% monthly SLO = 43m 49s downtime allowed.

**Q:** Error budgets vs technical debt?  
**A:** Error budget = tolerated unreliability; tech debt = design shortcuts that slow change and increase risk.

---

### Q8: Security in DevOps
**Q:** Implement scanning without slowing deploys?  
**A:** Parallel scans, incremental scanning, shift-left (PR checks), cache results, block only on high severity.

**Q:** SAST / DAST / IAST?  
**A:** SAST = static source; DAST = black-box runtime; IAST = instrumented hybrid.

---

### Q9: Cultural Aspects
**Q:** Handle resistance to DevOps transformation?  
**A:** Quick wins, share metrics, pair with champions, train & document, iterate.

**Q:** DevOps vs SRE organizationally?  
**A:** DevOps = culture/collaboration; SRE = engineering implementation with reliability targets.

---

### Q10: Scaling Challenges
**Q:** Manage config drift across 1000+ servers?  
**A:** Declarative IaC, GitOps (Argo/Flux), immutable images, continuous drift detection.

**Q:** Multi-region deployment strategy?  
**A:** Global LB/Anycast, data replication/consistency, failover drills, region evacuation runbooks.

---

## 🧪 9. Hands-On Tasks

### T1: CI/CD Pipeline Design
**Goal:** Automate build/test/deploy for web app  
**Requirements:**
- Stages: build → test → security scan → deploy
- Canary or blue-green deployment
- Rollback on failure
- Approval for production

**Tools:** Jenkins, GitHub Actions, GitLab CI

---

### T2: Terraform IaC
**Goal:** Build modular cloud infrastructure  
**Requirements:**
- VPC, subnets, security groups, load balancer
- Reusable modules
- Remote backend (S3 + DynamoDB)
- Workspaces for dev/staging/prod

---

### T3: Monitoring & Alerting
**Goal:** Define metrics, build Grafana dashboards  
**Requirements:**
- SLIs/SLOs for availability, latency
- Alerts tuned to avoid fatigue
- Log aggregation with correlation IDs

**Tools:** Prometheus, Grafana, Loki/ELK

---

### T4: Incident Response
**Scenario:** 50% error rate during peak traffic  
**Tasks:**
- Write incident playbook
- Escalation path
- On-call strategy
- Communication channels (Slack, StatusPage)
- Post-incident review template

**SLA:** 99.9% uptime, MTTR < 30 minutes

---

### T5: Ansible Configuration Management
**Goal:** Automate application deployment  
**Requirements:**
- Role-based structure
- Inventory for multi-env
- Idempotency with check mode
- Secrets via Ansible Vault

---

## 🛠️ 10. Lab Environment Setup

### Local Stack (Docker-based)

```bash
# Monitoring stack
docker network create lab
docker run -d --name prometheus --network lab -p 9090:9090 prom/prometheus
docker run -d --name grafana --network lab -p 3000:3000 grafana/grafana

# Kubernetes
minikube start --memory=4096 --cpus=2
kubectl get nodes

# Terraform test
terraform init
terraform fmt && terraform validate && terraform plan

# Ansible dry-run
ansible-playbook -i inventories/dev hosts.yml --check
```

---

## 📚 11. Essential Tools

| Category | Tools |
|----------|-------|
| **CI/CD** | Jenkins, GitHub Actions, GitLab CI, Argo CD, Flux |
| **IaC** | Terraform, Ansible, Packer, CloudFormation |
| **Containers** | Docker, Kubernetes, Helm, Kustomize |
| **Monitoring** | Prometheus, Grafana, Alertmanager, Loki, ELK |
| **Cloud** | AWS, VMware VCF, Azure, GCP |
| **Security** | Vault, SOPS, Trivy, SonarQube, Checkov |
| **Debugging** | tcpdump, strace, perf, netshoot, curl |

---

## 💡 Interview Tips

1. **Explain your thinking:** "Logs → Metrics → Events → Config → Fix → Verify"
2. **Use STAR method:** Situation → Task → Action → Result
3. **Emphasize prevention:** automation, guardrails, monitoring
4. **Show curiosity:** "I build labs to simulate failures"
5. **Highlight collaboration:** work with Dev/QA/Product teams
6. **Quantify outcomes:** "Reduced MTTR by 40%, deployment frequency increased 3x"

---

## 🎯 Final Checklist for Interview

- [ ] Can explain SLI/SLO/SLA with examples
- [ ] Know Linux troubleshooting workflow
- [ ] Comfortable with kubectl, docker, terraform, ansible commands
- [ ] Can design CI/CD pipeline with rollback
- [ ] Understand monitoring golden signals
- [ ] Can describe incident response process
- [ ] Have real examples of automation/IaC work
- [ ] Familiar with container orchestration concepts
- [ ] Know security scanning types (SAST/DAST)
- [ ] Can discuss error budgets and postmortems

---

**Good luck with your interview! 🚀**

*This cheat sheet covers the core topics for Banfico SRE, VMware Cloud Foundation SRE, and similar Site Reliability / DevOps Engineer positions.*

