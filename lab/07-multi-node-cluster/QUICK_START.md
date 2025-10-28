# ⚡ Quick Start - Multi-Node Cluster

## 🚀 Deploy in 5 Minutes

### **Step 1: Start Node 2**

```powershell
cd C:\Users\JackSparrow\DEVOPSSRE\lab\07-multi-node-cluster
docker-compose up -d
```

Wait 30 seconds for startup...

---

### **Step 2: Verify**

```powershell
docker ps | findstr ubuntu
```

Should see: `ubuntu-node` and `node-exporter-2` running!

---

### **Step 3: Install Tools on Ubuntu Node**

```powershell
docker exec ubuntu-node bash /scripts/install-tools.sh
```

---

### **Step 4: Test Connectivity**

```powershell
# Can Node 2 reach Prometheus?
docker exec ubuntu-node curl -s http://prometheus:9090/-/healthy

# Can Prometheus reach Node 2?
docker exec prometheus curl -s http://ubuntu-node:9100/metrics | head -10
```

---

### **Step 5: Update Prometheus Config**

Open `lab/02-monitoring-stack/prometheus.yml` and add:

```yaml
  - job_name: 'ubuntu-node'
    static_configs:
      - targets: ['ubuntu-node:9100']
        labels:
          node: 'node-2'
```

Restart Prometheus:
```powershell
cd C:\Users\JackSparrow\DEVOPSSRE\lab\02-monitoring-stack
docker-compose restart prometheus
```

---

### **Step 6: Check Prometheus Targets**

Open: http://localhost:9090/targets

You should see **ubuntu-node** as a new target (UP)! ✅

---

## 🎯 You're Ready!

Your multi-node cluster is running!

**Next:**
- Run Linux exercises on ubuntu-node
- Practice cross-node troubleshooting
- Simulate multi-node incidents

---

## 🛠️ Common Commands

```powershell
# Enter ubuntu-node shell
docker exec -it ubuntu-node bash

# Check ubuntu-node logs
docker logs ubuntu-node

# Restart ubuntu-node
docker-compose restart ubuntu-node

# Stop cluster
docker-compose down

# Start cluster
docker-compose up -d
```

---

## 📊 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Prometheus | http://localhost:9090 | Metrics & Targets |
| Grafana | http://localhost:3000 | Dashboards |
| Alertmanager | http://localhost:9093 | Alerts |
| Node 2 Metrics | http://localhost:9101/metrics | Ubuntu node metrics |

---

**Ready to run exercises!** 🎉

