# 📊 Monitoring Stack Lab

Пълен monitoring stack с Prometheus, Grafana, Loki и Alertmanager за SRE подготовка.

## 🚀 Quick Start

### Стартиране на stack
```bash
cd monitoring
docker-compose up -d
```

### Проверка на статус
```bash
docker-compose ps
```

### Достъп до услугите

| Service | URL | Credentials | Purpose |
|---------|-----|-------------|---------|
| **Grafana** | http://localhost:3000 | admin / admin | Dashboards & Visualization |
| **Prometheus** | http://localhost:9090 | - | Metrics & PromQL Queries |
| **Alertmanager** | http://localhost:9093 | - | Alert Management |
| **Loki** | http://localhost:3100 | - | Log Aggregation |
| **cAdvisor** | http://localhost:8080 | - | Container Metrics |
| **Sample App** | http://localhost:8081 | - | Test Application |

## 📚 Exercises

### Exercise 1: Explore Prometheus
1. Отвори http://localhost:9090
2. Отиди в **Graph** таб
3. Изпълни следните queries:

```promql
# Check if all services are up
up

# CPU usage percentage
100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory usage percentage
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Container memory usage
sum(container_memory_usage_bytes{name!=""}) by (name)

# Request rate (if app has metrics)
rate(http_requests_total[5m])
```

4. Експериментирай с различни time ranges (5m, 1h, 1d)

### Exercise 2: Create Grafana Dashboard
1. Отвори http://localhost:3000
2. Login: `admin` / `admin` (ще поиска да смениш паролата)
3. Add Data Source:
   - Type: **Prometheus**
   - URL: `http://prometheus:9090`
   - Click **Save & Test**
4. Create New Dashboard:
   - Click **+ → Dashboard**
   - Add Panel
   - Query: `up` (shows service status)
   - Visualization: **Stat**
   - Title: "Services Status"
5. Add more panels:
   - CPU Usage
   - Memory Usage
   - Disk Usage

### Exercise 3: Test Alerts
1. Провери активни alerts в Prometheus:
   - http://localhost:9090/alerts
2. Симулирай high CPU:
```bash
# Run CPU stress (in a separate terminal)
docker run --rm --name stress -d progrium/stress --cpu 2 --timeout 300s
```
3. След 5 минути, провери дали `HighCPUUsage` alert се активира
4. Виж alert в Alertmanager: http://localhost:9093

### Exercise 4: Query Logs with Loki
1. Отвори Grafana → Explore
2. Select Data Source: **Loki** (ако не е добавен, добави като Prometheus)
3. Queries:
```logql
# All logs
{job="varlogs"}

# Filter by error
{job="varlogs"} |= "error"

# Filter by container
{container="prometheus"}

# Count log rate
rate({job="varlogs"}[5m])
```

### Exercise 5: Monitor Containers with cAdvisor
1. Отвори http://localhost:8080
2. Разгледай:
   - Docker Containers metrics
   - CPU, Memory, Network usage per container
3. Сравни с Prometheus queries за същите метрики

### Exercise 6: Simulate Incident
**Scenario**: Service goes down

1. Stop sample-app:
```bash
docker-compose stop sample-app
```

2. Наблюдавай:
   - Prometheus alert `ServiceDown` активиран ли е?
   - Alertmanager показва ли го?
   - Колко време мина до detection (MTTD)?

3. Restart service:
```bash
docker-compose start sample-app
```

4. Провери resolved alert

### Exercise 7: Create Custom Alert
1. Edit `prometheus/alerts.yml`
2. Добави нова alert:
```yaml
- alert: HighDiskUsage
  expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 < 10
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "Critical: Disk almost full"
    description: "Disk usage > 90% on {{ $labels.instance }}"
```

3. Reload Prometheus config:
```bash
docker-compose restart prometheus
```

4. Провери в http://localhost:9090/alerts

### Exercise 8: Practice PromQL
Отговори на следните въпроси с PromQL queries:

1. **Кой контейнер използва най-много памет?**
```promql
topk(5, container_memory_usage_bytes{name!=""})
```

2. **Какъв е average CPU usage за последните 15 минути?**
```promql
avg_over_time(100 - (avg (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)[15m:])
```

3. **Колко requests per second получава sample-app?**
```promql
rate(http_requests_total{job="sample-app"}[1m])
```

4. **P95 latency на requests?**
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

## 🧪 Advanced Exercises

### Exercise 9: Configure Slack Alerts (Optional)
1. Create Slack webhook URL
2. Edit `alertmanager/alertmanager.yml`:
```yaml
receivers:
  - name: 'slack-critical'
    slack_configs:
      - api_url: 'YOUR_WEBHOOK_URL'
        channel: '#alerts'
        title: 'Alert: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
```
3. Restart alertmanager:
```bash
docker-compose restart alertmanager
```

### Exercise 10: Multi-Service Dashboard
Create a comprehensive Grafana dashboard with:
- Row 1: Overall system health (CPU, Memory, Disk)
- Row 2: Container metrics (per container)
- Row 3: Alerts panel
- Row 4: Log stream from Loki

Use variables to filter by:
- Instance
- Container name
- Time range

## 🔧 Troubleshooting

### Logs не се показват в Loki?
```bash
# Check promtail logs
docker-compose logs promtail

# Check loki logs
docker-compose logs loki
```

### Prometheus не scrape-ва targets?
```bash
# Check targets status
# Open http://localhost:9090/targets

# Check prometheus logs
docker-compose logs prometheus
```

### Container не стартира?
```bash
# Check specific container logs
docker-compose logs <service-name>

# Check all containers status
docker-compose ps
```

## 📝 Interview Questions to Practice

Докато работиш с lab-а, мисли върху:

1. **Monitoring Strategy**:
   - Какви метрики избираш да следиш? Защо?
   - Как дефинираш SLI/SLO за този sample app?

2. **Alert Design**:
   - Кои alerts са най-важни?
   - Как избягваш alert fatigue?
   - Какви thresholds избираш?

3. **Incident Response**:
   - Ако service е down, какви са първите 3 неща, които проверяваш?
   - Как документираш incident?

4. **Automation**:
   - Как автоматизираш deployment на този monitoring stack?
   - Как управляваш configuration дрифт?

## 🧹 Cleanup

### Спиране на stack
```bash
docker-compose down
```

### Изтриване на data (да започнеш отначало)
```bash
docker-compose down -v
```

## 📚 Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [PromQL Cheat Sheet](https://promlabs.com/promql-cheat-sheet/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Loki LogQL](https://grafana.com/docs/loki/latest/logql/)

---

**Tip**: Използвай този lab за практика преди интервю. Симулирай инциденти, експериментирай с queries, и изгради muscle memory за troubleshooting! 🚀
