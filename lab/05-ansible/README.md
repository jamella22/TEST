# 🔧 Ansible Lab - Configuration Management & Automation

Learn configuration management and deployment automation with Ansible.

## 🚀 Setup

### Install Ansible
```bash
# macOS
brew install ansible

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install ansible -y

# Linux (RHEL/CentOS)
sudo yum install ansible -y

# Python (any OS)
pip3 install ansible

# Verify
ansible --version
```

---

## 📚 Lab Exercises

### Exercise 1: Ad-Hoc Commands

```bash
# Ping local machine
ansible localhost -m ping

# Get system facts
ansible localhost -m setup

# Create a file
ansible localhost -m file -a "path=/tmp/testfile state=touch"

# Install package (requires sudo)
ansible localhost -m apt -a "name=htop state=present" --become

# Run shell command
ansible localhost -m shell -a "uptime"
```

---

### Exercise 2: First Playbook

Create `hello.yml`:
```yaml
---
- name: Hello World Playbook
  hosts: localhost
  connection: local
  
  tasks:
    - name: Print message
      debug:
        msg: "Hello from Ansible!"
    
    - name: Show current date
      command: date
      register: date_output
    
    - name: Display date
      debug:
        var: date_output.stdout
```

**Run it:**
```bash
ansible-playbook hello.yml
```

---

### Exercise 3: Web Server Setup

Create `webserver.yml`:
```yaml
---
- name: Configure Web Server
  hosts: localhost
  become: yes
  
  vars:
    server_name: "mywebserver"
    doc_root: "/var/www/html"
  
  tasks:
    - name: Update apt cache
      apt:
        update_cache: yes
        cache_valid_time: 3600
      when: ansible_os_family == "Debian"
    
    - name: Install Nginx
      apt:
        name: nginx
        state: present
      when: ansible_os_family == "Debian"
    
    - name: Create document root
      file:
        path: "{{ doc_root }}"
        state: directory
        mode: '0755'
    
    - name: Copy index page
      copy:
        content: |
          <html>
          <head><title>{{ server_name }}</title></head>
          <body>
            <h1>Welcome to {{ server_name }}</h1>
            <p>Deployed with Ansible on {{ ansible_date_time.date }}</p>
          </body>
          </html>
        dest: "{{ doc_root }}/index.html"
        mode: '0644'
      notify: Restart Nginx
    
    - name: Ensure Nginx is running
      service:
        name: nginx
        state: started
        enabled: yes
  
  handlers:
    - name: Restart Nginx
      service:
        name: nginx
        state: restarted
```

**Run it:**
```bash
ansible-playbook webserver.yml --ask-become-pass
```

**Test:**
```bash
curl http://localhost
```

---

### Exercise 4: Inventory Management

**inventory.ini:**
```ini
[webservers]
web1 ansible_host=192.168.1.10 ansible_user=ubuntu
web2 ansible_host=192.168.1.11 ansible_user=ubuntu

[databases]
db1 ansible_host=192.168.1.20 ansible_user=ubuntu

[production:children]
webservers
databases

[production:vars]
ansible_python_interpreter=/usr/bin/python3
environment=production
```

**Use inventory:**
```bash
# List all hosts
ansible all -i inventory.ini --list-hosts

# Ping webservers
ansible webservers -i inventory.ini -m ping

# Run playbook on specific group
ansible-playbook deploy.yml -i inventory.ini --limit webservers
```

---

### Exercise 5: Variables & Templates

**vars.yml:**
```yaml
---
app_name: "myapp"
app_port: 8080
app_version: "1.2.3"
environment: "production"
admin_email: "admin@example.com"

nginx_config:
  worker_processes: 4
  worker_connections: 1024
```

**templates/nginx.conf.j2:**
```jinja2
user www-data;
worker_processes {{ nginx_config.worker_processes }};
pid /run/nginx.pid;

events {
    worker_connections {{ nginx_config.worker_connections }};
}

http {
    sendfile on;
    tcp_nopush on;
    
    server {
        listen {{ app_port }};
        server_name {{ ansible_hostname }};
        
        location / {
            root {{ doc_root }};
            index index.html;
        }
        
        location /health {
            return 200 "OK\n";
            add_header Content-Type text/plain;
        }
    }
}
```

