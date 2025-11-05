# ⚡ Quick Start Guide

Бързо начало за подготовка за SRE интервю.

---

## 🚀 За напреднали (искам да започна веднага!)

```bash
# 1. Отиди в lab директорията
cd /workspace/sre-interview-prep

# 2. Стартирай monitoring stack
cd monitoring
docker-compose up -d

# 3. Отвори в браузър
# Grafana: http://localhost:3000 (admin/admin)
# Prometheus: http://localhost:9090
# Sample App: http://localhost:8081

# 4. Започни да експериментираш!
```

---

## 📚 За начинаещи (водете ме стъпка по стъпка)

### Ден 1: Запознаване
1. Прочети **README.md** в основната директория
2. Прегледай **CHEAT-SHEET.md** - това е твоята библия
3. Прочети **JOB-DESCRIPTIONS.md** за Banfico и VMware

### Ден 2: Monitoring Setup
1. `cd monitoring`
2. `docker-compose up -d`
3. Следвай **monitoring/README.md** упражненията
4. Направи първия си Grafana dashboard

### Ден 3: Linux Troubleshooting
1. Прочети **linux/EXERCISES.md**
2. Практикувай commands в terminal или Docker container
3. Симулирай проблеми и ги оправяй

### Ден 4: Kubernetes
1. Инсталирай Minikube: `minikube start`
2. Следвай **containers/KUBERNETES-EXERCISES.md**
3. Deploy първото си приложение

### Ден 5: Infrastructure as Code
1. Прочети **iac/TERRAFORM-ANSIBLE-EXERCISES.md**
2. Напиши първия си Terraform config
3. Създай Ansible playbook

### Ден 6-7: Interview Questions
1. Прочети **interview-prep/INTERVIEW-QUESTIONS.md**
2. Практикувай отговори на глас
3. Подготви примери от опита си (STAR method)

---

## 🎯 Препоръчителен Plan за 2 седмици

### Седмица 1: Основи

| Ден | Фокус | Време | Задачи |
|-----|-------|-------|--------|
| 1 | Orientation | 2h | Прегледай структурата, прочети README-та |
| 2 | Monitoring | 3h | Setup stack, направи dashboards |
| 3 | Linux | 3h | Упражнения 1-5 от linux/EXERCISES.md |
| 4 | Linux | 3h | Упражнения 6-10, симулирай инциденти |
| 5 | Kubernetes | 4h | Setup Minikube, упражнения 1-5 |
| 6 | Kubernetes | 3h | Упражнения 6-10 |
| 7 | Review | 2h | Повтори cheat sheet, прави notes |

### Седмица 2: Advanced + Interview Prep

| Ден | Фокус | Време | Задачи |
|-----|-------|-------|--------|
| 8 | IaC | 3h | Terraform exercises |
| 9 | IaC | 3h | Ansible exercises |
| 10 | Integration | 4h | Свържи Terraform + Ansible + K8s |
| 11 | Interview Q&A | 3h | Прочети въпроси, подготви отговори |
| 12 | Mock Interview | 2h | Practice на глас, запиши се |
| 13 | Incident Sim | 3h | Симулирай сложен инцидент, документирай |
| 14 | Final Review | 2h | Cheat sheet, key concepts, relaxation |

---

## ⚡ 1-Hour Crash Course (имам интервю утре!)

### Минута 0-15: Cheat Sheet Review
- Отвори **CHEAT-SHEET.md**
- Фокус на секции 1 (Linux), 3 (Kubernetes), 4 (Monitoring)
- Запомни key commands

### Минута 15-30: Interview Questions
- Отвори **INTERVIEW-QUESTIONS.md**
- Прочети Q1-Q15 (basics + behavioral)
- Подготви 2-3 примера от опита си

### Минута 30-45: Monitoring Stack
```bash
cd monitoring && docker-compose up -d
# Отвори Prometheus + Grafana
# Направи 2-3 прости queries
```

### Минута 45-55: Kubernetes Quick Review
```bash
# Key commands
kubectl get pods
kubectl describe pod <name>
kubectl logs <name>
kubectl exec -it <name> -- sh
```

### Минута 55-60: Breathing & Confidence
- Прочети Job Description отново
- Reminder: Explain your thinking process
- You know this stuff! 💪

---

## 🎓 По теми (избери според интервюто)

### За Banfico (SRE Support)
**Приоритети:**
1. ⭐⭐⭐ Linux troubleshooting
2. ⭐⭐⭐ Monitoring (Prometheus/Grafana)
3. ⭐⭐⭐ Incident response
4. ⭐⭐ Kubernetes basics
5. ⭐⭐ Customer communication

