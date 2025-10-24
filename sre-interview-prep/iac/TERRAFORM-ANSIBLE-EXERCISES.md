# ⚙️ Infrastructure as Code Exercises

Terraform and Ansible практически упражнения.

---

## 🏗️ TERRAFORM EXERCISES

### 🎯 Exercise 1: Basic Infrastructure

#### Task
Create a simple infrastructure with VPC, subnet, and EC2 instance.

#### Setup
```bash
mkdir terraform-lab && cd terraform-lab
```

#### main.tf
```hcl
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  
  # For local testing without AWS credentials
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
  s3_use_path_style          = true
}

# Variables
variable "aws_region" {
  description = "AWS region"
  default     = "eu-central-1"
}

variable "environment" {
  description = "Environment name"
  default     = "dev"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
  }
}

# Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.environment}-public-subnet"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.environment}-igw"
    Environment = var.environment
  }
}

# Security Group
resource "aws_security_group" "web" {
  name        = "${var.environment}-web-sg"
  description = "Allow HTTP and SSH"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH"
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound"
  }

  tags = {
    Name        = "${var.environment}-web-sg"
    Environment = var.environment
  }
}

# Outputs
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "subnet_id" {
  description = "Subnet ID"
  value       = aws_subnet.public.id
}

output "security_group_id" {
  description = "Security Group ID"
  value       = aws_security_group.web.id
}
```

#### Commands
```bash
# Initialize
terraform init

# Format code
terraform fmt

# Validate
terraform validate

# Plan (dry run)
terraform plan

# Show plan in JSON
terraform plan -out=tfplan
terraform show -json tfplan | jq

# Check resources that will be created
terraform plan | grep "will be created"
```

---

### 🎯 Exercise 2: Modules and Reusability

#### Task
Create reusable modules for common infrastructure.

#### Directory Structure
```
terraform-modules/
├── modules/
│   ├── network/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── compute/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
└── main.tf
```

#### modules/network/variables.tf
```hcl
variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}
```

#### modules/network/main.tf
```hcl
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.environment}-public-${count.index + 1}"
    Environment = var.environment
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}
```

#### modules/network/outputs.tf
```hcl
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = aws_subnet.public[*].id
}
```

#### main.tf (using module)
```hcl
module "network" {
  source = "./modules/network"

  environment          = "production"
  vpc_cidr             = "10.0.0.0/16"
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
}

output "network_vpc_id" {
  value = module.network.vpc_id
}
```

#### Commands
```bash
# Initialize modules
terraform init

# Plan with module
terraform plan

# Show module resources
terraform state list | grep module
```

---

### 🎯 Exercise 3: State Management

#### Task
Configure remote state with S3 backend.

#### backend.tf
```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state-bucket"
    key            = "prod/terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```

#### State Commands
```bash
# List resources in state
terraform state list

# Show specific resource
terraform state show aws_vpc.main

# Move resource in state
terraform state mv aws_instance.old aws_instance.new

# Remove resource from state (doesn't delete)
terraform state rm aws_instance.test

# Pull state
terraform state pull > terraform.tfstate.backup

# Replace provider (if changed)
terraform state replace-provider old-provider new-provider

# Import existing resource
terraform import aws_instance.example i-1234567890abcdef0

# Show current workspace
terraform workspace list

# Create new workspace
terraform workspace new staging

# Switch workspace
terraform workspace select production
```

---

### 🎯 Exercise 4: Variables and Validation

#### variables.tf
```hcl
variable "environment" {
  description = "Environment name"
  type        = string
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
  
  validation {
    condition     = can(regex("^t3\\.(micro|small|medium)$", var.instance_type))
    error_message = "Instance type must be t3.micro, t3.small, or t3.medium."
  }
}

variable "allowed_cidr_blocks" {
  description = "Allowed CIDR blocks for SSH"
  type        = list(string)
  
  validation {
    condition     = alltrue([for cidr in var.allowed_cidr_blocks : can(cidrhost(cidr, 0))])
    error_message = "All elements must be valid CIDR blocks."
  }
}

variable "tags" {
  description = "Common tags for resources"
  type        = map(string)
  default = {
    Terraform   = "true"
    Environment = "dev"
  }
}
```

#### terraform.tfvars
```hcl
environment         = "prod"
instance_type       = "t3.small"
allowed_cidr_blocks = ["10.0.0.0/8", "172.16.0.0/12"]
tags = {
  Project     = "SRE-Lab"
  Owner       = "DevOps Team"
  CostCenter  = "Engineering"
}
```

---

## 🔧 ANSIBLE EXERCISES

### 🎯 Exercise 5: Basic Playbook

#### Task
Create playbook to install and configure Nginx.