**deploy-with-template.yml:**
```yaml
---
- name: Deploy Application with Template
  hosts: localhost
  become: yes
  vars_files:
    - vars.yml
  
  tasks:
    - name: Deploy Nginx config from template
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/nginx.conf
        owner: root
        group: root
        mode: '0644'
      notify: Reload Nginx
    
    - name: Validate Nginx config
      command: nginx -t
      changed_when: false
  
  handlers:
    - name: Reload Nginx
      service:
        name: nginx
        state: reloaded
```

---

### Exercise 6: Roles (Structured Playbooks)

**Directory structure:**
```
ansible/
├── playbook.yml
├── inventory.ini
└── roles/
    └── webserver/
        ├── tasks/
        │   └── main.yml
        ├── handlers/
        │   └── main.yml
        ├── templates/
        │   └── index.html.j2
        ├── files/
        │   └── app.conf
        ├── vars/
        │   └── main.yml
        └── defaults/
            └── main.yml
```

**Create role skeleton:**
```bash
ansible-galaxy init roles/webserver
```

**roles/webserver/tasks/main.yml:**
```yaml
---
- name: Install Nginx
  apt:
    name: nginx
    state: present
  when: ansible_os_family == "Debian"

- name: Deploy index page
  template:
    src: index.html.j2
    dest: /var/www/html/index.html
  notify: restart nginx

- name: Ensure Nginx is running
  service:
    name: nginx
    state: started
    enabled: yes
```

**roles/webserver/handlers/main.yml:**
```yaml
---
- name: restart nginx
  service:
    name: nginx
    state: restarted
```

**roles/webserver/defaults/main.yml:**
```yaml
---
server_name: "default-server"
port: 80
```

**playbook.yml:**
```yaml
---
- name: Deploy Web Servers
  hosts: webservers
  become: yes
  
  roles:
    - webserver
```

**Run:**
```bash
ansible-playbook playbook.yml -i inventory.ini
```

---

### Exercise 7: Secrets with Ansible Vault

**Create encrypted file:**
```bash
ansible-vault create secrets.yml
# Enter password when prompted

# Add content:
db_password: "super_secret_password"
api_key: "abc123xyz789"
```

**Edit encrypted file:**
```bash
ansible-vault edit secrets.yml
```

**Use in playbook:**
```yaml
---
- name: Deploy with Secrets
  hosts: localhost
  vars_files:
    - secrets.yml
  
  tasks:
    - name: Configure database
      template:
        src: db_config.j2
        dest: /etc/app/db.conf
      no_log: true  # Don't log sensitive data
```

**Run with vault password:**
```bash
ansible-playbook deploy.yml --ask-vault-pass

# Or use password file
echo "my_vault_password" > .vault_pass
ansible-playbook deploy.yml --vault-password-file .vault_pass
```

---

### Exercise 8: Idempotency & Check Mode

**Test idempotency:**
```bash
# Run once
ansible-playbook webserver.yml

# Run again - should show no changes
ansible-playbook webserver.yml
```

**Dry-run (check mode):**
```bash
# See what would change without applying
ansible-playbook webserver.yml --check

# With diff output
ansible-playbook webserver.yml --check --diff
```

---

### Exercise 9: Error Handling

```yaml
---
- name: Error Handling Example
  hosts: localhost
  
  tasks:
    - name: Task that might fail
      command: /bin/false
      ignore_errors: yes
      register: result
    
    - name: Show result
      debug:
        var: result
    
    - name: Task with retry
      uri:
        url: http://example.com/api
        method: GET
      register: result
      until: result.status == 200
      retries: 5
      delay: 3
      ignore_errors: yes
    
    - name: Fail when condition met
      fail:
        msg: "Service check failed"
      when: result.status != 200
    
    - name: Always run this (like finally)
      debug:
        msg: "This runs no matter what"
      tags: always
```

---

### Exercise 10: Full Application Deployment

