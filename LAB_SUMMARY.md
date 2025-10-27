# 📦 DevOps & SRE Interview Preparation - Complete Package

## 📚 What You Have

### 1. **Comprehensive Cheat Sheet**
📄 `SRE_DevOps_Interview_Cheat_Sheet.md` (688 lines)
- Linux troubleshooting commands
- Cloud & IaC concepts (Terraform, Ansible)
- Kubernetes operations
- Monitoring & observability (Prometheus, Grafana)
- CI/CD pipeline design
- Incident management
- Security best practices
- 10 interview Q&A
- 5 hands-on task descriptions

### 2. **Complete Hands-On Lab Environment**
📁 `lab/` directory with 6 modules:

#### **Lab 01: Linux Troubleshooting**
- CPU/Memory analysis
- Disk space investigation
- Network debugging
- Log analysis
- Process management
- Performance monitoring

#### **Lab 02: Monitoring Stack** ⭐ Ready to Run!
- Docker Compose setup
- Prometheus + Grafana + Alertmanager
- Node Exporter + cAdvisor
- Pre-configured dashboards
- Alert rules examples
- **Start:** `cd lab/02-monitoring-stack && docker-compose up -d`

#### **Lab 03: Kubernetes**
- Minikube/kind setup
- Deploy microservices
- ConfigMaps & Secrets
- Debug CrashLoops
- Rolling updates & rollbacks
- StatefulSets & persistence
- Includes ready-to-deploy YAML

#### **Lab 04: Terraform (IaC)**
- Docker provider examples
- Variables & modules
- State management
- Workspaces
- AWS & VMware examples
- Best practices

#### **Lab 05: Ansible (Config Management)**
- Ad-hoc commands
- Playbooks & roles
- Templates (Jinja2)
- Ansible Vault for secrets
- Multi-environment deployments
- Full app deployment example

#### **Lab 06: Incident Simulation** 🚨
- High CPU scenarios
- Service unreachable
- Disk space critical
- Memory leaks
- Network connectivity
- Full Black Friday outage exercise
- Postmortem templates

### 3. **Quick Start Guide**
📄 `lab/QUICKSTART.md`
- 10-minute setup
- Learning paths for both positions
- Troubleshooting tips
- Interview prep checklist

---

## 🎯 How to Use This Package

### For Banfico Interview (L3 Support + SRE)
```bash
# Day 1-2: Core skills
cd lab/01-linux-troubleshooting
cd lab/02-monitoring-stack && docker-compose up -d

# Day 3-4: Container & automation
cd lab/03-kubernetes
cd lab/04-terraform

# Day 5: Incident response
cd lab/06-incident-simulation

# Day 6-7: Review
cat SRE_DevOps_Interview_Cheat_Sheet.md
```

### For VMware Interview (Senior SRE + VCF)
```bash
# Day 1: Monitoring & IaC
cd lab/02-monitoring-stack && docker-compose up -d
cd lab/04-terraform

# Day 2-3: Automation
cd lab/05-ansible
cd lab/03-kubernetes

# Day 4: Leadership & scenarios
cd lab/06-incident-simulation

# Day 5: Architecture review
cat SRE_DevOps_Interview_Cheat_Sheet.md
```

---

## ⚡ Quick Commands

### Start Everything
```bash
# Monitoring stack (localhost:9090, localhost:3000)
cd lab/02-monitoring-stack && docker-compose up -d

# Kubernetes cluster
minikube start --memory=4096 --cpus=2

# Deploy sample app
kubectl apply -f lab/03-kubernetes/microservices-app.yaml
```

### Stop Everything
```bash
# Stop monitoring
cd lab/02-monitoring-stack && docker-compose down

# Stop Kubernetes
minikube stop

# Clean Docker
docker system prune -a
```

---

## 📊 Coverage Map

| Interview Topic | Cheat Sheet | Lab Module | Ready? |
|----------------|-------------|------------|--------|
| Linux troubleshooting | ✅ | 01-linux | ✅ |
| Monitoring (Prometheus, Grafana) | ✅ | 02-monitoring | ✅ |
| Kubernetes operations | ✅ | 03-kubernetes | ✅ |
| Infrastructure as Code | ✅ | 04-terraform | ✅ |
| Configuration management | ✅ | 05-ansible | ✅ |
| Incident response | ✅ | 06-incident | ✅ |
| CI/CD concepts | ✅ | (examples in cheat sheet) | ✅ |
| Security (SAST/DAST/Vault) | ✅ | (integrated) | ✅ |
| SLI/SLO/SLA | ✅ | 02-monitoring | ✅ |
| Postmortem writing | ✅ | 06-incident | ✅ |

---

## 🎓 Skills You'll Master

### Technical Skills
- [x] Linux system administration & troubleshooting
- [x] Prometheus query language (PromQL)
- [x] Kubernetes operations (kubectl, debugging)
- [x] Terraform (HCL syntax, modules, state)
- [x] Ansible (playbooks, roles, vault)
- [x] Docker & containerization
- [x] Monitoring & alerting setup
- [x] Incident response process

