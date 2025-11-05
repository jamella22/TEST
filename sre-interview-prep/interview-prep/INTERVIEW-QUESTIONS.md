# 🎤 SRE Interview Questions & Answers

Подготовка за техническо интервю за **Site Reliability Engineer** позиции.

---

## 📋 Part 1: Behavioral & Introduction Questions

### Q1: Tell me about yourself / your background

**Примерен отговор**:
> "I've been working in IT infrastructure and support for several years, focusing on Linux systems, automation, and cloud platforms. I enjoy solving complex technical problems and making systems more reliable and efficient.
>
> Recently, I've been involved in supporting production environments, monitoring with Grafana and Prometheus, and automating tasks using Ansible and Bash.
>
> I'm looking for a role where I can combine my technical skills with reliability and operational ownership — that's why this position at Banfico really caught my attention."

---

### Q2: Why are you interested in this position / company?

**За Banfico**:
> "I'm interested in Banfico because you operate in a modern fintech space — Verification of Payee and Open Finance are fast-growing and impactful areas.
>
> I like that you're a profitable, bootstrapped company with clients in multiple regions — it shows stability and innovation.
>
> The SRE & L3 Support role fits me well — it combines hands-on technical work, reliability focus, and collaboration with different teams.
>
> I see it as a great opportunity to grow technically and contribute to reliable services for major financial clients."

**За VMware**:
> "VMware Cloud Foundation is at the core of enterprise infrastructure transformation. The opportunity to work on greenfield VCF deployments and automation at scale is exciting.
>
> The technical leadership aspect of this role aligns with my goal to mentor others while solving complex infrastructure challenges.
>
> Working with cutting-edge technologies in a respectful environment focused on engineering best practices is exactly what I'm looking for."

---

## 🧩 Part 2: Technical Concepts

### Q3: What do you understand by Site Reliability Engineering (SRE)?

**Отговор**:
> "Site Reliability Engineering is about keeping systems reliable, available, and performant in production. It combines software engineering and operations — monitoring systems, automating repetitive tasks, managing incidents, and improving deployment reliability.
>
> The goal is to minimize downtime and manual work through automation and continuous improvement. SRE teams focus on error budgets, SLOs, and building resilient systems rather than just reacting to problems."

---

### Q4: Explain the difference between SLA, SLO, and SLI

**Отговор**:
> "**SLI (Service Level Indicator)** is the actual measurement — for example, 99.93% uptime last month.
>
> **SLO (Service Level Objective)** is our internal target — for example, we aim for 99.95% uptime.
>
> **SLA (Service Level Agreement)** is the contract with customers — we guarantee 99.9% uptime, and if we breach it, there are consequences like refunds.
>
> So: SLI is what we measure, SLO is what we target, SLA is what we promise."

---

### Q5: What are the Four Golden Signals in monitoring?

**Отговор**:
> "The Four Golden Signals are:
> 1. **Latency** - How long requests take (response time)
> 2. **Traffic** - How many requests we're receiving (volume)
> 3. **Errors** - What percentage of requests are failing
> 4. **Saturation** - How full our resources are (CPU, memory, disk I/O)
>
> Monitoring these four metrics gives you a complete picture of system health."

---

### Q6: How do you balance deployment frequency with stability?

**Отговор**:
> "I use several strategies:
> - **Feature flags** to decouple deployment from release
> - **Canary deployments** to test changes on small traffic percentage first
> - **Strong test automation** (unit, integration, E2E tests)
> - **Error budgets** to limit deployment velocity when reliability is low
> - **Rollback mechanisms** to quickly revert problematic changes
>
> The key is to make deployments low-risk and reversible, not slower."

---

### Q7: What's the difference between Continuous Delivery and Continuous Deployment?

**Отговор**:
> "**Continuous Delivery** means code is always in a deployable state, but deployment to production requires manual approval.
>
> **Continuous Deployment** means every change that passes automated tests is automatically deployed to production without human intervention.
>
> Most companies use Continuous Delivery because they want human oversight before production changes, especially in regulated industries like finance."

---

### Q8: What's the difference between monitoring and observability?

