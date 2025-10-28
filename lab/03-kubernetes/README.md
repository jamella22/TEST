# ☸️ Kubernetes Lab - Container Orchestration

Hands-on exercises for Kubernetes operations, debugging, and reliability.

## 🚀 Setup

### Option 1: Minikube (Recommended for laptops)
```bash
minikube start --memory=4096 --cpus=2
kubectl get nodes
```

### Option 2: kind (Kubernetes in Docker)
```bash
kind create cluster --name sre-lab
kubectl cluster-info --context kind-sre-lab
```

### Verify Setup
```bash
kubectl version --short
kubectl get nodes
kubectl get namespaces
```

---

## 📚 Lab Exercises

### Exercise 1: Deploy a Simple Application

**Deploy Nginx:**
```bash
# Create deployment
kubectl create deployment nginx --image=nginx:alpine

# Check status
kubectl get deployments
kubectl get pods

# Expose as a service
kubectl expose deployment nginx --port=80 --type=NodePort

# Get service URL
minikube service nginx --url
# or for kind:
kubectl get svc nginx
```

**Scale the deployment:**
```bash
kubectl scale deployment nginx --replicas=3
kubectl get pods -w
```

**View logs:**
```bash
kubectl logs deployment/nginx
kubectl logs -f <pod-name>
```

---

### Exercise 2: Deploy Microservices Stack

Create `microservices-app.yaml`:
```yaml
---
# Redis
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
---
apiVersion: v1
kind: Service
metadata:
  name: redis
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
---
# Backend API
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: hashicorp/http-echo
        args:
        - "-text=Hello from API"
        ports:
        - containerPort: 5678
        env:
        - name: REDIS_HOST
          value: "redis"
---
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 5678
---
# Frontend
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
```

**Deploy:**
```bash
kubectl apply -f microservices-app.yaml
kubectl get all
```

**Test connectivity:**
```bash
# Get frontend URL
minikube service frontend --url

# Test API internally
kubectl run test --rm -it --image=alpine -- sh
# Inside pod:
wget -qO- http://api
wget -qO- http://redis:6379
```

---

### Exercise 3: ConfigMaps & Secrets

**Create ConfigMap:**
```bash
# From literal values
kubectl create configmap app-config \
  --from-literal=APP_ENV=production \
  --from-literal=LOG_LEVEL=info

# View it
kubectl get configmap app-config -o yaml
```

**Create Secret:**
```bash
# Create secret
kubectl create secret generic db-credentials \
  --from-literal=username=admin \
  --from-literal=password=supersecret

# View (encoded)
kubectl get secret db-credentials -o yaml
```

**Use in deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-with-config
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: nginx:alpine
        env:
        # From ConfigMap
        - name: APP_ENV
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: APP_ENV
        # From Secret
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: username
        - name: DB_PASS
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
```

```bash
kubectl apply -f app-with-config.yaml
kubectl exec -it <pod-name> -- env | grep -E 'APP_ENV|DB_'
```

---

### Exercise 4: Debugging CrashLoop Pods

**Create a failing pod:**
```yaml
# broken-app.yaml
apiVersion: v1
kind: Pod
metadata:
  name: broken-app
spec:
  containers:
  - name: app
    image: nginx:alpine
    command: ["/bin/sh"]
    args: ["-c", "echo Starting...; exit 1"]
```

```bash
kubectl apply -f broken-app.yaml
```

**Debug it:**
```bash
# Check status
kubectl get pods

# Describe to see events
kubectl describe pod broken-app

# View logs
kubectl logs broken-app

# Check previous container logs (after restart)
kubectl logs broken-app --previous

# Fix: update the YAML to not exit
# args: ["-c", "while true; do echo Hello; sleep 10; done"]
```

**Common CrashLoop Causes:**
1. Application error (check logs)
2. Missing dependencies (ConfigMap, Secret)
3. Resource limits too low
4. Wrong command/entrypoint
5. Health check failures

---

### Exercise 5: Resource Limits & Requests

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: resource-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: demo
  template:
    metadata:
      labels:
        app: demo
    spec:
      containers:
      - name: app
        image: nginx:alpine
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

**Test resource constraints:**
```bash
kubectl apply -f resource-demo.yaml
kubectl top pod
kubectl describe pod <pod-name> | grep -A 5 Resources
```

**Stress test:**
```bash
# Generate load
kubectl run stress --image=polinux/stress --rm -it -- stress --cpu 2 --timeout 30s
```

---

### Exercise 6: Health Checks (Liveness & Readiness)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: health-check-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: health-demo
  template:
    metadata:
      labels:
        app: health-demo
    spec:
      containers:
      - name: app
        image: nginx:alpine
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 3
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 2
          periodSeconds: 5
```

**Simulate failure:**
```bash
kubectl apply -f health-check-demo.yaml

# Break the liveness probe
kubectl exec -it <pod-name> -- sh -c "rm /usr/share/nginx/html/index.html"

# Watch pod restart
kubectl get pods -w
```

