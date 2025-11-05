# 🐳 Kubernetes Exercises

Практически упражнения с Kubernetes за SRE подготовка.

---

## 📦 Setup

### Install Minikube (if not installed)
```bash
# Linux
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start cluster
minikube start --memory=4096 --cpus=2
```

### Verify Installation
```bash
kubectl version --client
kubectl cluster-info
kubectl get nodes
```

---

## 🎯 Exercise 1: Deploy Simple Application

### Task
Deploy a simple web application and expose it.

### Steps
1. Create deployment:
```bash
kubectl create deployment nginx --image=nginx:alpine --replicas=3
```

2. Check deployment:
```bash
kubectl get deployments
kubectl get pods
kubectl describe deployment nginx
```

3. Expose deployment:
```bash
kubectl expose deployment nginx --port=80 --type=NodePort
```

4. Get service URL:
```bash
minikube service nginx --url
# Or
kubectl get svc nginx
```

5. Test application:
```bash
curl $(minikube service nginx --url)
```

### Questions
- How many pods are running?
- What happens if you delete a pod?
- How does Kubernetes maintain desired replica count?

---

## 🎯 Exercise 2: Debugging CrashLoopBackOff

### Task
Debug a pod that's failing to start.

### Create Broken Pod
```yaml
# broken-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: broken-app
spec:
  containers:
  - name: app
    image: nginx:alpine
    command: ["/bin/sh"]
    args: ["-c", "exit 1"]  # This will cause crash
```

```bash
kubectl apply -f broken-pod.yaml
```

### Debug Steps
1. Check pod status:
```bash
kubectl get pods
# Should show CrashLoopBackOff
```

2. Describe pod:
```bash
kubectl describe pod broken-app
# Look at Events section
```

3. Check current logs:
```bash
kubectl logs broken-app
```

4. Check previous container logs:
```bash
kubectl logs broken-app --previous
```

5. Get pod YAML:
```bash
kubectl get pod broken-app -o yaml
```

6. Delete and recreate:
```bash
kubectl delete pod broken-app
# Fix the yaml file
kubectl apply -f broken-pod.yaml
```

### Common CrashLoopBackOff Causes
- Wrong image or tag
- Missing environment variables
- Application startup failure
- Out of memory (OOMKilled)
- Missing ConfigMap or Secret
- Health check failures

---

## 🎯 Exercise 3: ConfigMaps and Secrets

### Task
Store configuration externally and inject into pods.

### Create ConfigMap
```bash
# From literal values
kubectl create configmap app-config \
  --from-literal=APP_ENV=production \
  --from-literal=LOG_LEVEL=debug

# From file
echo "database_host=mysql.example.com" > config.properties
kubectl create configmap app-config-file --from-file=config.properties
```

### Create Secret
```bash
# From literal
kubectl create secret generic db-credentials \
  --from-literal=username=admin \
  --from-literal=password=secretpass

# Encode manually
echo -n 'admin' | base64
echo -n 'secretpass' | base64
```

### Use in Pod
```yaml
# pod-with-config.yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-config
spec:
  containers:
  - name: app
    image: busybox
    command: ["sh", "-c", "env && sleep 3600"]
    env:
    - name: APP_ENV
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: APP_ENV
    - name: DB_USER
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: username
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: app-config-file
```

```bash
kubectl apply -f pod-with-config.yaml
kubectl exec app-with-config -- env | grep APP_ENV
kubectl exec app-with-config -- cat /etc/config/config.properties
```

---

## 🎯 Exercise 4: Scaling and Resource Management

### Task
Scale applications and manage resources.

### Manual Scaling
```bash
# Scale deployment
kubectl scale deployment nginx --replicas=5

# Check scaling
kubectl get pods -w

# Scale down
kubectl scale deployment nginx --replicas=2
```