**Отговор**:
> "**Monitoring** is checking predefined metrics and alerts for known problems — like 'Is CPU above 80%?' or 'Is the service responding?'
>
> **Observability** is about understanding system behavior for unknown problems by exploring metrics, logs, and traces. It answers 'Why is this request slow?' not just 'Is it slow?'
>
> Monitoring tells you that something is wrong. Observability helps you figure out what and why."

---

## 💻 Part 3: Linux & Troubleshooting

### Q9: What's your experience with Linux and troubleshooting?

**Отговор**:
> "I work daily with Linux — mainly Ubuntu and CentOS. I use CLI tools like:
> - `journalctl`, `tail`, `grep` for log analysis
> - `systemctl` for service management
> - `top`, `htop`, `vmstat` for resource monitoring
> - `ss`, `lsof`, `netstat` for network debugging
>
> When there's an incident, I usually start with logs, then check service status and resource metrics to find the root cause. I'm comfortable debugging both OS-level and application-level issues."

---

### Q10: How do you check which process is using the most memory?

**Отговор**:
```bash
# Method 1: Using ps
ps aux --sort=-%mem | head -10

# Method 2: Using top (interactive)
top
# Then press Shift+M to sort by memory

# Method 3: Find specific high memory processes
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | head
```

---

### Q11: How do you find large files taking up disk space?

**Отговор**:
```bash
# Find files larger than 500MB
find / -type f -size +500M 2>/dev/null

# See disk usage by directory (top 20)
du -ah /var | sort -rh | head -20

# Check overall disk usage
df -h

# Find old log files (older than 30 days)
find /var/log -name "*.log" -mtime +30
```

---

### Q12: A service crashed. Walk me through your debugging process.

**Отговор**:
> "My systematic approach:
>
> 1. **Check service status**: `systemctl status servicename`
> 2. **Check logs**: `journalctl -u servicename -n 100` (last 100 lines)
> 3. **Check resource usage**: `top`, `df -h`, `free -m` (CPU, disk, memory)
> 4. **Check for config errors**: Validate configuration files
> 5. **Check dependencies**: Are database, network, other services OK?
> 6. **Attempt restart**: `systemctl restart servicename`
> 7. **Monitor after restart**: Watch logs and metrics
> 8. **Document root cause**: Update runbook for next time
>
> If it's recurring, I'd automate the fix or add monitoring to detect it earlier."

---

## ☁️ Part 4: Cloud & Infrastructure as Code

### Q13: When would you choose Terraform over CloudFormation or other IaC tools?

**Отговор**:
> "I'd choose Terraform when:
> - Working with **multiple cloud providers** (AWS + Azure + VMware)
> - Need **modular, reusable** code across teams
> - Want **open-source** flexibility and community support
> - Team already knows HCL (HashiCorp Configuration Language)
>
> CloudFormation is fine for AWS-only shops with deep AWS integration needs.
> Pulumi is good if team prefers programming languages over DSL.
>
> But Terraform's multi-cloud support and module ecosystem make it my default choice."

---

### Q14: How do you handle secrets in IaC without compromising security?

**Отговор**:
> "I never hardcode secrets in Terraform/Ansible code. Instead:
>
> - Use **Vault** or **AWS Secrets Manager** to store secrets
> - Reference secrets by ID/ARN in IaC code
> - Use **environment variables** for local development
> - Encrypt sensitive files with **SOPS** or **Ansible Vault**
> - Use **IAM roles** instead of access keys (AWS)
> - Add `*.tfvars` with secrets to `.gitignore`
> - Rotate secrets regularly
>
> The principle is: secrets should be retrieved at runtime, not stored in code."

---

### Q15: How have you used Ansible or Terraform in your work?

**Отговор**:
> "With **Terraform**, I've provisioned AWS infrastructure — EC2 instances, VPCs, security groups, and load balancers. I organize code into modules for reusability and use remote backend (S3 + DynamoDB) for state management.
>
> With **Ansible**, I've automated server configuration — installing packages, managing services, deploying applications, and copying configuration files. I use roles for organization and Ansible Vault for secrets.
>
> Together: Terraform builds the infrastructure, Ansible configures it."

