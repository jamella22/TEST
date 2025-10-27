# 📊 Monitoring Stack Lab

Complete Prometheus + Grafana + Alertmanager setup for practicing observability.

## 🚀 Quick Start

### 1. Start the Stack

```bash
cd lab/02-monitoring-stack
docker-compose up -d
```

### 2. Access Services

- **Prometheus:** http://localhost:9090
- **Grafana:** http://localhost:3000 (admin/admin)
- **Alertmanager:** http://localhost:9093
- **Node Exporter:** http://localhost:9100/metrics
- **cAdvisor:** http://localhost:8080
- **Sample App:** http://localhost:8888

### 3. Verify Everything is Running

```bash
docker-compose ps
```

All services should show "Up" status.

---

## 📚 Exercises

### Exercise 1: Explore Prometheus

1. Open http://localhost:9090
2. Try these queries:

```promql
# Check all targets are up
up

# CPU usage
rate(node_cpu_seconds_total[5m])

# Memory usage
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100

# Container CPU usage
rate(container_cpu_usage_seconds_total[5m])

# Network traffic
rate(node_network_receive_bytes_total[5m])
```

3. Go to **Status → Targets** to see all scraped endpoints

---

### Exercise 2: Build Grafana Dashboard

1. Open http://localhost:3000
2. Login with `admin` / `admin`
3. Add Prometheus data source:
   - **Configuration** → **Data Sources** → **Add data source**
   - Select **Prometheus**
   - URL: `http://prometheus:9090`
   - Click **Save & Test**

4. Create a dashboard:
   - Click **+** → **Dashboard** → **Add new panel**
   - Try these queries:

**CPU Usage Panel:**
```promql
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

**Memory Usage Panel:**
```promql
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
```

**Disk Usage Panel:**
```promql
(node_filesystem_size_bytes - node_filesystem_avail_bytes) / node_filesystem_size_bytes * 100
```

**Network Traffic Panel:**
```promql
rate(node_network_receive_bytes_total[5m])
rate(node_network_transmit_bytes_total[5m])
```

---

### Exercise 3: Set Up Alerts

Create `alerts.yml` in this directory:

```yaml
groups:
  - name: system_alerts
    interval: 30s
    rules:
      - alert: HighCPUUsage
        expr: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is above 80% for 2 minutes"

      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 90
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High memory usage detected"
          description: "Memory usage is above 90%"

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 < 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Disk space running low"
          description: "Less than 10% disk space available"

      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "{{ $labels.job }} has been down for more than 1 minute"
```

Uncomment the `rule_files` section in `prometheus.yml`:
```yaml
rule_files:
  - "alerts.yml"
```

Reload Prometheus:
```bash
docker-compose restart prometheus
```

Check alerts at: http://localhost:9090/alerts

---

### Exercise 4: Simulate Issues

#### Test 1: Generate CPU Load
```bash
# On Linux/Mac
docker run --rm -it alpine sh -c "while true; do :; done"
```

Watch CPU metrics spike in Grafana!

#### Test 2: Stop a Service
```bash
docker-compose stop sample_app
```

Check:
- Prometheus Targets page should show `sample_app` down
- Alert should fire if configured

Restore:
```bash
docker-compose start sample_app
```

#### Test 3: Generate Network Traffic
```bash
# Continuous requests to sample app
while true; do curl -s http://localhost:8888 > /dev/null; sleep 0.1; done
```

Watch network metrics increase!

---

### Exercise 5: Export & Import Dashboard

**Export:**
1. In Grafana, open your dashboard
2. Click the **Share** icon → **Export** → **Save to file**

**Import:**
1. **Dashboards** → **Import**
2. Upload JSON file or paste content
3. Select Prometheus data source
4. Click **Import**

---

## 🎯 Challenge Tasks

### Task 1: Create Golden Signals Dashboard

Build a dashboard tracking the 4 golden signals:

1. **Latency** (response time)
2. **Traffic** (requests per second)
3. **Errors** (error rate %)
4. **Saturation** (CPU, memory, disk %)

### Task 2: Multi-Target Monitoring

Add more services to monitor:
- Deploy another container (e.g., Redis, PostgreSQL)
- Add it to `prometheus.yml`
- Create specific dashboard for it

### Task 3: Alert Integration

Configure Alertmanager to send alerts to:
- Slack webhook
- Email
- Custom webhook endpoint

### Task 4: Custom Exporter

Write a simple Python exporter:

```python
from prometheus_client import start_http_server, Gauge
import random
import time

# Create a metric
app_requests = Gauge('app_requests_total', 'Total app requests')

def collect_metrics():
    while True:
        # Simulate metric
        app_requests.set(random.randint(100, 1000))
        time.sleep(5)

if __name__ == '__main__':
    start_http_server(8000)
    collect_metrics()
```

Run it, add to Prometheus config, and visualize in Grafana.

---

## 🧹 Cleanup

```bash
# Stop all services
docker-compose down

# Remove volumes (data will be lost)
docker-compose down -v
```

---

## 📖 Key Learnings

✅ How to deploy a full monitoring stack  
✅ Writing PromQL queries  
✅ Building Grafana dashboards  
✅ Configuring alerts  
✅ Troubleshooting with metrics  
✅ Understanding observability concepts  

---

## 🔗 Useful Resources

- [Prometheus Query Examples](https://prometheus.io/docs/prometheus/latest/querying/examples/)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/)
- [Node Exporter Metrics](https://github.com/prometheus/node_exporter)

---

**Next:** Move to `03-kubernetes` for container orchestration! 🚢

