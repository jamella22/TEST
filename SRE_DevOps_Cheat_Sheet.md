## DevOps & SRE Master Cheat Sheet (Interview + Lab)

Purpose: Fast prep for Site Reliability / DevOps interviews. Use as a quick reference and lab guide.

---

### Core Linux & Troubleshooting
- CPU/memory: `top`, `htop`, `free -m`, `vmstat 1`, `sar`
- Disk: `df -h`, `du -ah / | sort -rh | head -50`, `iotop`
- Processes: `ps aux --sort=-%mem | head`, `nice/renice`, `kill -9 <pid>`
- Services & logs: `systemctl status <svc>`, `journalctl -u <svc> -f`, `dmesg -T`
- Networking: `ss -tulnp`, `sudo lsof -i :<port>`, `curl -vk`, `dig +trace <host>`, `traceroute`
- Files & perms: `stat <file>`, `ls -l`, `setfacl/getfacl`

Tips: Triangulate logs + metrics + service status. Reproduce, isolate, then verify fix.

---

### CI/CD Philosophy (Q1)
- Balance frequency vs stability: small, reversible changes; canary/blue‑green; feature flags; strong test pyramid; guarded rollouts using error budgets.
- Continuous Delivery vs Deployment: Delivery = manual approval to prod; Deployment = fully automated to prod.

---

### Infrastructure as Code (Q2)
- Terraform vs CloudFormation/ARM/Pulumi: choose Terraform for multi‑cloud, rich providers, modularity, and community. Prefer native stacks for single‑cloud deep features.
- Secrets in IaC: externalize via Vault/SOPS/KMS/SSM; pass references, not values; avoid state exposure; use CI secrets stores.

Basic Terraform flow:
```bash
terraform init && terraform validate
terraform plan -var-file=env/dev.tfvars
terraform apply -auto-approve -var-file=env/dev.tfvars
```

---

### Monitoring & Observability (Q3)
- Monitoring vs Observability: monitoring = known failure symptoms; observability = explain new/unknown failures using metrics+logs+traces.
- Choosing SLIs: map critical user journeys → availability, latency, error rate, throughput; include saturation (resource pressure).

Golden Signals: latency, traffic, errors, saturation.

PromQL snippets:
```promql
up
rate(http_requests_total[5m])
sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

---

### Incident Management (Q4)
- MTTD = detect, MTTR = recover, MTBF = time between failures.
- Blameless postmortems: focus on timeline, contributing factors, systemic fixes; action items with owners and due dates; no personal blame.

Incident flow: Detect → Mitigate → Communicate → Diagnose RCA → Prevent → Learn.

---

### Container Orchestration (Q5)
- What service mesh adds: traffic policies, retries/timeouts, circuit breaking, mTLS, fine‑grained telemetry, canary/AB routing.
- Stateful workloads: use StatefulSets + PVCs, stable network IDs, backup/restore, readiness/ordered rollout.

Kubernetes essentials:
```bash
kubectl get pods -A
kubectl describe pod <name>
kubectl logs <pod> -c <container>
kubectl scale deploy myapp --replicas=3
kubectl rollout undo deploy/myapp
```

---

### Automation Strategy (Q6)
- When not to automate: low frequency × low impact tasks; unstable processes; unclear requirements.
- ROI of automation: (time_saved × frequency × defect_reduction) − build/maintain cost; measure lead time, deployment freq, change fail rate, MTTR.

---

### Reliability Engineering (Q7)
- SLA (contract), SLO (target), SLI (measurement). Error budget = 1 − SLO.
- Error budget vs tech debt: budget = tolerated unreliability; tech debt = design/implementation shortcuts that slow change and raise risk.

Example: monthly SLO 99.9% → 43m 49s budget.

---

### Security in DevOps (Q8)
- Scan without slowing deploys: parallel/incremental scans, pre‑commit hooks, cache results, shift‑left with PR checks, block only on high severity.
- SAST vs DAST vs IAST: SAST=static source; DAST=black‑box runtime; IAST=instrumented runtime hybrid.


---

### Cultural Aspects (Q9)
- Handling resistance: demonstrate quick wins, share metrics, pair with champions, train & document, iterate.
- DevOps vs SRE org: DevOps = culture and collaboration; SRE = engineering implementation with reliability targets and error budgets.

---

### Scaling Challenges (Q10)
- Config drift at scale: declarative IaC, GitOps (Argo/Flux), immutable images, converge loops (Ansible/Puppet), continuous drift detection.
- Multi‑region: partition vs active‑active, global LB/Anycast, data replication/consistency, failover drills, region evacuation runbooks.

---

### Hands‑On Tasks (T1–T5)
- T1 CI/CD Pipeline: stages build→test→security scan→deploy; canary/blue‑green; rollback; prod approval; quality gates. Tools: Jenkins/GitHub Actions/GitLab CI.
- T2 Terraform IaC: VPC, subnets, SG, LB; reusable modules; remote backend & locking; variables/outputs; workspaces for envs.
- T3 Monitoring & Alerting: define SLIs/SLOs & error budgets; infra+app monitoring; alert thresholds sans fatigue; dashboards by audience; log aggregation.
- T4 Incident Response: playbook & escalation; on‑call rotation; comms plan; post‑incident review; runbooks for common failures; targets: 99.9% SLO, MTTR < 30m.
- T5 Ansible Config Mgmt: role‑based playbooks; inventories per env; idempotency & error handling; secrets via Ansible Vault; deploy Nginx/app.

---

### CI/CD Example Snippets
Jenkins (simplified):
```groovy
pipeline {
  agent any
  stages {
    stage('Build') { steps { sh 'docker build -t app:$(git rev-parse --short HEAD) .' } }
    stage('Test')  { steps { sh 'pytest -q' } }
    stage('Scan')  { steps { sh 'trivy image --exit-code 0 app:$(git rev-parse --short HEAD)' } }
    stage('Deploy Staging') { steps { sh 'kubectl apply -f k8s/staging/' } }
    stage('Approve Prod') { steps { input 'Deploy to production?' } }
    stage('Deploy Prod') { steps { sh 'kubectl apply -f k8s/prod/' } }
  }
}
```

---

### Ansible Skeleton
```yaml
- hosts: web
  become: true
  roles:
    - nginx
