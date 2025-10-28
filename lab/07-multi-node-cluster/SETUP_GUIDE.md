# 🏗️ Multi-Node Cluster Setup Guide

## 📚 What We're Building

```
┌─────────────────────────────────────────────────────────┐
│    Network: 02-monitoring-stack_monitoring              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────┐  ┌────────────────────┐  │
│  │  NODE 1 (Existing ✅)    │  │  NODE 2 (New)      │  │
│  │                          │  │                    │  │
│  │  prometheus              │◄─┤  ubuntu-node       │  │
│  │  ├─ Port 9090            │  │  ├─ Port 2222      │  │
│  │  └─ Scrapes metrics      │  │  └─ SSH server     │  │
│  │                          │  │                    │  │
│  │  grafana                 │  │  node-exporter-2   │  │
│  │  └─ Port 3000            │  │  └─ Port 9101      │  │
│  │                          │  │                    │  │
│  │  alertmanager            │  │  Lab Tools:        │  │
│  │  └─ Port 9093            │  │  - curl, wget      │  │
│  │                          │  │  - vim, net-tools  │  │
│  │  node_exporter (host)    │  │  - procps          │  │
│  │  └─ Port 9100            │  │                    │  │
│  └──────────────────────────┘  └────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎓 Component Explanation

### **ubuntu-node**
**What:** Ubuntu 22.04 container simulating a separate server  
**Why:** Practice multi-node troubleshooting  
**Ports:**
- `2222` → SSH access (different from host's 22)
- `9101` → Node Exporter metrics

**Command explained:**
```bash
apt-get update                    # Update package lists
apt-get install -y curl wget vim  # Install basic tools
tail -f /dev/null                 # Keep container running
```

**Capabilities:**
- `SYS_ADMIN` - Needed for system monitoring
- `NET_ADMIN` - Needed for network diagnostics

---

### **node-exporter-2**
**What:** Prometheus exporter for system metrics  
**Why:** Send Ubuntu node's metrics to Prometheus  
**Special:** Uses `network_mode: "service:ubuntu-node"`
- Shares network namespace with ubuntu-node
- Can access ubuntu-node's processes/filesystem
- Exposes metrics on ubuntu-node's port 9101

---

### **Network: 02-monitoring-stack_monitoring**
**What:** Existing Docker bridge network  
**How:** `external: true` - uses existing network, doesn't create new one  
**DNS:** Containers can reach each other by name:
- `prometheus` → Prometheus container
- `ubuntu-node` → Ubuntu container
- Automatic service discovery!

---

## 🚀 Step-by-Step Deployment

### **Step 1: Verify Monitoring Stack is Running**

```powershell
cd C:\Users\JackSparrow\DEVOPSSRE\lab\02-monitoring-stack
docker-compose ps
```

**Expected output:**
```
NAME            STATUS          PORTS
prometheus      Up              0.0.0.0:9090->9090/tcp
grafana         Up              0.0.0.0:3000->3000/tcp
alertmanager    Up              0.0.0.0:9093->9093/tcp
node_exporter   Up              0.0.0.0:9100->9100/tcp
```

---

### **Step 2: Deploy Node 2**

```powershell
cd C:\Users\JackSparrow\DEVOPSSRE\lab\07-multi-node-cluster
docker-compose up -d
```

**What happens:**
1. Docker pulls Ubuntu 22.04 image
2. Creates `ubuntu-node` container
3. Attaches to existing `02-monitoring-stack_monitoring` network
4. Installs basic tools (curl, vim, etc.)
5. Starts node-exporter-2 alongside it

---

### **Step 3: Verify Node 2 is Running**

```powershell
docker ps | findstr ubuntu
```

**Expected:**
```
ubuntu-node          Up      0.0.0.0:2222->22/tcp, 0.0.0.0:9101->9100/tcp
node-exporter-2      Up      
```

---

### **Step 4: Test Network Connectivity**

From Node 1 (Prometheus) → Node 2 (Ubuntu):

```powershell
# Prometheus can reach ubuntu-node by DNS name
docker exec prometheus ping -c 3 ubuntu-node

