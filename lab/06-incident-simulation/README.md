# 🚨 Incident Simulation Lab - Break Things & Fix Them!

Practice real-world troubleshooting scenarios under pressure.

## 🎯 Objective

Simulate production incidents, practice diagnosis, mitigation, and postmortem writing.

---

## 🔥 Scenario 1: High CPU Usage

### Setup
```bash
# Start monitoring stack first
cd ../02-monitoring-stack
docker-compose up -d

# Return to this directory
cd ../06-incident-simulation
```

### The Incident
**Time:** 14:32 UTC  
**Alert:** CPU usage > 80% for 5 minutes  
**Impact:** Application response time increased by 300%

### Your Mission (15 minutes)
1. Identify the process causing high CPU
2. Determine root cause
3. Apply mitigation
4. Write brief postmortem

### Break It
```bash
# Simulate CPU load
docker run -d --name cpu-hog alpine sh -c "while true; do :; done"
```

### Fix It
<details>
<summary>Solution (try yourself first!)</summary>

```bash
# 1. Identify
docker stats
top
htop

# 2. Find the container
docker ps | grep alpine

# 3. Check logs (if any)
docker logs cpu-hog

# 4. Mitigation
docker stop cpu-hog
docker rm cpu-hog

# 5. Verify
docker stats  # CPU should normalize
```

**Root Cause:** Infinite loop in container  
**Mitigation:** Stopped and removed problematic container  
**Prevention:** Add resource limits to all containers  

</details>

---

## 🔥 Scenario 2: Service Unreachable

### The Incident
**Time:** 09:15 UTC  
**Alert:** HTTP checks failing - `/api/health` returning 503  
**Impact:** 100% of users unable to access application

### Setup
```bash
# Deploy app
kubectl create deployment api --image=nginx:alpine
kubectl expose deployment api --port=80

# Break it
kubectl scale deployment api --replicas=0
```

### Your Mission (15 minutes)
1. Verify service is down
2. Check logs and events
3. Identify why no pods are running
4. Restore service
5. Implement prevention

### Fix It
<details>
<summary>Solution</summary>

```bash
# 1. Verify
kubectl get svc api
kubectl get pods -l app=api

# 2. Check deployment
kubectl describe deployment api

# 3. Root cause: scaled to 0 replicas
kubectl get deployment api -o yaml | grep replicas

# 4. Restore
kubectl scale deployment api --replicas=3

# 5. Verify recovery
kubectl get pods -w
kubectl logs deployment/api

# 6. Prevention
# - Add monitoring for replica count
# - Implement min replica policy
# - Add PodDisruptionBudget
```

**Postmortem Summary:**
- **Incident:** Service unreachable due to 0 replicas
- **Duration:** 15 minutes
- **Impact:** 100% downtime
- **Root Cause:** Manual scaling error or autoscaler issue
- **Action Items:** 
  - [ ] Add alert for replica count < 1
  - [ ] Implement PodDisruptionBudget
  - [ ] Review change control process

</details>

---

## 🔥 Scenario 3: Disk Space Critical

### The Incident
**Time:** 03:45 UTC (on-call page!)  
**Alert:** Disk usage > 95% on production server  
**Impact:** Application unable to write logs, database writes failing

### Setup
```bash
# Simulate (careful - don't fill your actual disk!)
# Create a large file in /tmp
dd if=/dev/zero of=/tmp/bigfile bs=1M count=1000
```

### Your Mission (20 minutes)
1. Check current disk usage
2. Identify what's consuming space
3. Clean up safely
4. Implement monitoring

### Fix It
<details>
<summary>Solution</summary>

```bash
# 1. Check disk space
df -h

# 2. Find large files
du -ah /tmp | sort -rh | head -20
du -ah /var | sort -rh | head -20

# 3. Investigate logs
du -sh /var/log/*
ls -lh /var/log/

# 4. Safe cleanup
# - Old logs
sudo journalctl --vacuum-time=7d

# - Docker
docker system df
docker system prune -a --volumes

# - Specific large file
rm /tmp/bigfile

# 5. Verify
df -h

# 6. Prevention
# - Set up log rotation
# - Add disk space alerts at 80%
# - Schedule regular cleanup jobs
# - Implement retention policies
```

