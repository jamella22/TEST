#!/bin/bash
# Script to install tools on ubuntu-node

echo "🔧 Installing tools on Ubuntu Node..."

# Update package lists
apt-get update -qq

# Install essential tools
apt-get install -y \
    curl \
    wget \
    vim \
    nano \
    net-tools \
    iproute2 \
    iputils-ping \
    dnsutils \
    procps \
    htop \
    sysstat \
    stress-ng \
    openssh-server

# Start SSH service
service ssh start

echo "✅ Tools installed successfully!"
echo ""
echo "Available tools:"
echo "  - curl, wget (HTTP clients)"
echo "  - vim, nano (text editors)"
echo "  - ping, dig, netstat (networking)"
echo "  - htop, top (process monitoring)"
echo "  - stress-ng (load testing)"
echo "  - ssh (remote access)"