**deploy-app.yml:**
```yaml
---
- name: Deploy Full Application Stack
  hosts: localhost
  become: yes
  
  vars:
    app_name: "demo-app"
    app_version: "1.0.0"
    deploy_dir: "/opt/{{ app_name }}"
    service_user: "appuser"
  
  tasks:
    # 1. Setup
    - name: Create application user
      user:
        name: "{{ service_user }}"
        system: yes
        shell: /bin/bash
    
    - name: Create deployment directory
      file:
        path: "{{ deploy_dir }}"
        state: directory
        owner: "{{ service_user }}"
        mode: '0755'
    
    # 2. Install dependencies
    - name: Install required packages
      apt:
        name:
          - python3
          - python3-pip
          - nginx
        state: present
    
    # 3. Deploy application
    - name: Copy application files
      synchronize:
        src: app/
        dest: "{{ deploy_dir }}/"
      notify: restart app
    
    - name: Install Python dependencies
      pip:
        requirements: "{{ deploy_dir }}/requirements.txt"
        virtualenv: "{{ deploy_dir }}/venv"
      become_user: "{{ service_user }}"
    
    # 4. Configure service
    - name: Deploy systemd service
      template:
        src: templates/app.service.j2
        dest: /etc/systemd/system/{{ app_name }}.service
      notify:
        - reload systemd
        - restart app
    
    - name: Enable and start service
      systemd:
        name: "{{ app_name }}"
        enabled: yes
        state: started
    
    # 5. Configure reverse proxy
    - name: Deploy Nginx config
      template:
        src: templates/nginx-app.conf.j2
        dest: /etc/nginx/sites-available/{{ app_name }}
      notify: reload nginx
    
    - name: Enable Nginx site
      file:
        src: /etc/nginx/sites-available/{{ app_name }}
        dest: /etc/nginx/sites-enabled/{{ app_name }}
        state: link
      notify: reload nginx
    
    # 6. Health check
    - name: Wait for app to be ready
      uri:
        url: http://localhost:8080/health
        status_code: 200
      register: result
      until: result.status == 200
      retries: 10
      delay: 2
  
  handlers:
    - name: reload systemd
      systemd:
        daemon_reload: yes
    
    - name: restart app
      systemd:
        name: "{{ app_name }}"
        state: restarted
    
    - name: reload nginx
      service:
        name: nginx
        state: reloaded
```

---

## 🎯 Real-World Scenarios

### Scenario 1: Multi-Environment Deployment

**group_vars/dev.yml:**
```yaml
environment: dev
app_port: 8080
db_host: dev-db.local
debug_mode: true
```

**group_vars/prod.yml:**
```yaml
environment: production
app_port: 80
db_host: prod-db.local
debug_mode: false
```

**Deploy:**
```bash
# Dev
ansible-playbook deploy.yml -i inventory_dev.ini

# Production
ansible-playbook deploy.yml -i inventory_prod.ini
```

---

### Scenario 2: Rolling Update with Health Checks

```yaml
---
- name: Rolling Update
  hosts: webservers
  serial: 1  # Update one host at a time
  max_fail_percentage: 25
  
  tasks:
    - name: Remove from load balancer
      command: lb-remove {{ inventory_hostname }}
      delegate_to: loadbalancer
    
    - name: Deploy new version
      copy:
        src: app-v2.0.0.tar.gz
        dest: /opt/app/
    
    - name: Restart service
      systemd:
        name: myapp
        state: restarted
    
    - name: Wait for app to be healthy
      uri:
        url: http://localhost:8080/health
      register: result
      until: result.status == 200
      retries: 10
      delay: 3
    
    - name: Add back to load balancer
      command: lb-add {{ inventory_hostname }}
      delegate_to: loadbalancer
```

---

## 🧪 Challenge Tasks

### Task 1: Zero-Downtime Deploy
Implement blue-green or rolling deployment with health checks.

### Task 2: Configuration Drift Detection
Run playbook in check mode and report any configuration drift.

### Task 3: Dynamic Inventory
Use dynamic inventory from cloud provider (AWS, Azure).

### Task 4: Custom Module
Write a simple custom Ansible module in Python.

### Task 5: CI/CD Integration
Integrate Ansible playbook into Jenkins/GitHub Actions pipeline.

---

## 📝 Best Practices Checklist

- [ ] Use roles for organization
- [ ] Encrypt secrets with Ansible Vault
- [ ] Test with `--check` before applying
- [ ] Use `changed_when` and `failed_when` for accuracy
- [ ] Add `no_log: true` for sensitive tasks
- [ ] Use handlers for service restarts
- [ ] Implement idempotency
- [ ] Version control your playbooks
- [ ] Document variables and dependencies
- [ ] Use tags for selective execution
- [ ] Implement proper error handling

---

## 🧹 Cleanup

```bash
# Remove deployed resources
ansible-playbook cleanup.yml

# Uninstall packages
ansible localhost -m apt -a "name=nginx state=absent" --become
```

---

## 📖 Key Learnings

✅ Write declarative configuration playbooks  
✅ Manage multi-host environments  
✅ Use templates and variables effectively  
✅ Organize code with roles  
✅ Secure secrets with Vault  
✅ Implement idempotent operations  
✅ Handle errors and retries  

---

**Next:** Move to `06-incident-simulation` to practice troubleshooting! 🚨