**Файлове:**
- `linux/EXERCISES.md` (Exercises 1-4, 9)
- `monitoring/README.md` (Exercises 1-6)
- `CHEAT-SHEET.md` (Sections 1, 4, 5)
- `INTERVIEW-QUESTIONS.md` (Q9-Q13, Q23-Q26)

### За VMware (Senior/Lead SRE)
**Приоритети:**
1. ⭐⭐⭐ VMware VCF architecture
2. ⭐⭐⭐ Infrastructure as Code
3. ⭐⭐⭐ Leadership examples
4. ⭐⭐ Enterprise reliability (HA/DR)
5. ⭐⭐ Solution design

**Файлове:**
- `iac/TERRAFORM-ANSIBLE-EXERCISES.md` (All)
- `CHEAT-SHEET.md` (Sections 2, 7, 10)
- `INTERVIEW-QUESTIONS.md` (Q13-Q15, Q29-Q30)
- Research VMware VCF architecture online

---

## 🔥 Daily 15-Minute Drills

Practice these every day leading up to interview:

### Monday: Linux
```bash
# Speed drill:
1. Find top 5 CPU processes
2. Check memory usage
3. Find files > 100MB
4. Check nginx service status and logs
```

### Tuesday: Kubernetes
```bash
# Speed drill:
1. Create deployment with 3 replicas
2. Scale to 5
3. Check logs of a pod
4. Expose as service
```

### Wednesday: Monitoring
```bash
# Speed drill:
1. Open Prometheus
2. Write 3 PromQL queries
3. Create alert rule
4. Build simple Grafana panel
```

### Thursday: IaC
```bash
# Speed drill:
1. Write Terraform resource
2. terraform plan
3. Write Ansible task
4. ansible-playbook --check
```

### Friday: Interview Questions
```bash
# Speed drill:
1. Explain SLA/SLO/SLI (1 min)
2. Describe incident you resolved (2 min)
3. Explain monitoring strategy (1 min)
```

---

## 🧠 Mental Preparation

### Before Interview
- [ ] Sleep well (7-8 hours)
- [ ] Review cheat sheet one more time
- [ ] Prepare 2-3 examples from your experience
- [ ] Prepare questions to ask them
- [ ] Test your mic/camera (if remote)

### During Interview
- ⏸️ **Pause before answering** - think for 2-3 seconds
- 📢 **Speak clearly** - especially technical terms
- 🧭 **Explain your process** - "First I'd check X, then Y..."
- 🤔 **It's OK to say "I don't know"** - be honest
- 💬 **Ask clarifying questions** - shows critical thinking

### After Interview
- 📝 **Take notes** - what went well, what to improve
- ✉️ **Send thank you email** - within 24 hours
- 🧘 **Relax** - you did your best!

---

## 📱 Quick Reference Card

Print this or keep on phone:

```
=== LINUX QUICK COMMANDS ===
CPU: top, htop
Memory: free -m
Disk: df -h, du -sh /*
Logs: journalctl -u service
Ports: ss -tulpn
Processes: ps aux

=== KUBERNETES QUICK ===
Status: kubectl get pods
Debug: kubectl describe pod X
Logs: kubectl logs X
Shell: kubectl exec -it X -- sh
Scale: kubectl scale deployment X --replicas=3

=== PROMETHEUS QUICK ===
Uptime: up
CPU: rate(cpu[5m])
Memory: node_memory_MemAvailable_bytes
Request rate: rate(http_requests_total[5m])

=== INTERVIEW TIPS ===
1. STAR method for examples
2. Explain thinking process
3. Ask clarifying questions
4. Mention automation mindset
5. Show collaboration skills
```

---

## 🆘 Troubleshooting This Lab

### Docker не работи?
```bash
# Linux
sudo systemctl start docker
docker ps

# If "permission denied"
sudo usermod -aG docker $USER
# Logout and login again
```

### Monitoring stack не стартира?
```bash
cd monitoring
docker-compose down
docker-compose up -d
docker-compose ps  # Check status
docker-compose logs  # Check errors
```

### Minikube проблеми?
```bash
minikube delete
minikube start --memory=4096 --cpus=2
minikube status
```

---

## 📞 Next Steps

1. **Start now** - Don't wait for "perfect time"
2. **Practice daily** - Even 15 minutes helps
3. **Simulate incidents** - Break things, fix things
4. **Explain out loud** - Pretend you're teaching
5. **Ask for feedback** - From friends, colleagues

---

**You got this!** 💪🚀

Помни: SRE интервюта не са само за техническо знание.
Показваш **процес на мислене**, **collaboration**, и **ownership mindset**.

Good luck! 🎯