---

## 🐳 Part 5: Containers & Kubernetes

### Q16: Explain the difference between Docker and Kubernetes.

**Отговор**:
> "**Docker** is a containerization platform — it packages applications and dependencies into containers.
>
> **Kubernetes** is a container orchestration platform — it manages, schedules, scales, and heals containers across multiple hosts.
>
> Analogy: Docker is like a shipping container. Kubernetes is the cargo ship that manages thousands of containers."

---

### Q17: A pod is in CrashLoopBackOff. How do you debug it?

**Отговор**:
```bash
# 1. Check pod status
kubectl get pods

# 2. Describe pod to see events
kubectl describe pod pod-name

# 3. Check current logs
kubectl logs pod-name

# 4. Check previous container logs (if crashed)
kubectl logs pod-name --previous

# 5. Check pod configuration
kubectl get pod pod-name -o yaml

# Common causes:
# - Wrong image or missing image
# - Environment variable errors
# - Resource limits too low
# - Application startup failure
# - Missing ConfigMap or Secret
```

---

### Q18: How do you handle stateful workloads in Kubernetes?

**Отговор**:
> "For stateful applications (databases, message queues), I use:
>
> - **StatefulSets** instead of Deployments (stable network IDs, ordered deployment)
> - **Persistent Volumes (PV)** and **Persistent Volume Claims (PVC)** for storage
> - **Headless Services** for direct pod access
> - Regular **backups** using tools like Velero
> - **Init containers** for setup tasks before main container starts
>
> StatefulSets ensure each pod has a stable identity and persistent storage across restarts."

---

### Q19: What problems does Service Mesh solve that Kubernetes doesn't?

**Отговор**:
> "Service Mesh (like Istio, Linkerd) adds:
>
> - **Traffic management**: Canary releases, A/B testing, circuit breaking
> - **Security**: Mutual TLS between services automatically
> - **Observability**: Detailed metrics and distributed tracing
> - **Retries and timeouts**: Automatic retry logic
> - **Rate limiting**: Control traffic between services
>
> Kubernetes gives you basic networking. Service Mesh adds advanced traffic control, security, and observability on top."

---

## 📊 Part 6: Monitoring & Observability

### Q20: How do you monitor production systems?

**Отговор**:
> "I use a combination of:
>
> - **Prometheus** for metrics collection (CPU, memory, latency, error rates)
> - **Grafana** for visualization and alerting
> - **ELK or Loki** for centralized logging
> - **Jaeger or Zipkin** for distributed tracing (in microservices)
>
> I track the Four Golden Signals (latency, traffic, errors, saturation) and create dashboards for different audiences — technical deep-dives for engineers, high-level health for managers.
>
> Alerts are tuned to avoid fatigue — only for actionable, user-impacting issues."

---

### Q21: How do you determine what SLIs to measure for a new service?

**Отговор**:
> "I identify critical user paths and measure:
>
> 1. **Availability** - Is the service up? (uptime %)
> 2. **Latency** - How fast are responses? (p50, p95, p99)
> 3. **Error rate** - What % of requests fail? (5xx errors)
> 4. **Throughput** - How many requests per second?
>
> The key is to measure what users care about, not just technical metrics.
>
> Example: For an API service, I'd track API response time (p95 < 200ms) and error rate (< 0.1%)."

---

### Q22: How do you prevent alert fatigue?