#### inventory.ini
```ini
[webservers]
web1 ansible_host=192.168.1.10 ansible_user=ubuntu
web2 ansible_host=192.168.1.11 ansible_user=ubuntu

[databases]
db1 ansible_host=192.168.1.20 ansible_user=ubuntu

[all:vars]
ansible_python_interpreter=/usr/bin/python3
ansible_ssh_private_key_file=~/.ssh/id_rsa
```

#### playbook.yml
```yaml
---
- name: Configure web servers
  hosts: webservers
  become: yes
  
  vars:
    nginx_port: 80
    app_user: www-data
    
  tasks:
    - name: Update apt cache
      apt:
        update_cache: yes
        cache_valid_time: 3600
      
    - name: Install Nginx
      apt:
        name: nginx
        state: present
        
    - name: Install required packages
      apt:
        name:
          - curl
          - vim
          - git
        state: present
        
    - name: Create web directory
      file:
        path: /var/www/html
        state: directory
        owner: "{{ app_user }}"
        group: "{{ app_user }}"
        mode: '0755'
        
    - name: Copy index.html
      copy:
        content: |
          <!DOCTYPE html>
          <html>
          <head><title>SRE Lab</title></head>
          <body>
            <h1>Welcome to {{ ansible_hostname }}</h1>
            <p>Deployed with Ansible</p>
          </body>
          </html>
        dest: /var/www/html/index.html
        owner: "{{ app_user }}"
        mode: '0644'
        
    - name: Ensure Nginx is running
      service:
        name: nginx
        state: started
        enabled: yes
        
    - name: Test Nginx response
      uri:
        url: "http://localhost:{{ nginx_port }}"
        return_content: yes
      register: response
      failed_when: "'Welcome' not in response.content"
      
  handlers:
    - name: restart nginx
      service:
        name: nginx
        state: restarted
```

#### Commands
```bash
# Check syntax
ansible-playbook playbook.yml --syntax-check

# Dry run (check mode)
ansible-playbook -i inventory.ini playbook.yml --check

# Run playbook
ansible-playbook -i inventory.ini playbook.yml

# Run with verbose output
ansible-playbook -i inventory.ini playbook.yml -v

# Run specific tags
ansible-playbook -i inventory.ini playbook.yml --tags nginx

# Limit to specific hosts
ansible-playbook -i inventory.ini playbook.yml --limit web1
```

---

### 🎯 Exercise 6: Roles

#### Task
Organize playbooks into reusable roles.

#### Directory Structure
```
ansible-roles/
├── roles/
│   ├── common/
│   │   ├── tasks/
│   │   │   └── main.yml
│   │   ├── handlers/
│   │   │   └── main.yml
│   │   ├── templates/
│   │   ├── files/
│   │   ├── vars/
│   │   │   └── main.yml
│   │   └── defaults/
│   │       └── main.yml
│   └── nginx/
│       └── tasks/
│           └── main.yml
├── inventory/
│   ├── production
│   └── staging
└── site.yml
```

#### roles/common/tasks/main.yml
```yaml
---
- name: Update system packages
  apt:
    update_cache: yes
    upgrade: dist
  when: ansible_os_family == "Debian"

- name: Install common packages
  apt:
    name:
      - vim
      - curl
      - wget
      - git
      - htop
      - net-tools
    state: present

- name: Configure timezone
  timezone:
    name: Europe/Sofia

- name: Create deployment user
  user:
    name: deploy
    groups: sudo
    shell: /bin/bash
    create_home: yes

- name: Add SSH key for deploy user
  authorized_key:
    user: deploy
    key: "{{ lookup('file', '~/.ssh/id_rsa.pub') }}"
```

#### roles/nginx/tasks/main.yml
```yaml
---
- name: Install Nginx
  apt:
    name: nginx
    state: present
  notify: restart nginx

- name: Copy Nginx configuration
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
    validate: 'nginx -t -c %s'
  notify: reload nginx

- name: Ensure Nginx is running
  service:
    name: nginx
    state: started
    enabled: yes
```

#### site.yml
```yaml
---
- name: Configure all servers
  hosts: all
  become: yes
  roles:
    - common

- name: Configure web servers
  hosts: webservers
  become: yes
  roles:
    - nginx
```

#### Commands
```bash
# Initialize role structure
ansible-galaxy init roles/common

# Run site playbook
ansible-playbook -i inventory/production site.yml

# Run specific role
ansible-playbook -i inventory/production site.yml --tags nginx
```

---

### 🎯 Exercise 7: Ansible Vault

#### Task
Encrypt sensitive data.

#### Create encrypted file
```bash
# Create encrypted vars file
ansible-vault create secrets.yml
# Enter password, then edit:
# ---
# db_password: supersecret123
# api_key: abc123def456

# View encrypted file
ansible-vault view secrets.yml

# Edit encrypted file
ansible-vault edit secrets.yml

# Encrypt existing file
echo "password: secret" > plain.yml
ansible-vault encrypt plain.yml

# Decrypt file
ansible-vault decrypt secrets.yml

# Rekey (change password)
ansible-vault rekey secrets.yml
```

