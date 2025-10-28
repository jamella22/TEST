# 🚀 Quick Start Guide - DevOps & SRE Lab

Get your lab environment running in 10 minutes!

## ⚡ Fastest Path to Running Lab

### Step 1: Prerequisites (5 min)

```bash
# Check if you have Docker
docker --version

# If not installed:
# macOS: brew install docker
# Linux: https://docs.docker.com/engine/install/
# Windows: Install Docker Desktop

# Check if you have docker-compose
docker-compose --version
```

---

### Step 2: Start Monitoring Stack (2 min)

```bash
# Navigate to monitoring lab
cd lab/02-monitoring-stack

# Start everything
docker-compose up -d

# Verify all services are running
docker-compose ps
```

**Access:**
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (login: admin/admin)
- Node Exporter: http://localhost:9100/metrics

---

### Step 3: Try Your First Query (1 min)

1. Open **Prometheus** at http://localhost:9090
2. Try this query:
   ```promql
   up
   ```
3. Click "Execute" - you should see all services showing `1` (up)

---

### Step 4: Build Your First Dashboard (2 min)

1. Open **Grafana** at http://localhost:3000
2. Login with `admin` / `admin`
3. **Configuration** → **Data Sources** → **Add data source**
4. Select **Prometheus**
5. URL: `http://prometheus:9090`
6. Click **Save & Test** ✅

7. Click **+** → **Dashboard** → **Add new panel**
8. Query: 
   ```promql
   100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
   ```
9. Title: "CPU Usage %"
10. Click **Apply**

**Congratulations!** 🎉 You just created a live CPU monitoring dashboard!

---

## 🎯 What to Do Next

### Path 1: Practice Linux Troubleshooting
```bash
cd lab/01-linux-troubleshooting
cat exercises.md
```

Try exercises 1-3 to practice system diagnostics.

---

### Path 2: Learn Kubernetes
```bash
# Install minikube
brew install minikube  # macOS
# or download from https://minikube.sigs.k8s.io/docs/start/

# Start cluster
minikube start --memory=4096 --cpus=2

# Deploy sample app
cd lab/03-kubernetes
kubectl apply -f microservices-app.yaml

# Check status
kubectl get all
```

Access the app:
```bash
minikube service frontend --url
```

---

### Path 3: Learn Infrastructure as Code
```bash
# Install Terraform
brew install terraform  # macOS

cd lab/04-terraform

# Try the Docker example
cat README.md  # Follow Exercise 1
```

---

### Path 4: Learn Configuration Management
```bash
# Install Ansible
brew install ansible  # macOS
pip3 install ansible  # Other

cd lab/05-ansible

# Run first playbook
ansible-playbook hello.yml
```

---

## 📊 Quick Reference: What Each Lab Teaches

| Lab | Topic | Time | Difficulty | Interview Focus |
|-----|-------|------|------------|-----------------|
| **01-linux** | System troubleshooting | 30min | ⭐ | L3 Support |
| **02-monitoring** | Observability & alerts | 45min | ⭐⭐ | SRE Core |
| **03-kubernetes** | Container orchestration | 60min | ⭐⭐⭐ | Cloud Native |
| **04-terraform** | Infrastructure as Code | 45min | ⭐⭐ | Automation |
| **05-ansible** | Config management | 45min | ⭐⭐ | Deployment |
| **06-incident** | Troubleshooting scenarios | 30min | ⭐⭐⭐ | Incident Response |

---

## 🎓 Recommended Learning Paths

### For Banfico L3 Support + SRE Role:
1. **Day 1:** Linux troubleshooting + Monitoring stack
2. **Day 2:** Kubernetes operations
3. **Day 3:** Terraform + Ansible basics
4. **Day 4:** Incident simulation
5. **Day 5:** Review cheat sheet + practice questions

### For VMware Senior SRE Role:
1. **Day 1:** Monitoring + Infrastructure concepts
2. **Day 2:** Terraform (IaC focus)
3. **Day 3:** Ansible automation
4. **Day 4:** Kubernetes + VMware concepts
5. **Day 5:** Leadership scenarios + technical design

---

## 🐛 Troubleshooting Lab Setup

### Monitoring Stack Won't Start
```bash
# Check Docker is running
docker ps

# Check ports aren't already in use
lsof -i :9090  # Prometheus
lsof -i :3000  # Grafana

# View logs
docker-compose logs prometheus
docker-compose logs grafana

# Restart everything
docker-compose down
docker-compose up -d
```

### Kubernetes Cluster Won't Start
```bash
# Check minikube status
minikube status

# Delete and recreate
minikube delete
minikube start --memory=4096 --cpus=2

# Check logs
minikube logs
```

### Permission Denied Errors (Ansible/Terraform)
```bash
# Run with sudo where needed
sudo ansible-playbook playbook.yml

# Fix Docker permissions (Linux)
sudo usermod -aG docker $USER
newgrp docker
```

---

## 🧹 Cleanup Everything

```bash
# Stop monitoring stack
cd lab/02-monitoring-stack
docker-compose down -v

# Stop Kubernetes
minikube stop
# or
kind delete cluster --name sre-lab

# Clean Terraform
cd lab/04-terraform
terraform destroy -auto-approve

# Remove Docker resources
docker system prune -a --volumes
```

---

## 📚 Resources

- **Cheat Sheet:** `../SRE_DevOps_Interview_Cheat_Sheet.md`
- **Lab README:** `lab/README.md`
- **Each lab has detailed exercises** in its own README.md

---

## 💡 Pro Tips

1. **Run labs in order** (01 → 02 → 03 → 04 → 05)
2. **Don't skip the monitoring stack** - it's crucial for SRE interviews
3. **Practice troubleshooting** by intentionally breaking things
4. **Time yourself** on incident scenarios
5. **Take notes** of commands you forget
6. **Create your own scenarios** after completing the labs

---

## 🎯 Interview Prep Checklist

Before your technical interview:

- [ ] Can deploy Prometheus + Grafana stack from memory
- [ ] Can write basic PromQL queries
- [ ] Can deploy and debug Kubernetes applications
- [ ] Can write Terraform configuration for basic infrastructure
- [ ] Can write Ansible playbook for web server deployment
- [ ] Can troubleshoot common Linux issues (CPU, memory, disk, network)
- [ ] Can explain SLI/SLO/SLA with examples
- [ ] Can describe incident response process
- [ ] Have 2-3 real troubleshooting stories ready
- [ ] Reviewed the cheat sheet at least twice

---

## 🚀 Ready to Start?

```bash
# Start with monitoring
cd lab/02-monitoring-stack
docker-compose up -d

# Open Prometheus
open http://localhost:9090

# Open Grafana
open http://localhost:3000
```

**Good luck! 🎉**