**Отговор**:
> "Alert fatigue happens when too many alerts are non-actionable. I prevent it by:
>
> - **Alert on symptoms**, not causes (alert on 'users can't login', not 'CPU high')
> - Set **appropriate thresholds** (not too sensitive)
> - Use **severity levels** (critical = page oncall, warning = ticket)
> - **Aggregate related alerts** (not 100 alerts for same issue)
> - Regularly **review and tune** alerts based on false positive rate
> - Only alert on things that require **immediate human action**
>
> Goal: Every alert should be actionable and important."

---

## 🚨 Part 7: Incident Management

### Q23: Can you describe a challenging production incident you resolved?

**Примерен отговор (STAR method)**:
> "**Situation**: A client's API integration stopped responding during business hours. Error rate jumped to 50%.
>
> **Task**: I was on-call and needed to restore service quickly while finding root cause.
>
> **Action**:
> - I checked logs in EFK stack and found timeout errors
> - I traced the issue to a DNS misconfiguration in Kubernetes ConfigMap
> - I fixed the config and redeployed the affected pods
> - Service recovered within 15 minutes
>
> **Result**: After recovery, I created a Prometheus alert for DNS resolution failures and added a health check to catch this earlier. We also documented the fix in our runbook. This reduced MTTR for similar issues from 30 min to 5 min."

---

### Q24: What's MTTD, MTTR, and MTBF?

**Отговор**:
> - **MTTD (Mean Time To Detect)**: Average time to notice an issue exists
> - **MTTR (Mean Time To Repair)**: Average time to fix the issue after detection
> - **MTBF (Mean Time Between Failures)**: Average time between incidents
>
> Example: If we detect issues in 5 minutes, fix them in 20 minutes, and have incidents every 30 days:
> - MTTD = 5 min
> - MTTR = 20 min
> - MTBF = 30 days
>
> Good SRE teams optimize all three: detect faster, repair faster, fail less often."

---

### Q25: How do you run effective blameless postmortems?

**Отговор**:
> "Blameless postmortems focus on process, not people. Key principles:
>
> 1. **No blame**: Focus on what happened, not who made mistakes
> 2. **Timeline**: Document event sequence objectively
> 3. **Root cause**: Find systemic issues, not scapegoats
> 4. **Action items**: Concrete improvements with owners and deadlines
> 5. **Learning culture**: Share postmortems openly to prevent repeat incidents
>
> Example format:
> - What happened and when
> - Why it happened (root cause)
> - What we did to fix it
> - How we'll prevent it (action items)
>
> The goal is learning and improvement, not punishment."

---

### Q26: How do you handle escalations from L1 support or communication with clients?

**Отговор**:
> "When I receive escalations, I:
>
> 1. **Gather information**: Error messages, timestamps, affected systems, steps to reproduce
> 2. **Acknowledge quickly**: Let them know I'm investigating (set expectations)
> 3. **Reproduce the issue**: Verify in staging or logs
> 4. **Communicate clearly**: Explain technical issues in simple terms for non-technical stakeholders
> 5. **Regular updates**: Even if no progress, update every 30-60 minutes
> 6. **Document resolution**: Update ticket with root cause and fix
> 7. **Follow up**: Confirm issue is resolved from user perspective
>
> Key: Clear, honest communication and avoiding finger-pointing."

---

## 🔐 Part 8: Security & DevSecOps

### Q27: How do you implement security scanning without slowing deployments?

**Отговор**:
> "Security scanning should be fast and automated:
>
> - **Parallelize scans** with other pipeline steps
> - **Incremental scanning**: Only scan changes, not entire codebase
> - **Fail fast**: Run quick checks (linting, secrets detection) early
> - **Threshold-based**: Fail on critical/high severity, warn on medium/low
> - **Cache results**: Don't re-scan unchanged dependencies
> - **Shift left**: Run scans in developer environment before commit
>
> Tools like **Trivy**, **Snyk**, **SonarQube** can scan in seconds if configured properly."

---

### Q28: What's the difference between SAST, DAST, and IAST?

**Отговор**:
> - **SAST (Static Application Security Testing)**:
>   - Analyzes source code without running it
>   - Finds vulnerabilities in code (SQL injection patterns, hardcoded secrets)
>   - Fast, early in pipeline
>
> - **DAST (Dynamic Application Security Testing)**:
>   - Tests running application (black-box approach)
>   - Finds runtime vulnerabilities (XSS, authentication bypass)
>   - Slower, used in staging
>
> - **IAST (Interactive Application Security Testing)**:
>   - Hybrid: instruments application during testing
>   - Combines SAST accuracy with DAST real-world context
>   - More comprehensive but requires special setup
>
> Best practice: Use SAST early + DAST before production."

---

## 🌍 Part 9: Scaling & Architecture

### Q29: How do you manage configuration drift across 1000s of servers?

**Отговор**:
> "Configuration drift is when servers diverge from desired state. I prevent it by:
>
> - **Infrastructure as Code**: Terraform/Ansible define desired state
> - **Immutable infrastructure**: Replace servers instead of updating them (AMI-based deployment)
> - **GitOps**: All config changes via Git (ArgoCD, Flux)
> - **Configuration management**: Ansible/Chef enforce state regularly
> - **Automated compliance scans**: Detect drift and alert
> - **Containerization**: Reduces server-level config differences
>
> Principle: Don't SSH into servers and make changes — change the code and redeploy."

---

### Q30: What's your approach to multi-region deployment strategies?

**Отговор**:
> "Multi-region deployment requires:
>
> **Infrastructure**:
> - Deploy identical infrastructure in each region (IaC)
> - Global load balancer (Route53, Cloudflare) for traffic routing
> - CDN for static assets
>
> **Data**:
> - Database replication (multi-region RDS, Cassandra)
> - Eventually consistent or strongly consistent (depends on requirements)
> - Data residency compliance (GDPR regions)
>
> **Deployment**:
> - Rolling deployment: One region at a time
> - Blue-green per region
> - Canary: 5% traffic in one region first
>
> **Failover**:
> - Health checks on region level
> - Automatic or manual failover
> - Regular disaster recovery drills"

---

## 🎯 Part 10: On-Call & Work Culture

### Q31: Are you comfortable with on-call or flexible work hours?

**Отговор**:
> "Yes, I understand on-call is essential for maintaining SLAs, especially in SaaS and financial services. I've been on-call before and know how to stay calm under pressure and prioritize quick mitigation.
>
> What's important to me:
> - Fair rotation (shared across team)
> - Good runbooks and documentation
> - Proper compensation for on-call time and interventions
> - Blameless culture when incidents happen
>
> I appreciate that Banfico compensates for both on-call availability and actual interventions, and that the load is distributed fairly."

---

### Q32: How do you handle resistance to DevOps transformation?

**Отговор**:
> "Resistance usually comes from fear of change or past bad experiences. I address it by:
>
> - **Start small**: Pick one team/project for pilot
> - **Show value**: Demonstrate faster deployments, fewer incidents
> - **Involve skeptics**: Make them part of solution, not opposition
> - **Training**: Provide learning resources and pair programming
> - **Celebrate wins**: Publicize successes
> - **Be patient**: Culture change takes time
>
> People resist change when they don't see value. Show them how automation makes their lives easier, not harder."

---

### Q33: What's the difference between DevOps and SRE organizationally?

**Отговор**:
> "**DevOps** is a cultural movement and set of practices — breaking down silos between Dev and Ops, automating everything, continuous integration/delivery.
>
> **SRE (Site Reliability Engineering)** is Google's implementation of DevOps — it applies software engineering practices to operations problems. SRE teams focus on reliability metrics (SLOs, error budgets), automation, and incident management.
>
> Organizationally:
> - DevOps teams often embed with development teams
> - SRE teams might be centralized, providing reliability services to multiple product teams
>
> Both share the goal: reliable, fast software delivery through automation."

---

## 🎓 Bonus: Questions to Ask Interviewer

1. **Technical Stack**: "What monitoring and observability tools does the team currently use?"

2. **Team Culture**: "How do you balance feature development with reliability improvements and technical debt?"

3. **On-Call**: "What's the typical on-call rotation and incident frequency?"

4. **Growth**: "What opportunities are there for learning new technologies and advancing in the SRE role?"

5. **Challenges**: "What are the biggest reliability challenges the team is facing right now?"

6. **Deployment**: "How often do you deploy to production, and what's the process?"

7. **Automation**: "What percentage of your infrastructure and configuration is code-managed (IaC)?"

8. **Incidents**: "Can you walk me through a recent major incident and how the team responded?"

---

**Good luck on your interviews!** 🚀

Remember: 
- Be honest about what you know and don't know
- Show curiosity and willingness to learn
- Explain your thinking process
- Use real examples from your experience
- Ask thoughtful questions