### Set Resource Limits
```yaml
# deployment-with-limits.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: resource-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: resource-app
  template:
    metadata:
      labels:
        app: resource-app
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

```bash
kubectl apply -f deployment-with-limits.yaml
kubectl top pods  # Need metrics-server enabled
kubectl describe pod <pod-name> | grep -A 5 "Limits"
```

### Autoscaling (HPA)
```bash
# Enable metrics server in minikube
minikube addons enable metrics-server

# Create HPA
kubectl autoscale deployment nginx --cpu-percent=50 --min=2 --max=10

# Check HPA
kubectl get hpa
kubectl describe hpa nginx

# Generate load to test
kubectl run -it load-generator --rm --image=busybox --restart=Never -- /bin/sh -c "while true; do wget -q -O- http://nginx; done"
```

---

## 🎯 Exercise 5: Health Checks

### Task
Implement liveness and readiness probes.

### Deployment with Probes
```yaml
# deployment-with-probes.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web
        image: nginx:alpine
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 3
```

```bash
kubectl apply -f deployment-with-probes.yaml
kubectl get pods -w
kubectl describe pod <pod-name> | grep -A 10 "Liveness"
```

### Test Probe Failure
```bash
# Exec into pod and break it
kubectl exec -it <pod-name> -- sh
# Inside container:
rm /usr/share/nginx/html/index.html
# Watch pod restart
kubectl get pods -w
```

---

## 🎯 Exercise 6: Rolling Updates and Rollbacks

### Task
Update application version safely.

### Initial Deployment
```bash
kubectl create deployment web --image=nginx:1.19-alpine --replicas=5
kubectl set image deployment/web nginx=nginx:1.19-alpine
```

### Rolling Update
```bash
# Update to new version
kubectl set image deployment/web nginx=nginx:1.20-alpine

# Watch rollout
kubectl rollout status deployment/web

# Check history
kubectl rollout history deployment/web
```

### Check Update Strategy
```bash
kubectl describe deployment web | grep -A 5 "Strategy"
```

### Rollback
```bash
# Rollback to previous version
kubectl rollout undo deployment/web

# Rollback to specific revision
kubectl rollout undo deployment/web --to-revision=1

# Check status
kubectl rollout status deployment/web
```

### Pause/Resume Rollout
```bash
# Pause (for canary testing)
kubectl rollout pause deployment/web

# Make changes
kubectl set image deployment/web nginx=nginx:1.21-alpine

# Resume
kubectl rollout resume deployment/web
```

---

## 🎯 Exercise 7: Networking and Services

### Task
Understand Kubernetes networking and service types.

### ClusterIP (default)
```bash
kubectl create deployment backend --image=nginx:alpine
kubectl expose deployment backend --port=80 --name=backend-svc
kubectl get svc backend-svc

# Access from another pod
kubectl run test-pod --rm -it --image=busybox -- sh
# Inside pod:
wget -qO- backend-svc
```

### NodePort
```bash
kubectl expose deployment backend --port=80 --type=NodePort --name=backend-nodeport
kubectl get svc backend-nodeport
# Note the NodePort (30000-32767 range)

# Access from outside (minikube)
minikube service backend-nodeport --url
curl $(minikube service backend-nodeport --url)
```

### LoadBalancer (minikube)
```bash
kubectl expose deployment backend --port=80 --type=LoadBalancer --name=backend-lb
kubectl get svc backend-lb

# In minikube, use tunnel
minikube tunnel  # In separate terminal
```

### Ingress
```bash
# Enable ingress in minikube
minikube addons enable ingress

# Create ingress
cat << EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: app.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: backend-svc
            port:
              number: 80
EOF

# Get ingress
kubectl get ingress

# Add to /etc/hosts
echo "$(minikube ip) app.local" | sudo tee -a /etc/hosts

