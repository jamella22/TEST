# 🏗️ Terraform Lab - Infrastructure as Code

Learn Infrastructure as Code with practical Terraform examples.

## 🚀 Setup

### Install Terraform
```bash
# macOS
brew install terraform

# Linux
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Windows (PowerShell)
choco install terraform

# Verify
terraform version
```

---

## 📚 Lab Exercises

### Exercise 1: Basic Docker Infrastructure

Create `main.tf`:
```hcl
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "nginx" {
  name         = "nginx:alpine"
  keep_locally = false
}

resource "docker_container" "nginx" {
  image = docker_image.nginx.image_id
  name  = "terraform-nginx"

  ports {
    internal = 80
    external = 8080
  }
}
```

**Run it:**
```bash
terraform init
terraform plan
terraform apply

# Test
curl http://localhost:8080

# Cleanup
terraform destroy
```

---

### Exercise 2: Multi-Container Stack with Variables

**variables.tf:**
```hcl
variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "app_port" {
  description = "Application external port"
  type        = number
  default     = 8080
}

variable "replica_count" {
  description = "Number of app replicas"
  type        = number
  default     = 2

  validation {
    condition     = var.replica_count >= 1 && var.replica_count <= 10
    error_message = "Replica count must be between 1 and 10."
  }
}
```

**main.tf:**
```hcl
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# Network
resource "docker_network" "app_network" {
  name = "${var.environment}-network"
}

# Redis
resource "docker_image" "redis" {
  name = "redis:alpine"
}

resource "docker_container" "redis" {
  image = docker_image.redis.image_id
  name  = "${var.environment}-redis"

  networks_advanced {
    name = docker_network.app_network.name
  }
}

# Nginx
resource "docker_image" "nginx" {
  name = "nginx:alpine"
}

resource "docker_container" "nginx" {
  count = var.replica_count
  image = docker_image.nginx.image_id
  name  = "${var.environment}-nginx-${count.index + 1}"

  ports {
    internal = 80
    external = var.app_port + count.index
  }

  networks_advanced {
    name = docker_network.app_network.name
  }

  labels {
    label = "environment"
    value = var.environment
  }
}
```

**outputs.tf:**
```hcl
output "nginx_urls" {
  description = "URLs to access Nginx containers"
  value = [
    for container in docker_container.nginx :
    "http://localhost:${container.ports[0].external}"
  ]
}

output "redis_name" {
  description = "Redis container name"
  value       = docker_container.redis.name
}

output "network_name" {
  description = "Docker network name"
  value       = docker_network.app_network.name
}
```

**Run with variables:**
```bash
terraform init
terraform plan -var="environment=staging" -var="replica_count=3"
terraform apply -var="environment=staging" -var="replica_count=3"

# Or use a tfvars file
echo 'environment = "production"' > prod.tfvars
echo 'replica_count = 5' >> prod.tfvars
echo 'app_port = 9000' >> prod.tfvars

terraform apply -var-file="prod.tfvars"
```

---

### Exercise 3: Modules (Reusable Components)

**Directory structure:**
```
terraform/
├── main.tf
├── modules/
│   └── web-service/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
```

**modules/web-service/variables.tf:**
```hcl
variable "service_name" {
  type = string
}

variable "image" {
  type = string
}

variable "port_internal" {
  type = number
}

variable "port_external" {
  type = number
}

variable "network_name" {
  type = string
}
```

**modules/web-service/main.tf:**
```hcl
resource "docker_image" "service" {
  name = var.image
}

resource "docker_container" "service" {
  image = docker_image.service.image_id
  name  = var.service_name

  ports {
    internal = var.port_internal
    external = var.port_external
  }

  networks_advanced {
    name = var.network_name
  }
}
```

**modules/web-service/outputs.tf:**
```hcl
output "container_id" {
  value = docker_container.service.id
}

output "url" {
  value = "http://localhost:${var.port_external}"
}
```

**main.tf (using module):**
```hcl
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

resource "docker_network" "main" {
  name = "app-network"
}

module "nginx" {
  source = "./modules/web-service"

  service_name   = "nginx-service"
  image          = "nginx:alpine"
  port_internal  = 80
  port_external  = 8080
  network_name   = docker_network.main.name
}

module "httpd" {
  source = "./modules/web-service"

  service_name   = "httpd-service"
  image          = "httpd:alpine"
  port_internal  = 80
  port_external  = 8081
  network_name   = docker_network.main.name
}

output "nginx_url" {
  value = module.nginx.url
}

output "httpd_url" {
  value = module.httpd.url
}
```

```bash
terraform init
terraform apply
```

---

### Exercise 4: State Management

**Local State:**
```bash
# State is stored in terraform.tfstate
cat terraform.tfstate

# List resources in state
terraform state list

# Show specific resource
terraform state show docker_container.nginx

# Remove resource from state (doesn't destroy)
terraform state rm docker_container.nginx
```

