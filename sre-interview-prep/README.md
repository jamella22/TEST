# 🚀 SRE Interview Preparation Lab

Пълна подготовка за **Site Reliability Engineer** интервю в **Banfico** и VMware Cloud Foundation позиции.

## 📋 Съдържание

### 1. **Interview Prep** - Въпроси и отговори за интервю
- Концептуални въпроси (CI/CD, IaC, Monitoring, Incident Management)
- Примерни отговори за Banfico SRE позицията
- VMware VCF специфични въпроси

### 2. **Cheat Sheet** - Технически наръчник
- Linux команди за troubleshooting
- Kubernetes операции
- Prometheus/Grafana queries
- Terraform & Ansible примери

### 3. **Lab Exercises** - Практически задачи
- **Linux** - Системно администриране и troubleshooting
- **Containers** - Docker и Kubernetes упражнения
- **Monitoring** - Prometheus + Grafana + Loki stack
- **IaC** - Terraform и Ansible автоматизация
- **Incidents** - Симулации на production проблеми

### 4. **Job Descriptions** - Информация за позициите
- Banfico: Site Reliability & L3 Support Engineer
- VMware: Senior/Lead Site Reliability Engineer

## 🎯 Позиции

### Banfico - Site Reliability & L3 Support Engineer
- **Технологии**: AWS, Kubernetes/OpenShift, Prometheus, Grafana, Ansible, Terraform
- **Фокус**: FinTech SaaS платформа (200+ банки клиенти)
- **Роля**: L2/L3 Support + Site Reliability

### VMware - Senior/Lead SRE
- **Технологии**: VMware VCF, vSphere, vSAN, NSX, Terraform, Kubernetes
- **Фокус**: Enterprise cloud infrastructure
- **Роля**: Design + Implementation + Leadership

## 🛠️ Quick Start

### 1. Стартиране на Monitoring Stack
```bash
cd monitoring
docker-compose up -d
```

Достъп:
- Grafana: http://localhost:3000 (admin/admin)
- Prometheus: http://localhost:9090
- Loki: http://localhost:3100

### 2. Kubernetes Lab (Minikube)
```bash
cd containers
minikube start --memory=4096
kubectl apply -f k8s-examples/
```

### 3. Terraform Lab
```bash
cd iac/terraform
terraform init
terraform plan
terraform apply
```

### 4. Ansible Lab
```bash
cd iac/ansible
ansible-playbook -i inventory.ini site.yml --check
```

## 📚 Подготовка по теми

### Week 1: Linux & Troubleshooting
- [ ] Мониторинг команди (top, htop, iostat, vmstat)
- [ ] Log analysis (journalctl, grep, awk)
- [ ] Network debugging (ss, lsof, netstat, tcpdump)

### Week 2: Containers & Orchestration
- [ ] Docker basics и troubleshooting
- [ ] Kubernetes deployments и scaling
- [ ] Pod debugging и logs

### Week 3: Infrastructure as Code
- [ ] Terraform modules и state management
- [ ] Ansible playbooks и roles
- [ ] GitOps principles

### Week 4: Monitoring & SRE
- [ ] Prometheus queries (PromQL)
- [ ] Grafana dashboards
- [ ] SLI/SLO/SLA definitions
- [ ] Incident response procedures

## 🎤 Interview Tips

1. **STAR Method** - Structure → Task → Action → Result
2. **Explain thinking process** - "First I'd check logs, then metrics..."
3. **Mention automation** - Don't just fix, automate prevention
4. **Show collaboration** - Work with Dev/QA/Product teams
5. **Ask smart questions** - About tech stack, on-call, team structure

## 📞 Контакти и следващи стъпки

- [ ] Практикувай всички lab exercises
- [ ] Прегледай cheat sheet преди интервю
- [ ] Подготви примери от минал опит (STAR format)
- [ ] Подготви въпроси за интервюиращия

---

**Забележка**: Този lab е оптимизиран за локална работа с Docker и Minikube. Не изисква cloud account за основните упражнения.