# Test
curl http://app.local
```

---

## 🎯 Exercise 8: Persistent Storage

### Task
Store data persistently across pod restarts.

### Create PersistentVolume and PersistentVolumeClaim
```yaml
# pv-pvc.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: task-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: task-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 500Mi
```

```bash
kubectl apply -f pv-pvc.yaml
kubectl get pv
kubectl get pvc
```

### Use PVC in Pod
```yaml
# pod-with-storage.yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-storage
spec:
  containers:
  - name: app
    image: nginx:alpine
    volumeMounts:
    - name: data
      mountPath: /data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: task-pvc
```

```bash
kubectl apply -f pod-with-storage.yaml

# Write data
kubectl exec app-with-storage -- sh -c "echo 'Persistent Data' > /data/test.txt"

# Delete and recreate pod
kubectl delete pod app-with-storage
kubectl apply -f pod-with-storage.yaml

# Data should persist
kubectl exec app-with-storage -- cat /data/test.txt
```

---

## 🎯 Exercise 9: StatefulSets

### Task
Deploy stateful application (e.g., database).

### Create StatefulSet
```yaml
# statefulset.yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql
spec:
  clusterIP: None
  selector:
    app: mysql
  ports:
  - port: 3306
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:5.7
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: "password"
        ports:
        - containerPort: 3306
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
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
kubectl apply -f statefulset.yaml
kubectl get statefulset
kubectl get pods -l app=mysql

# Notice ordered names: mysql-0, mysql-1, mysql-2
# Each has its own PVC
kubectl get pvc
```

---

## 🎯 Exercise 10: Troubleshooting Checklist

### When Pod Won't Start
```bash
# 1. Get basic info
kubectl get pods
kubectl get events --sort-by=.metadata.creationTimestamp

# 2. Describe pod
kubectl describe pod <pod-name>

# 3. Check logs
kubectl logs <pod-name>
kubectl logs <pod-name> --previous
kubectl logs <pod-name> -c <container-name>  # Multi-container

# 4. Check image
docker pull <image-name>  # Can you pull it?

# 5. Check resources
kubectl top nodes
kubectl top pods

# 6. Check node
kubectl get nodes
kubectl describe node <node-name>

# 7. Debug with temporary pod
kubectl run debug --rm -it --image=busybox -- sh

# 8. Port forward for local access
kubectl port-forward <pod-name> 8080:80
```

### When Service Not Accessible
```bash
# 1. Check service
kubectl get svc
kubectl describe svc <service-name>

# 2. Check endpoints
kubectl get endpoints <service-name>

# 3. Check pod labels match service selector
kubectl get pods --show-labels
kubectl describe svc <service-name> | grep Selector

# 4. Test from inside cluster
kubectl run test --rm -it --image=busybox -- sh
# Inside: wget -qO- http://service-name

# 5. Check network policies
kubectl get networkpolicies
```

---

## 📝 Interview Scenarios

### Scenario: Pod keeps restarting
> "First, I'd run `kubectl get pods` to confirm the restart count. Then `kubectl describe pod` to see events and recent status. I'd check logs with `kubectl logs` and `--previous` flag for the crashed container. Common causes are: application crash, OOM kill, failed health checks, or wrong command/args. I'd also check resource requests vs limits."

### Scenario: Can't access service
> "I'd verify the service exists with `kubectl get svc`, then check its endpoints with `kubectl get endpoints service-name`. If endpoints are empty, the pod labels don't match the service selector. I'd verify pods are running and ready, then test connectivity from inside the cluster using a debug pod. Finally, I'd check ingress rules and external load balancer if applicable."

### Scenario: Out of resources
> "I'd run `kubectl describe nodes` to see capacity and allocatable resources. Then `kubectl top nodes` and `kubectl top pods` to see current usage. I'd look for pods without resource requests/limits, or pods requesting too much. Solutions: set proper requests/limits, increase node size, add nodes, or reduce pod replicas."

---

**Pro Tip**: Keep these commands handy during interviews! Practice on Minikube regularly to build muscle memory. 🚀