**Prometheus Query for Monitoring:**
```promql
(node_filesystem_size_bytes - node_filesystem_avail_bytes) / node_filesystem_size_bytes * 100 > 80
```

</details>

---

## 🔥 Scenario 4: Memory Leak

### The Incident
**Time:** 11:20 UTC  
**Alert:** Memory usage climbing steadily, now at 90%  
**Impact:** Application performance degrading, risk of OOM kill

### Setup
```bash
# Simulate memory leak
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: memory-leak
spec:
  containers:
  - name: leaky
    image: polinux/stress
    command: ["stress"]
    args: ["--vm", "1", "--vm-bytes", "512M", "--vm-hang", "0"]
    resources:
      limits:
        memory: "1Gi"
EOF
```

### Your Mission (20 minutes)
1. Monitor memory usage in real-time
2. Identify the leaking process
3. Collect diagnostic data before restart
4. Apply mitigation
5. Plan long-term fix

### Fix It
<details>
<summary>Solution</summary>

```bash
# 1. Monitor
kubectl top pods
kubectl top nodes

# 2. Identify
kubectl get pod memory-leak
kubectl describe pod memory-leak

# 3. Collect diagnostics
kubectl logs memory-leak > incident_logs.txt
kubectl describe pod memory-leak > incident_describe.txt

# 4. Immediate mitigation
kubectl delete pod memory-leak

# 5. Verify
kubectl top nodes
free -mh

# 6. Long-term fixes
# - Add memory limits to all pods
# - Implement memory-based alerting
# - Profile application to find actual leak
# - Add health checks with memory thresholds
# - Consider horizontal scaling
```

**Resource Limits to Add:**
```yaml
resources:
  requests:
    memory: "128Mi"
  limits:
    memory: "256Mi"
```

</details>

---

## 🔥 Scenario 5: Network Connectivity Issue

### The Incident
**Time:** 14:50 UTC  
**Alert:** Database connection failures increasing  
**Impact:** 25% of requests failing

### Setup
```bash
# Deploy app and redis
kubectl create deployment app --image=redis:alpine
kubectl expose deployment app --port=6379 --name=redis

# Break networking
kubectl delete svc redis
```

### Your Mission (20 minutes)
1. Test connectivity
2. Check DNS resolution
3. Verify service endpoints
4. Restore connectivity
5. Add monitoring

### Fix It
<details>
<summary>Solution</summary>

```bash
# 1. Test from another pod
kubectl run debug --rm -it --image=alpine -- sh
# Inside pod:
ping redis  # Should fail
nslookup redis
wget -O- redis:6379
exit

# 2. Check service
kubectl get svc redis  # Not found!

# 3. Check endpoints
kubectl get endpoints redis  # None

# 4. Recreate service
kubectl expose deployment app --port=6379 --name=redis

# 5. Verify
kubectl run debug --rm -it --image=alpine -- sh
# Inside pod:
ping redis  # Should work
exit

# 6. Add monitoring
# - Service health checks
# - DNS resolution checks
# - Endpoint monitoring
```

