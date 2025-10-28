# 🌐 Multi-Node Cluster Lab

Learn distributed systems by building a 2-node cluster locally.

## 🎯 Architecture

```
┌─────────────────────────────────────────┐
│     Docker Bridge Network               │
│     (cluster-network)                   │
├─────────────────────────────────────────┤
│                                         │
│  NODE 1: Monitoring Hub                │
│  ├── Prometheus (scrapes metrics)      │
│  ├── Grafana (visualizes)              │
│  ├── Alertmanager (alerts)             │
│  └── Node Exporter (self-monitoring)   │
│                                         │
│  NODE 2: Lab Server                    │
│  ├── Ubuntu with systemd               │
│  ├── Node Exporter (metrics)           │
│  ├── SSH server                         │
│  └── Lab tools                          │
│                                         │
└─────────────────────────────────────────┘
```

## 📚 Learning Path

### **Module 1: Networking Basics**
- Understand Docker bridge networks
- Container-to-container DNS
- Port mapping vs internal networking

### **Module 2: Node 1 - Monitoring Hub**
- Deploy existing monitoring stack
- Configure for multi-node scraping
- Add service discovery

### **Module 3: Node 2 - Lab Server**
- Create Ubuntu "server" container
- Install Node Exporter
- Enable SSH access

### **Module 4: Connect the Nodes**
- Update Prometheus config
- Test connectivity
- View metrics from Node 2

### **Module 5: Ansible Automation**
- Install Ansible in container
- Write playbooks to configure nodes
- Automate deployment

### **Module 6: Advanced Exercises**
- Multi-node troubleshooting
- Distributed monitoring
- Cross-node incidents

---

## 🚀 Quick Start

We'll build this step by step. Each step has:
- 📖 Theory explanation
- 💻 Commands to run
- ✅ Verification steps
- 🎓 Interview questions

Ready to start with Module 1?

---

## 📁 Files in This Lab

- **docker-compose.yml** - Node 2 configuration
- **SETUP_GUIDE.md** - Detailed explanations (READ THIS FIRST!)
- **QUICK_START.md** - Fast deployment (5 minutes)
- **scripts/** - Helper scripts for ubuntu-node
- **exercises/** - Multi-node troubleshooting scenarios

---

## 🎓 Learning Objectives

After completing this lab, you'll understand:

✅ Docker bridge networking  
✅ Container-to-container DNS  
✅ Multi-node monitoring architecture  
✅ Service discovery  
✅ Distributed systems troubleshooting  
✅ Cross-node incident response  
✅ Prometheus federation concepts  

---

## 🚀 Get Started

1. **Read:** `SETUP_GUIDE.md` for deep understanding
2. **Deploy:** Follow `QUICK_START.md` (5 minutes)
3. **Practice:** Run exercises from Node 2
4. **Monitor:** Watch metrics in Grafana

---

**Let's build your distributed system!** 🌐