**Remote State (S3 backend example):**
```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

**State Locking:**
- Prevents concurrent modifications
- Use DynamoDB for AWS, Consul, or built-in local locks

---

### Exercise 5: Workspaces (Multi-Environment)

```bash
# List workspaces
terraform workspace list

# Create new workspace
terraform workspace new staging
terraform workspace new production

# Switch workspace
terraform workspace select staging

# Deploy to staging
terraform apply

# Switch to production
terraform workspace select production
terraform apply

# Current workspace in code:
# terraform.workspace
```

**Use workspace in configuration:**
```hcl
locals {
  env_config = {
    dev = {
      replicas = 1
      port     = 8080
    }
    staging = {
      replicas = 2
      port     = 9080
    }
    production = {
      replicas = 5
      port     = 80
    }
  }
  
  config = local.env_config[terraform.workspace]
}

resource "docker_container" "app" {
  count = local.config.replicas
  # ...
}
```

---

### Exercise 6: Import Existing Resources

**Scenario:** You have a manually created Docker container that you want to manage with Terraform.

```bash
# 1. Create container manually
docker run -d --name manual-nginx -p 8888:80 nginx:alpine

# 2. Write Terraform config for it
cat > import-example.tf <<EOF
resource "docker_container" "manual" {
  name  = "manual-nginx"
  image = "nginx:alpine"
  
  ports {
    internal = 80
    external = 8888
  }
}
EOF

# 3. Import into Terraform state
terraform import docker_container.manual manual-nginx

# 4. Verify
terraform state show docker_container.manual

# 5. Now managed by Terraform
terraform plan
```

---

## 🎯 Real-World Scenarios

### Scenario 1: AWS EC2 with Security Group

```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "web" {
  name        = "web-sg"
  description = "Security group for web server"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"]  # Restrict SSH
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2
  instance_type = "t3.micro"
  
  vpc_security_group_ids = [aws_security_group.web.id]
  
  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y httpd
              systemctl start httpd
              systemctl enable httpd
              echo "Hello from Terraform" > /var/www/html/index.html
              EOF

  tags = {
    Name        = "web-server"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}

output "instance_public_ip" {
  value = aws_instance.web.public_ip
}
```

---

### Scenario 2: VMware vSphere (for VMware SRE role)

```hcl
provider "vsphere" {
  user           = var.vsphere_user
  password       = var.vsphere_password
  vsphere_server = var.vsphere_server
  
  allow_unverified_ssl = true
}

data "vsphere_datacenter" "dc" {
  name = "Datacenter"
}

data "vsphere_datastore" "datastore" {
  name          = "datastore1"
  datacenter_id = data.vsphere_datacenter.dc.id
}

data "vsphere_resource_pool" "pool" {
  name          = "cluster/Resources"
  datacenter_id = data.vsphere_datacenter.dc.id
}

data "vsphere_network" "network" {
  name          = "VM Network"
  datacenter_id = data.vsphere_datacenter.dc.id
}

resource "vsphere_virtual_machine" "vm" {
  name             = "terraform-vm"
  resource_pool_id = data.vsphere_resource_pool.pool.id
  datastore_id     = data.vsphere_datastore.datastore.id

  num_cpus = 2
  memory   = 4096
  guest_id = "ubuntu64Guest"

  network_interface {
    network_id = data.vsphere_network.network.id
  }

  disk {
    label = "disk0"
    size  = 20
  }
}
```

---

## 🧪 Challenge Tasks

### Task 1: Blue-Green Deployment
Create two identical environments (blue/green) and implement a switch mechanism.

### Task 2: Dependency Management
Create resources with explicit dependencies using `depends_on`.

### Task 3: Dynamic Blocks
Use `dynamic` blocks to create multiple similar nested blocks.

### Task 4: Data Sources
Read existing infrastructure and use it in your config (e.g., existing VPC).

### Task 5: Terraform Cloud
Configure remote execution and state storage with Terraform Cloud.

---

## 📝 Best Practices Checklist

- [ ] Use version control for Terraform files
- [ ] Enable remote state with locking
- [ ] Use variables for all environment-specific values
- [ ] Create reusable modules
- [ ] Add meaningful outputs
- [ ] Use `terraform fmt` and `terraform validate`
- [ ] Never commit `terraform.tfstate` or secrets
- [ ] Use `.gitignore`:
```
.terraform/
*.tfstate
*.tfstate.backup
*.tfvars
.terraform.lock.hcl
```
- [ ] Document modules with README
- [ ] Use workspaces or separate state per environment

---

## 🧹 Cleanup

```bash
terraform destroy -auto-approve
rm -rf .terraform terraform.tfstate*
```

---

## 📖 Key Learnings

✅ Write declarative infrastructure code  
✅ Manage state and dependencies  
✅ Create reusable modules  
✅ Handle multiple environments  
✅ Import existing resources  
✅ Follow IaC best practices  

---

**Next:** Move to `05-ansible` for configuration management! 🔧