# Check if Node Exporter is responding
docker exec prometheus curl -s http://ubuntu-node:9100/metrics | head -5
```

**Expected:** Should see metrics output!

From Node 2 (Ubuntu) → Node 1 (Prometheus):

```powershell
# Ubuntu can reach Prometheus
docker exec ubuntu-node curl -s http://prometheus:9090/-/healthy
```

**Expected:** `Prometheus is Healthy.`

---

### **Step 5: Update Prometheus Configuration**

Add ubuntu-node as scrape target:

```yaml
# Edit: lab/02-monitoring-stack/prometheus.yml

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['node_exporter:9100']
  
  # NEW: Add Node 2
  - job_name: 'ubuntu-node'
    static_configs:
      - targets: ['ubuntu-node:9100']
        labels:
          node: 'node-2'
          environment: 'lab'
```

**Reload Prometheus:**
```powershell
cd C:\Users\JackSparrow\DEVOPSSRE\lab\02-monitoring-stack
docker-compose restart prometheus
```

---

### **Step 6: Verify in Prometheus**

1. Open http://localhost:9090
2. Go to **Status** → **Targets**
3. Should see:
   - ✅ `prometheus` (UP)
   - ✅ `node_exporter` (UP)
   - ✅ `ubuntu-node` (UP) ← New!

---

### **Step 7: Create Multi-Node Dashboard in Grafana**

1. Open http://localhost:3000
2. Create new dashboard
3. Add panel with query:

**CPU comparison across nodes:**
```promql
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

**Memory comparison:**
```promql
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
```

You'll see metrics from **both nodes**! 🎉

---

## 🧪 Testing Multi-Node Setup

### **Test 1: Stress Node 2, Monitor from Node 1**

```powershell
# Create high CPU load on ubuntu-node
docker exec ubuntu-node sh -c "while true; do :; done" &

# Watch in Grafana - ubuntu-node CPU should spike!
# Alert should fire if > 80%
```

Stop it:
```powershell
docker exec ubuntu-node pkill -f "while true"
```

---

### **Test 2: Network Communication**

```powershell
# From ubuntu-node, query Prometheus
docker exec ubuntu-node curl http://prometheus:9090/api/v1/query?query=up

# From prometheus, check ubuntu-node metrics
docker exec prometheus curl http://ubuntu-node:9100/metrics
```

---

## 🎯 What You Just Built

✅ **Multi-node distributed system** (2 nodes)  
✅ **Cross-node monitoring** (Prometheus scrapes both)  
✅ **Service discovery** (containers find each other by DNS)  
✅ **Simulated production** (like AWS multi-AZ setup)  
✅ **Lab environment** for exercises  

---

## 🔍 Architecture Deep Dive

### **Why `network_mode: "service:ubuntu-node"`?**

**Normal setup:**
```
ubuntu-node:    10.0.1.5:9100  ← Has own network
node-exporter:  10.0.1.6:9100  ← Different IP
```

**Our setup (shared network):**
```
ubuntu-node + node-exporter:  10.0.1.5:9100  ← SAME IP!
```

**Benefit:** Node Exporter sees ubuntu-node's filesystem/processes directly!

---

### **Why External Network?**

```yaml
networks:
  02-monitoring-stack_monitoring:
    external: true  ← Don't create, use existing
```

**Without `external: true`:**
- Docker Compose would try to create new network
- Would fail (network already exists)

**With `external: true`:**
- Uses existing monitoring network
- Node 2 joins Node 1's network
- Seamless communication!

---

## 📚 Next Steps

1. ✅ **Verify setup** - all containers running
2. ✅ **Test connectivity** - ping between nodes
3. ✅ **Update Prometheus** - scrape Node 2
4. ✅ **Create dashboards** - multi-node view
5. 🚀 **Run exercises** - practice troubleshooting across nodes!

---

**Ready for exercises?** Let's test this cluster! 🎯

