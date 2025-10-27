# 🐧 Linux Troubleshooting Exercises

## Exercise 1: CPU & Memory Analysis

### Scenario
A web server is running slow. Identify which process is consuming resources.

### Tasks
```bash
# 1. Check overall CPU usage
top
# Press '1' to see per-core usage
# Press 'P' to sort by CPU
# Press 'M' to sort by memory

# 2. Find top 5 CPU consumers
ps aux --sort=-%cpu | head -6

# 3. Find top 5 memory consumers
ps aux --sort=-%mem | head -6

# 4. Check system load
uptime
# Load average: 1min, 5min, 15min

# 5. Detailed memory info
free -mh
vmstat 1 5
```

### Expected Output
- Identify the problematic process
- Determine if it's CPU or memory issue
- Calculate memory usage percentage

---

## Exercise 2: Disk Space Investigation

### Scenario
System alerts: "Disk space critically low"

### Tasks
```bash
# 1. Check disk usage
df -h

# 2. Find largest directories
du -ah / 2>/dev/null | sort -rh | head -20

# 3. Find large files over 500MB
find / -type f -size +500M -exec ls -lh {} \; 2>/dev/null

# 4. Check for deleted files still held by processes
lsof | grep deleted

# 5. Clean up (example)
# journalctl --vacuum-time=7d
# docker system prune -a
```

### Solution Checklist
- [ ] Identified the directory consuming most space
- [ ] Found files that can be safely deleted
- [ ] Cleaned up at least 1GB of space

---

## Exercise 3: Network Troubleshooting

### Scenario
Cannot reach a web service running on port 8080

### Tasks
```bash
# 1. Check if service is listening
ss -tulnp | grep 8080
# or
sudo lsof -i :8080

# 2. Test local connectivity
curl -v http://localhost:8080

# 3. Check firewall rules (Ubuntu/Debian)
sudo ufw status

# 4. Check if process is running
ps aux | grep <service-name>

# 5. Check service status
systemctl status <service>

# 6. View recent logs
journalctl -u <service> --since "10 min ago"

# 7. Test from another machine
# On remote machine:
telnet <server-ip> 8080
# or
nc -zv <server-ip> 8080
```

### Common Issues & Solutions
- Service not running → `systemctl start <service>`
- Port blocked by firewall → `ufw allow 8080`
- Process crashed → check logs with `journalctl`
- Wrong IP binding → check service config

---

## Exercise 4: Log Analysis

### Scenario
Users report intermittent errors. Find the root cause in logs.

### Tasks
```bash
# 1. Check system logs
journalctl --since today | grep -i error

# 2. Check web server logs (Nginx example)
tail -f /var/log/nginx/error.log
grep "5[0-9][0-9]" /var/log/nginx/access.log | tail -20

# 3. Count error types
grep -i error /var/log/syslog | cut -d' ' -f5- | sort | uniq -c | sort -rn

# 4. Find time range of errors
grep -i error /var/log/syslog | head -1
grep -i error /var/log/syslog | tail -1

# 5. Check kernel messages
dmesg -T | grep -i error
```

### Analysis Questions
1. What time did errors start?
2. What is the most common error?
3. Is there a pattern (frequency, specific user, etc.)?

---

## Exercise 5: Process & Service Management

### Scenario
A service keeps crashing. Investigate and restart it properly.

### Tasks
```bash
# 1. Check service status
systemctl status nginx

# 2. View full logs
journalctl -u nginx -n 100 --no-pager

# 3. Test configuration
nginx -t

# 4. Start/restart service
sudo systemctl restart nginx

# 5. Enable on boot
sudo systemctl enable nginx

# 6. Monitor in real-time
journalctl -u nginx -f
```

### Advanced: If service won't start
```bash
# Check for port conflicts
sudo lsof -i :80

# Check file permissions
ls -la /var/log/nginx/
ls -la /etc/nginx/nginx.conf

# Check SELinux (if applicable)
getenforce
```

---

## Exercise 6: Performance Monitoring

### Scenario
System feels slow. Collect baseline performance data.

### Tasks
```bash
# 1. CPU usage over time
sar -u 1 10

# 2. Memory usage
free -mh
cat /proc/meminfo

# 3. Disk I/O
iostat -x 1 5
iotop

# 4. Network stats
netstat -s
ss -s
iftop

# 5. Load average
uptime
cat /proc/loadavg
```

### Create Performance Report
```bash
# One-liner to collect all stats
{
  echo "=== CPU ==="
  mpstat 1 3
  echo "=== Memory ==="
  free -mh
  echo "=== Disk ==="
  df -h
  iostat -x
  echo "=== Network ==="
  ss -s
  echo "=== Load ==="
  uptime
} > perf_report.txt
```

---

## 🎯 Challenge Exercise: Full System Diagnosis

### Scenario
Production server is experiencing issues. Users report:
- Slow response times
- Intermittent 5xx errors
- Occasional timeouts

### Your Mission
Perform complete diagnosis in 15 minutes:

```bash
# Quick diagnosis script
#!/bin/bash

echo "=== Quick System Health Check ==="
echo "Time: $(date)"
echo

echo "1. Load Average:"
uptime

echo -e "\n2. Top CPU Processes:"
ps aux --sort=-%cpu | head -6

echo -e "\n3. Top Memory Processes:"
ps aux --sort=-%mem | head -6

echo -e "\n4. Disk Space:"
df -h | grep -vE 'tmpfs|devtmpfs'

echo -e "\n5. Network Connections:"
ss -s

echo -e "\n6. Recent Errors:"
journalctl --since "10 min ago" | grep -i error | tail -10

echo -e "\n7. Service Status (nginx):"
systemctl status nginx | head -5

echo -e "\nDiagnosis complete."
```

### Deliverables
1. Identify the root cause
2. Immediate mitigation steps taken
3. Long-term fix recommendation
4. Brief incident report (3-4 sentences)

---

## 📝 Answer Key & Solutions

<details>
<summary>Exercise 1 Solution</summary>

**Expected findings:**
- Use `top` or `htop` to identify process
- Check if load average > number of CPUs (overloaded)
- Memory: check if swap is being used heavily
- Action: kill or restart problematic process

</details>

<details>
<summary>Exercise 2 Solution</summary>

**Common culprits:**
- `/var/log/` (old logs)
- `/tmp/` (temporary files)
- Docker images/containers: `docker system df`
- Old kernels: `dpkg --list | grep linux-image`

**Cleanup:**
```bash
journalctl --vacuum-time=7d
apt autoremove
docker system prune -a
```

</details>

<details>
<summary>Exercise 3 Solution</summary>

**Troubleshooting flow:**
1. Service not running? → Start it
2. Port not listening? → Check bind address
3. Firewall blocking? → Allow port
4. Application error? → Check logs

</details>

---

## 🚀 Pro Tips

1. **Always check logs first**: `journalctl -xe`
2. **Use `-h` flag**: human-readable output
3. **Combine grep & tail**: `grep error logfile | tail -20`
4. **Watch in real-time**: `watch -n 1 'command'`
5. **Save output**: `command > output.txt 2>&1`

---

**Next:** Move to `02-monitoring-stack` to learn observability! 📊