#### Use in playbook
```yaml
---
- name: Deploy application
  hosts: webservers
  become: yes
  vars_files:
    - secrets.yml
    
  tasks:
    - name: Create database config
      template:
        src: database.conf.j2
        dest: /etc/app/database.conf
      no_log: true  # Don't show in output
```

#### Run with vault
```bash
# Prompt for vault password
ansible-playbook -i inventory.ini playbook.yml --ask-vault-pass

# Use password file
echo "mypassword" > .vault_pass
chmod 600 .vault_pass
ansible-playbook -i inventory.ini playbook.yml --vault-password-file .vault_pass
```

---

### 🎯 Exercise 8: Dynamic Inventory

#### Task
Use dynamic inventory from cloud providers.

#### AWS Dynamic Inventory (aws_ec2.yml)
```yaml
plugin: aws_ec2
regions:
  - eu-central-1
filters:
  instance-state-name: running
keyed_groups:
  - key: tags.Environment
    prefix: env
  - key: tags.Role
    prefix: role
hostnames:
  - tag:Name
compose:
  ansible_host: public_ip_address
```

#### Commands
```bash
# Test dynamic inventory
ansible-inventory -i aws_ec2.yml --list
ansible-inventory -i aws_ec2.yml --graph

# Use with playbook
ansible-playbook -i aws_ec2.yml playbook.yml
```

---

### 🎯 Exercise 9: Testing and Validation

#### Task
Test playbooks before production.

#### Molecule Setup
```bash
# Install molecule
pip install molecule molecule-docker ansible-lint

# Initialize new role with molecule
molecule init role my_role --driver-name docker

# Directory structure
my_role/
├── molecule/
│   └── default/
│       ├── converge.yml
│       ├── molecule.yml
│       └── verify.yml
```

#### molecule/default/molecule.yml
```yaml
---
dependency:
  name: galaxy
driver:
  name: docker
platforms:
  - name: instance
    image: ubuntu:20.04
    pre_build_image: true
provisioner:
  name: ansible
verifier:
  name: ansible
```

#### Commands
```bash
# Test role
molecule test

# Create instance
molecule create

# Apply playbook
molecule converge

# Verify
molecule verify

# Destroy
molecule destroy

# Full workflow
molecule test
```

#### Ansible Lint
```bash
# Install
pip install ansible-lint

# Lint playbook
ansible-lint playbook.yml

# Lint role
ansible-lint roles/nginx/
```

---

### 🎯 Exercise 10: Error Handling

#### playbook-with-error-handling.yml
```yaml
---
- name: Robust playbook with error handling
  hosts: webservers
  become: yes
  
  tasks:
    - name: Attempt to start service
      service:
        name: nginx
        state: started
      register: service_result
      failed_when: false
      changed_when: service_result.rc == 0
      
    - name: Check if service started successfully
      debug:
        msg: "Service started: {{ service_result.changed }}"
        
    - name: Fail gracefully if service didn't start
      fail:
        msg: "Failed to start nginx service"
      when: not service_result.changed
      ignore_errors: yes
      
    - name: Always run this task
      debug:
        msg: "This task always runs"
      
    - block:
        - name: Risky task
          command: /bin/false
          
      rescue:
        - name: Handle error
          debug:
            msg: "Caught an error, recovering..."
            
      always:
        - name: Cleanup
          debug:
            msg: "Always run cleanup"
            
    - name: Retry on failure
      uri:
        url: "http://example.com/api"
      register: api_result
      until: api_result.status == 200
      retries: 5
      delay: 10
```

---

## 📝 Interview Questions

### Terraform Questions
1. **What is Terraform state and why is it important?**
   > "State tracks real infrastructure. It maps config to actual resources, stores metadata, and enables dependency tracking. Without state, Terraform doesn't know what exists."

2. **How do you manage secrets in Terraform?**
   > "Never hardcode secrets. Use AWS Secrets Manager, Vault, or environment variables. Reference by ID/ARN, not value. Store .tfvars in .gitignore."

3. **What's the difference between terraform plan and apply?**
   > "Plan shows what will change (dry run). Apply actually makes changes. Always run plan first to review."

### Ansible Questions
1. **What is idempotency and why does it matter?**
   > "Running playbook multiple times produces same result. Important because you can safely re-run without unintended changes."

2. **When would you use roles vs playbooks?**
   > "Roles for reusable, shareable code across projects. Playbooks for specific orchestration tasks. Roles enable better organization and testing."

3. **How do you test Ansible playbooks?**
   > "Use molecule for role testing, ansible-lint for syntax, --check mode for dry runs, and staging environment before production."

---

**Pro Tip**: Practice both Terraform and Ansible regularly. Build real infrastructure to understand gotchas and best practices! 🚀