```

Vault secrets pattern: reference vaulted vars; avoid plaintext in repo.

---

### Kubernetes Stateful Example (skeleton)
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata: { name: redis }
spec:
  serviceName: redis
  replicas: 3
  selector: { matchLabels: { app: redis } }
  template:
    metadata: { labels: { app: redis } }
    spec:
      containers:
        - name: redis
          image: redis:7
          volumeMounts: [{ name: data, mountPath: /data }]
  volumeClaimTemplates:
    - metadata: { name: data }
      spec:
        accessModes: ["ReadWriteOnce"]
        resources: { requests: { storage: 5Gi } }
```

---

### Lab Quickstart (Local)
- Monitoring stack (example):
```bash
docker network create lab || true
docker run -d --name prometheus --network lab -p 9090:9090 prom/prometheus
docker run -d --name grafana     --network lab -p 3000:3000 grafana/grafana
```
- Minikube cluster:
```bash
minikube start --memory=4096 --cpus=2
kubectl get nodes
```
- Terraform workflow:
```bash
terraform fmt && terraform validate && terraform plan
```
- Ansible dry‑run:
```bash
ansible-playbook -i inventories/dev hosts.yml --check
```

---

### SRE Concepts Quick Reference
- Error Budget math: monthly 99.9% = ~43m 49s; 99.95% = ~21m 54s; 99.99% = ~4m 23s.
- Alerting: page on symptom (user impact), ticket on cause; deduplicate & route; quiet hours policies; runbooks linked in alerts.
- Comms during incident: single channel, designated incident commander, timestamped updates, stakeholder broadcast cadence.

---

### Security Essentials
- Least‑privilege IAM, MFA, short‑lived creds, rotated secrets.
- SBOM + container scanning (Trivy/Grype). Sign images (cosign). Policy as code (OPA/Gatekeeper).
- TLS everywhere, mTLS in mesh; audit logs enabled.

---

### Useful Tools
- Metrics/Logs: Prometheus, Grafana, Alertmanager, Loki/ELK
- IaC/CM: Terraform, Ansible, Packer, Helm, Kustomize
- CI/CD: Jenkins, GitHub Actions, GitLab CI, Argo CD, Flux
- Debug: `tcpdump`, `iftop`, `strace`, `perf`, `netshoot`

---

### Interview Tips
- Explain thought process: "Logs → Metrics → Events → Config → Fix → Verify".
- Use STAR for stories; quantify outcomes (MTTR reduction, error rate drop).
- Emphasize prevention (automation, guardrails) over heroics.
