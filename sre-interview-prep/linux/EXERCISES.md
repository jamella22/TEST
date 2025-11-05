# 💻 Linux & Troubleshooting Exercises

Практически упражнения за Linux системна администрация и troubleshooting.

---

## 🎯 Exercise 1: System Monitoring

### Task
Your web server is running slow. Investigate CPU, memory, and disk usage.

### Steps
1. Check overall system load:
```bash
uptime
top
htop  # if available
```

2. Check CPU usage by process:
```bash
ps aux --sort=-%cpu | head -10
```

3. Check memory usage:
```bash
free -m
ps aux --sort=-%mem | head -10
```

4. Check disk usage:
```bash
df -h
du -sh /* | sort -rh | head -10
```

5. Check I/O statistics:
```bash
iostat -x 1 5
iotop  # if available
```

### Questions
- Which process is using most CPU?
- Is memory usage normal or concerning?
- Which filesystem is fullest?
- Is there disk I/O bottleneck?

---

## 🎯 Exercise 2: Log Analysis

### Task
Application is throwing errors. Find the root cause from logs.

### Sample Log Creation
```bash
# Create sample log file
cat > /tmp/app.log << 'EOF'
2025-10-24 10:15:32 INFO User john logged in
2025-10-24 10:16:45 INFO Processing order #1234
2025-10-24 10:17:12 ERROR Database connection timeout
2025-10-24 10:17:15 ERROR Failed to process order #1234
2025-10-24 10:18:03 WARN Retrying database connection
2025-10-24 10:18:10 INFO Database connection restored
2025-10-24 10:18:22 INFO Processing order #1235
2025-10-24 10:19:45 ERROR Database connection timeout
2025-10-24 10:20:01 CRITICAL Multiple database failures detected
EOF
```

### Steps
1. Count errors:
```bash
grep -c ERROR /tmp/app.log
```

2. Show only ERROR lines:
```bash
grep ERROR /tmp/app.log
```

3. Show ERROR and CRITICAL:
```bash
grep -E "ERROR|CRITICAL" /tmp/app.log
```

4. Count each log level:
```bash
awk '{print $3}' /tmp/app.log | sort | uniq -c
```

5. Show errors with 2 lines context:
```bash
grep -A 2 -B 2 ERROR /tmp/app.log
```

6. Find errors in last hour (using journalctl):
```bash
journalctl -u your-service --since "1 hour ago" | grep -i error
```

### Questions
- What is the primary error?
- Is there a pattern to the errors?
- What time did the critical issue occur?

---

## 🎯 Exercise 3: Process Management

### Task
Find and manage problematic processes.

### Scenario: CPU hog process
1. Find process using most CPU:
```bash
ps aux --sort=-%cpu | head -5
```

2. Get detailed process info:
```bash
ps -p <PID> -o pid,ppid,cmd,%mem,%cpu,etime
```

3. Check process tree:
```bash
pstree -p <PID>
```

4. Monitor process in real-time:
```bash
watch -n 1 "ps -p <PID> -o pid,ppid,cmd,%mem,%cpu"
```

5. Kill process gracefully:
```bash
kill <PID>          # SIGTERM (graceful)
kill -9 <PID>       # SIGKILL (force)
```

### Scenario: Zombie processes
1. Find zombie processes:
```bash
ps aux | grep defunct
ps aux | awk '$8=="Z" {print}'
```

2. Find zombie parent:
```bash
ps -o ppid= -p <ZOMBIE_PID>
```

3. Kill parent to clean zombies:
```bash
kill <PARENT_PID>
```

---

## 🎯 Exercise 4: Network Troubleshooting

### Task
API service is not responding. Debug network issues.

### Steps
1. Check if service is listening:
```bash
ss -tulpn | grep :8080
netstat -tulpn | grep :8080
lsof -i :8080
```

2. Test local connectivity:
```bash
curl -v http://localhost:8080/health
nc -zv localhost 8080
```

3. Test remote connectivity:
```bash
curl -v https://api.example.com
telnet api.example.com 443
```

4. Check DNS resolution:
```bash
dig api.example.com
nslookup api.example.com
host api.example.com
```

5. Trace route:
```bash
traceroute api.example.com
mtr api.example.com  # better alternative
```

6. Check firewall:
```bash
sudo iptables -L -n
sudo ufw status
```

7. Capture traffic:
```bash
sudo tcpdump -i eth0 port 8080 -w capture.pcap
sudo tcpdump -r capture.pcap
```

### Questions
- Is the service running and listening?
- Is there a firewall blocking?
- Is DNS resolving correctly?
- Where in the network path is the issue?

---

## 🎯 Exercise 5: Service Management

### Task
Nginx service crashed. Investigate and restart.

### Steps
1. Check service status:
```bash
systemctl status nginx
```

2. Check if process exists:
```bash
ps aux | grep nginx
```

3. Check logs:
```bash
journalctl -u nginx -n 50
journalctl -u nginx --since "10 minutes ago"
tail -f /var/log/nginx/error.log
```

4. Test configuration:
```bash
nginx -t
```

5. Restart service:
```bash
systemctl restart nginx
```

6. Enable on boot:
```bash
systemctl enable nginx
```

7. Monitor after restart:
```bash
journalctl -u nginx -f
```