### SRE Mindset
- [x] Observability over monitoring
- [x] Automation > manual toil
- [x] Blameless postmortems
- [x] Error budgets & SLOs
- [x] Prevention through engineering
- [x] Systems thinking

---

## 🏆 Interview Readiness Checklist

### Before Technical Interview:
- [ ] Can deploy Prometheus + Grafana from memory
- [ ] Can write 5+ PromQL queries
- [ ] Can debug Kubernetes CrashLoop
- [ ] Can write basic Terraform config
- [ ] Can write Ansible playbook for web server
- [ ] Can troubleshoot high CPU/memory/disk
- [ ] Can explain incident response process
- [ ] Have 2-3 real troubleshooting stories
- [ ] Reviewed cheat sheet 2x
- [ ] Completed at least 3 lab modules

### During Interview:
- [ ] Explain thinking process aloud
- [ ] Ask clarifying questions
- [ ] Start with logs/metrics/events
- [ ] Mention automation & prevention
- [ ] Use STAR method for stories
- [ ] Show curiosity about their stack
- [ ] Ask about on-call process
- [ ] Discuss error budgets/SLOs

---

## 🚀 Access From Anywhere

### GitHub Repository
Once committed, you can:
```bash
# From any machine
git clone <your-repo-url>
cd DEVOPSSRE

# Start labs immediately
cd lab/02-monitoring-stack
docker-compose up -d
```

### Just the Cheat Sheet
```bash
# View online (once pushed)
https://github.com/<your-username>/DEVOPSSRE/blob/main/SRE_DevOps_Interview_Cheat_Sheet.md

# Or download directly
curl -O https://raw.githubusercontent.com/<your-username>/DEVOPSSRE/main/SRE_DevOps_Interview_Cheat_Sheet.md
```

---

## 📞 Interview Prep Timeline

### 1 Week Before:
- [ ] Complete all 6 lab modules
- [ ] Read cheat sheet 2x
- [ ] Write your own troubleshooting stories
- [ ] Practice explaining technical concepts

### 3 Days Before:
- [ ] Run incident simulations (timed)
- [ ] Review company tech stack
- [ ] Prepare questions to ask them
- [ ] Test your webcam/audio setup

### 1 Day Before:
- [ ] Skim cheat sheet
- [ ] Review STAR stories
- [ ] Get good sleep
- [ ] Prepare workspace

### Day Of:
- [ ] Skim key commands
- [ ] Breathe & stay calm
- [ ] Think aloud during technical questions
- [ ] Have fun! 🎉

---

## 💡 Pro Tips

1. **Practice under pressure:** Set 15-minute timers for incident scenarios
2. **Break things intentionally:** Best way to learn troubleshooting
3. **Document your learning:** Keep notes of what you struggled with
4. **Use the cheat sheet during labs:** It's your reference guide
5. **Simulate interview conditions:** Practice explaining while doing

---

## 📁 File Structure

```
DEVOPSSRE/
├── SRE_DevOps_Interview_Cheat_Sheet.md    ⭐ Main reference (688 lines)
├── LAB_SUMMARY.md                          📋 This file
├── lab/
│   ├── README.md                           📖 Lab overview
│   ├── QUICKSTART.md                       ⚡ 10-min setup
│   ├── 01-linux-troubleshooting/
│   │   └── exercises.md
│   ├── 02-monitoring-stack/                🔥 Ready to run!
│   │   ├── docker-compose.yml
│   │   ├── prometheus.yml
│   │   ├── alertmanager.yml
│   │   └── README.md
│   ├── 03-kubernetes/
│   │   ├── microservices-app.yaml
│   │   └── README.md
│   ├── 04-terraform/
│   │   └── README.md
│   ├── 05-ansible/
│   │   └── README.md
│   └── 06-incident-simulation/
│       └── README.md
└── quiz/                                   (old - ignore)
```

---

## 🎯 Key Differentiators for Your Interview

What makes this prep special:

1. **Hands-on focus:** Not just theory, actual running systems
2. **Real scenarios:** Based on actual production incidents
3. **Both positions covered:** Banfico L3 Support + VMware Senior SRE
4. **Time-boxed exercises:** Simulate interview pressure
5. **Postmortem practice:** Critical for SRE roles
6. **Comprehensive:** Linux → K8s → IaC → Incident Response

---

## 🔗 Next Steps

1. **Commit to GitHub** (so you can access from laptop)
2. **Start with QUICKSTART.md**
3. **Work through labs 01 → 06**
4. **Review cheat sheet daily**
5. **Practice storytelling** (STAR method)
6. **Stay confident!** 💪

---

**You're ready to ace both interviews! 🚀**

*Banfico: L3 Support & Site Reliability Engineer*  
*VMware: Senior/Lead Site Reliability Engineer*

Good luck, Kiril! 🎉