**Prevention:**
- Infrastructure as Code (don't manually delete services)
- GitOps workflow
- Change control process
- Regular disaster recovery drills

</details>

---

## 🎯 Full Incident Response Exercise

### Scenario: Black Friday Outage

**Background:**  
Your e-commerce site is having its busiest day. At 10:00 AM, error rates spike.

**Initial Symptoms:**
- 50% of requests returning 500 errors
- Database connection pool exhausted
- API response time > 10 seconds (normally < 100ms)
- Customer complaints flooding support

**Your Role:** On-call SRE

**Timeline:**
- T+0: Alert fires
- T+2min: You acknowledge
- T+5min: You must have impact assessment
- T+15min: You must apply mitigation
- T+30min: Service must be restored
- T+24h: Postmortem due

### Exercise Steps

1. **Assess** (5 minutes)
   - What's the impact?
   - How many users affected?
   - What's the severity?

2. **Mitigate** (10 minutes)
   - Restore service ASAP
   - Don't worry about root cause yet
   - Options: rollback, scale, circuit breaker, failover

3. **Communicate** (during mitigation)
   - Update status page
   - Notify stakeholders
   - Set expectations

4. **Diagnose** (after service restored)
   - Find root cause
   - Collect evidence
   - Interview timeline

5. **Document** (postmortem)
   - Timeline with timestamps
   - Root cause analysis
   - Action items

### Postmortem Template

```markdown
# Incident Postmortem: [Title]

**Date:** YYYY-MM-DD  
**Duration:** Xh Ymin  
**Severity:** P1 (Critical) / P2 (High) / P3 (Medium)  
**Impact:** X% of users, $Y revenue impact

## Summary
[2-3 sentence overview]

## Timeline (all times UTC)
- 10:00 - Alert fired: error rate > 5%
- 10:02 - On-call acknowledged
- 10:05 - Identified DB connection pool exhaustion
- 10:10 - Scaled DB pool from 10 → 50
- 10:12 - Restarted application pods
- 10:15 - Error rate dropping
- 10:20 - Service restored to normal

## Root Cause
[Detailed technical explanation]

## Impact
- **Users:** 50% of traffic affected
- **Duration:** 20 minutes of degraded service
- **Revenue:** Estimated $X lost

## What Went Well
- Alert fired quickly
- Mitigation applied within 15 minutes
- Clear communication to stakeholders

## What Went Wrong
- No monitoring for DB connection pool
- No autoscaling configured
- Manual intervention required

## Action Items
- [ ] Add connection pool monitoring (Owner: Alice, Due: 2025-11-05)
- [ ] Implement autoscaling (Owner: Bob, Due: 2025-11-10)
- [ ] Load test with 2x traffic (Owner: Carol, Due: 2025-11-15)
- [ ] Update runbook (Owner: Dave, Due: 2025-11-03)

## Lessons Learned
[Key takeaways for the team]
```

---

## 📊 Incident Response Metrics

Track these during exercises:

| Metric | Target | Your Result |
|--------|--------|-------------|
| **MTTD** (Mean Time to Detect) | < 2 min | _____ |
| **MTTA** (Mean Time to Acknowledge) | < 5 min | _____ |
| **MTTM** (Mean Time to Mitigate) | < 15 min | _____ |
| **MTTR** (Mean Time to Recover) | < 30 min | _____ |
| **TTR** (Time to Postmortem) | < 48 hours | _____ |

---

## 🧠 Incident Commander Checklist

During a real incident:

- [ ] **Acknowledge** alert immediately
- [ ] **Assess** severity and impact
- [ ] **Communicate** - update status page, notify team
- [ ] **Delegate** - assign tasks if multiple people
- [ ] **Mitigate** - restore service first, diagnose later
- [ ] **Document** - keep timeline as you go
- [ ] **Verify** - confirm resolution
- [ ] **Monitor** - watch for recurrence
- [ ] **Postmortem** - schedule within 48 hours
- [ ] **Follow-up** - track action items

---

## 💡 Pro Tips

1. **Mitigation > Root Cause:** Restore service first, investigate later
2. **Document as you go:** Keep a running timeline
3. **Communicate proactively:** Update even if no progress
4. **Avoid blame:** Focus on systems, not people
5. **Practice regularly:** Muscle memory matters in crisis

---

## 🎓 Learning Objectives

After completing these scenarios, you should be able to:

✅ Triage and assess incident severity  
✅ Use monitoring tools to diagnose issues  
✅ Apply quick mitigation strategies  
✅ Communicate during incidents  
✅ Write clear postmortems  
✅ Identify prevention opportunities  
✅ Handle pressure and time constraints  

---

**Next:** Review the `SRE_DevOps_Interview_Cheat_Sheet.md` and practice interview questions! 🎯