### Common Issues
- **Configuration error**: `nginx -t` shows syntax error
- **Port conflict**: Another process using port 80/443
- **Permission issue**: Can't access files or logs
- **Missing files**: Config or SSL cert files missing

---

## 🎯 Exercise 6: Disk Space Issues

### Task
Server is out of disk space. Find and clean up.

### Steps
1. Check disk usage:
```bash
df -h
```

2. Find large directories:
```bash
du -sh /* | sort -rh | head -10
du -sh /var/* | sort -rh | head -10
```

3. Find large files:
```bash
find / -type f -size +500M -exec ls -lh {} \; 2>/dev/null
find /var/log -type f -size +100M
```

4. Find old log files:
```bash
find /var/log -name "*.log" -mtime +30 -ls
```

5. Check deleted but open files (space not freed):
```bash
lsof +L1
```

6. Clean up:
```bash
# Compress old logs
find /var/log -name "*.log" -mtime +7 -exec gzip {} \;

# Delete old logs
find /var/log -name "*.log.gz" -mtime +30 -delete

# Clean package cache
apt clean  # Debian/Ubuntu
yum clean all  # RHEL/CentOS

# Clean tmp
find /tmp -mtime +7 -delete
```

---

## 🎯 Exercise 7: Performance Tuning

### Task
Optimize system performance.

### CPU Investigation
```bash
# Check CPU info
lscpu
cat /proc/cpuinfo

# Top CPU consumers
top -o %CPU
ps aux --sort=-%cpu | head -20

# CPU per core
mpstat -P ALL 1
```

### Memory Investigation
```bash
# Memory details
free -m
cat /proc/meminfo

# Memory by process
ps aux --sort=-%mem | head -20
pmap <PID>  # Memory map of process

# Check for memory leaks
watch -n 1 "ps aux | grep <process_name>"
```

### I/O Investigation
```bash
# I/O statistics
iostat -x 1 5
iotop -o  # Only show processes doing I/O

# I/O per process
pidstat -d 1
```

---

## 🎯 Exercise 8: User & Permission Issues

### Task
Application can't write to log file. Fix permissions.

### Steps
1. Check file permissions:
```bash
ls -la /var/log/app.log
```

2. Check file owner:
```bash
stat /var/log/app.log
```

3. Check process user:
```bash
ps aux | grep app-name
```

4. Fix ownership:
```bash
sudo chown appuser:appuser /var/log/app.log
```

5. Fix permissions:
```bash
sudo chmod 644 /var/log/app.log  # rw-r--r--
```

6. Check directory permissions:
```bash
ls -la /var/log/
```

7. Test write access:
```bash
sudo -u appuser touch /var/log/test.log
```

---

## 🎯 Exercise 9: SSH & Remote Access

### Task
Can't SSH to server. Debug connection issues.

### Steps
1. Check SSH service:
```bash
systemctl status sshd
```

2. Check SSH listening:
```bash
ss -tulpn | grep :22
```

3. Check SSH logs:
```bash
journalctl -u sshd -n 50
tail -f /var/log/auth.log  # Debian
tail -f /var/log/secure    # RHEL
```

4. Test SSH from local:
```bash
ssh -v user@server  # Verbose mode
```

5. Check firewall:
```bash
sudo ufw status
sudo iptables -L -n | grep 22
```

6. Check SSH config:
```bash
sudo nano /etc/ssh/sshd_config
# Check: PermitRootLogin, PasswordAuthentication, Port
```

7. Restart SSH:
```bash
sudo systemctl restart sshd
```

---

## 🎯 Exercise 10: Cron Jobs & Scheduled Tasks

### Task
Scheduled backup script isn't running. Debug cron.

### Steps
1. List user cron jobs:
```bash
crontab -l
```

2. List system cron jobs:
```bash
ls -la /etc/cron.d/
ls -la /etc/cron.daily/
```

3. Check cron logs:
```bash
journalctl -u cron
grep CRON /var/log/syslog
```

4. Test script manually:
```bash
bash -x /path/to/backup-script.sh
```

5. Check script permissions:
```bash
ls -la /path/to/backup-script.sh
```

6. Add cron job:
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh >> /var/log/backup.log 2>&1
```

7. Verify cron syntax:
```bash
# Use crontab.guru website
# Format: minute hour day month weekday command
# Example: 0 2 * * * = Every day at 2:00 AM
```

---

## 📝 Interview Scenarios

Practice explaining these scenarios:

### Scenario 1: Server is slow
> "I'd start by checking `top` for CPU and memory usage, then `df -h` for disk space, and `iostat` for I/O bottlenecks. I'd look at recent logs with `journalctl` and check for any obvious errors. If it's a specific service, I'd check its logs and resource usage."

### Scenario 2: Service won't start
> "First, `systemctl status service-name` to see the error. Then `journalctl -u service-name -n 50` for detailed logs. I'd test the configuration file if applicable, check if the port is already in use with `ss -tulpn`, and verify file permissions. Finally, I'd try starting it manually to see immediate errors."

### Scenario 3: Out of disk space
> "I'd run `df -h` to identify the full filesystem, then `du -sh /*` to find large directories. I'd look for old logs, core dumps, or cached files. I'd use `find` to locate large files and check for deleted-but-open files with `lsof +L1`. After cleanup, I'd set up log rotation and monitoring."

---

**Pro Tip**: Practice these exercises in a Docker container or VM so you can experiment freely without risking your host system! 🚀