**Key Concepts:**
- **Liveness:** Should the pod be restarted?
- **Readiness:** Should the pod receive traffic?
- **Startup:** Special probe for slow-starting apps

---

### Exercise 7: Rolling Updates & Rollbacks

```bash
# Create deployment
kubectl create deployment rolling-demo --image=nginx:1.21

# Update to new version
kubectl set image deployment/rolling-demo nginx=nginx:1.22

# Watch the rollout
kubectl rollout status deployment/rolling-demo

# View rollout history
kubectl rollout history deployment/rolling-demo

# Rollback to previous version
kubectl rollout undo deployment/rolling-demo

# Rollback to specific revision
kubectl rollout undo deployment/rolling-demo --to-revision=1
```

**Control rollout strategy:**
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Extra pods during update
      maxUnavailable: 0  # Ensure zero downtime
```

---

### Exercise 8: Persistent Storage (StatefulSet)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  clusterIP: None
  selector:
    app: postgres
  ports:
  - port: 5432
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_PASSWORD
          value: "password123"
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 1Gi
```

```bash
kubectl apply -f postgres-statefulset.yaml

# Check PVCs
kubectl get pvc

# Verify data persistence
kubectl exec -it postgres-0 -- psql -U postgres -c "CREATE TABLE test(id INT);"
kubectl delete pod postgres-0
# Wait for pod to restart
kubectl exec -it postgres-0 -- psql -U postgres -c "\dt"
# Table should still exist!
```

---

## 🚨 Incident Scenarios

### Scenario 1: Pod Won't Start

**Symptoms:**
```bash
kubectl get pods
# NAME            READY   STATUS              RESTARTS   AGE
# myapp-abc123    0/1     ImagePullBackOff    0          2m
```

**Investigation:**
```bash
kubectl describe pod myapp-abc123
# Look for: Events section, Image pull errors

# Common causes:
# - Wrong image name/tag
# - Private registry without credentials
# - Network issues
```

**Fix:**
```bash
# For private registry:
kubectl create secret docker-registry regcred \
  --docker-server=<registry> \
  --docker-username=<user> \
  --docker-password=<pass>

# Update deployment to use secret:
# spec.template.spec.imagePullSecrets:
# - name: regcred
```

---

### Scenario 2: High Memory Usage → OOMKilled

**Symptoms:**
```bash
kubectl get pods
# NAME            READY   STATUS       RESTARTS   AGE
# myapp-xyz789    0/1     OOMKilled    5          10m
```

**Investigation:**
```bash
kubectl describe pod myapp-xyz789
# Last State: Terminated, Reason: OOMKilled

kubectl top pod myapp-xyz789
```

**Fix:**
```yaml
# Increase memory limits
resources:
  limits:
    memory: "512Mi"  # Was 128Mi
```

---

### Scenario 3: Service Unreachable

**Symptoms:**
```bash
curl http://myservice
# Connection refused
```

**Investigation:**
```bash
# 1. Check service exists
kubectl get svc myservice

# 2. Check endpoints (pods backing the service)
kubectl get endpoints myservice

# 3. Verify selector matches pod labels
kubectl get svc myservice -o yaml | grep selector
kubectl get pods --show-labels

# 4. Test from inside cluster
kubectl run debug --rm -it --image=alpine -- sh
wget -qO- http://myservice
```

**Common Issues:**
- Selector doesn't match pod labels
- Pods not ready (readiness probe failing)
- Wrong port mapping
- Network policy blocking traffic

---

## 🎯 Challenge Tasks

### Task 1: Zero-Downtime Deployment
Deploy an app, then update it with **zero downtime**. Prove no requests failed during update.

### Task 2: Multi-Tier App with Persistence
Deploy WordPress + MySQL with:
- Persistent storage for both
- Secrets for credentials
- Resource limits
- Health checks

### Task 3: Debug a Broken Stack
I'll give you a broken YAML with 5 issues. Find and fix all of them.

### Task 4: Autoscaling
Configure Horizontal Pod Autoscaler (HPA) to scale based on CPU:
```bash
kubectl autoscale deployment myapp --cpu-percent=50 --min=2 --max=10
```

---

## 🧹 Cleanup

```bash
# Delete specific resources
kubectl delete deployment nginx
kubectl delete svc nginx

# Delete everything in current namespace
kubectl delete all --all

# Delete specific files
kubectl delete -f microservices-app.yaml

# Stop cluster
minikube stop
# or
kind delete cluster --name sre-lab
```

---

## 📖 Key Learnings

✅ Deploy and manage containerized applications  
✅ Debug common Kubernetes issues  
✅ Manage configuration and secrets  
✅ Implement health checks and resource limits  
✅ Perform rolling updates and rollbacks  
✅ Work with persistent storage  
✅ Troubleshoot networking issues  

---

**Next:** Move to `04-terraform` for Infrastructure as Code! 🏗️

