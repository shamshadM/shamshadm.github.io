---
title: "Linux Installation Guide: Windows Subsystem for Linux (WSL)"
permalink: /docs/linux-Installation-Guide_WSL/
sidebar: 
   nav: Linux_tutorial
excerpt: "A comprehensive step-by-step guide for installing Linux distributions on a Windows Subsystem for Linux (WSL)"
date: 2026-05-09
categories: [linux, installation, wsl, tutorial]
tags: [ubuntu, debian, fedora, arch, wsl]
toc: true
toc_label: "Linux Installation Guide: WSL"
toc_sticky: true
author_profile: false
---

## Window Subsystem for Linux (WSL) Installation

### 1. WSL Prerequisites

- **Windows 10** version 2004 (Build 19041) or higher
- **Windows 11** (fully supported, recommended)
- **64-bit processor** with virtualization support (Intel VT-x / AMD-V)
- Virtualization must be **enabled in BIOS**

#### Check Windows Version

```powershell
winver
# Or
[System.Environment]::OSVersion.Version
```

#### Enable Virtualization

In BIOS: Look for **Intel Virtualization Technology** or **AMD-V / SVM Mode** → Enable it.

---

### 2. Enable WSL (WSL 2)

Open **PowerShell as Administrator**:

#### Method 1: Single Command (Windows 11 / Updated Windows 10)

```powershell
# This installs WSL 2 + Ubuntu by default
wsl --install

# Restart your PC when prompted
```

#### Method 2: Step-by-Step (All Windows 10/11)

```powershell
# Step 1: Enable WSL feature
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Step 2: Enable Virtual Machine Platform
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Step 3: Restart PC
Restart-Computer

# Step 4: Set WSL 2 as default
wsl --set-default-version 2

# Step 5: Download and install WSL2 kernel update (if prompted)
# Download from: https://aka.ms/wsl2kernel
```

#### Verify WSL Installation

```powershell
wsl --status
wsl --version
```

---

### 3. Install a Linux Distribution via WSL

#### Option A: Microsoft Store

1. Open **Microsoft Store**
2. Search for your preferred distro:
   - Ubuntu 24.04 LTS
   - Debian GNU/Linux
   - Fedora Linux (via third-party)
   - openSUSE Leap 15.5
   - Kali Linux
3. Click **Install**
4. Launch the app and complete initial setup

#### Option B: Command Line

```powershell
# List all available distributions
wsl --list --online

# Output example:
# NAME                            FRIENDLY NAME
# Ubuntu                          Ubuntu
# Debian                          Debian GNU/Linux
# kali-linux                      Kali Linux Rolling
# Ubuntu-22.04                    Ubuntu 22.04 LTS
# Ubuntu-24.04                    Ubuntu 24.04 LTS
# OracleLinux_8_7                 Oracle Linux 8.7
# openSUSE-Leap-15.5              openSUSE Leap 15.5

# Install a specific distro
wsl --install -d Ubuntu-24.04
wsl --install -d Debian
wsl --install -d kali-linux

# List installed distros
wsl --list --verbose
```

#### First-Time Setup (After Installation)

Each new WSL distro will ask you to create a **Unix username and password**:

```
Enter new UNIX username: yourname
New password: ****
Retype new password: ****
passwd: password updated successfully
```

---

### 4. WSL Configuration & Setup

#### Set Default Distribution

```powershell
# Set Ubuntu as default
wsl --set-default Ubuntu-24.04
```

#### WSL Global Configuration (`%USERPROFILE%\.wslconfig`)

Create this file in your Windows home directory to configure WSL globally:

```ini
# C:\Users\YourName\.wslconfig

[wsl2]
# Limit memory usage
memory=4GB

# Limit CPU cores
processors=4

# Enable swap
swap=2GB

# Custom kernel (optional)
# kernel=C:\\Users\\YourName\\kernel

# Enable localhost forwarding
localhostForwarding=true

# Enable nested virtualization
nestedVirtualization=true
```

#### WSL Distribution Configuration (`/etc/wsl.conf`)

Inside your WSL distro, edit `/etc/wsl.conf`:

```ini
# /etc/wsl.conf

[boot]
# Enable systemd (WSL 2 only — Windows 11 / updated Win10)
systemd=true

[user]
# Set default login user
default=yourname

[network]
hostname=my-wsl-machine
generateHosts=true
generateResolvConf=true

[interop]
enabled=true
appendWindowsPath=true

[automount]
enabled=true
mountFsTab=true
root=/mnt/
options="metadata,umask=22,fmask=11"
```

Restart WSL after editing:

```powershell
wsl --shutdown
wsl
```

---

### 5. WSL GUI Apps (WSLg)

**WSLg** (WSL GUI) is built into Windows 11 and allows running Linux GUI apps natively.

#### Check WSLg Support

```powershell
wsl --version
# Look for: WSLg version
```

#### Install GUI Apps in WSL

```bash
# Inside WSL terminal

# Update first
sudo apt update && sudo apt upgrade -y

# Install a GUI text editor
sudo apt install -y gedit

# Install a file manager
sudo apt install -y nautilus

# Install VS Code (or use Windows VS Code with WSL extension)
sudo apt install -y code

# Run GUI app
gedit &
```

#### Install Full Desktop Environment (Advanced)

```bash
# XFCE Desktop (lightweight)
sudo apt install -y xfce4 xfce4-goodies

# Or GNOME (heavier)
sudo apt install -y ubuntu-desktop

# Access via Windows RDP (Remote Desktop)
sudo apt install -y xrdp
sudo service xrdp start
# Connect via: mstsc → localhost:3390
```

---

### 6. WSL Networking & File System

#### Accessing Files Between Windows & Linux

```bash
# Access Windows drives from WSL
ls /mnt/c/          # C: drive
ls /mnt/d/          # D: drive

# Access WSL files from Windows Explorer
# Type in Explorer address bar:
\\wsl$\Ubuntu-24.04\home\yourname\

# Or open current WSL folder in Explorer
explorer.exe .
```

#### Port Forwarding (Access WSL Services from Windows)

WSL 2 uses a virtual network interface. Access Linux services at `localhost` by default:

```bash
# Start a web server in WSL
python3 -m http.server 8080

# Access from Windows browser at:
# http://localhost:8080
```

#### Configure Custom DNS (if needed)

```bash
# Disable auto-generated resolv.conf
sudo nano /etc/wsl.conf
# Add under [network]:
# generateResolvConf=false

# Manually set DNS
sudo nano /etc/resolv.conf
# Add:
# nameserver 8.8.8.8
# nameserver 8.8.4.4
```

---

### 7. WSL Post-Install Steps

```bash
# Update packages
sudo apt update && sudo apt upgrade -y     # Ubuntu/Debian
sudo dnf update -y                          # Fedora

# Install essential developer tools
sudo apt install -y \
  curl wget git vim nano htop \
  build-essential cmake \
  python3 python3-pip nodejs npm \
  zsh tmux

# Install Oh My Zsh (popular shell enhancement)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Install nvm (Node version manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Install pyenv (Python version manager)
curl https://pyenv.run | bash
```

#### Integrate WSL with Windows VS Code

```powershell
# In Windows PowerShell — install VS Code Remote WSL extension
code --install-extension ms-vscode-remote.remote-wsl
```

```bash
# From inside WSL — open VS Code connected to WSL
code .
```

---
## Troubleshooting Common Issues
### WSL Issues

| Problem | Solution |
|---|---|
| `wsl --install` fails | Run PowerShell as Administrator; check Windows version |
| WSL 2 not available | Update Windows; install WSL2 kernel update manually |
| Distro launches then immediately closes | Check Windows Event Viewer; update WSL: `wsl --update` |
| Cannot connect to internet in WSL | Check DNS: `cat /etc/resolv.conf`; restart with `wsl --shutdown` |
| Slow file I/O | Store project files inside WSL filesystem (`~/`), not on `/mnt/c/` |
| GUI apps not working | Update WSL: `wsl --update`; ensure Windows 11 or updated Win10 |
| "Error 0x80370102" | Enable virtualization in BIOS; enable Hyper-V |
| High disk/memory usage | Configure `.wslconfig` to limit resources |

#### Reset a WSL Distribution

```powershell
# Unregister (deletes distro data — use with caution!)
wsl --unregister Ubuntu-24.04

# Re-install fresh
wsl --install -d Ubuntu-24.04
```

#### WSL Disk Compaction

```powershell
# Compact WSL virtual disk (run in PowerShell as Admin)
wsl --shutdown
diskpart
# In diskpart:
select vdisk file="C:\Users\YourName\AppData\Local\Packages\...\ext4.vhdx"
attach vdisk readonly
compact vdisk
detach vdisk
exit
```

---

## Quick Reference Cheatsheet

### Essential WSL Commands

```powershell
wsl                          # Launch default distro
wsl -d Ubuntu-24.04          # Launch specific distro
wsl --list --verbose         # List all distros with WSL version
wsl --set-version Ubuntu 2   # Upgrade distro to WSL 2
wsl --shutdown               # Stop all WSL instances
wsl --update                 # Update WSL kernel
wsl --export Ubuntu backup.tar    # Export distro backup
wsl --import Ubuntu . backup.tar  # Import distro backup
wsl --unregister Ubuntu      # Remove distro (DELETES DATA)
```
---
### Essential Linux Commands (Post-Install)

```bash
# System info
uname -a                     # Kernel info
lsb_release -a               # Distro info
df -h                        # Disk usage
free -h                      # Memory usage
lscpu                        # CPU info
lsblk                        # Block devices

# Package management
sudo apt update              # Refresh package list (Debian/Ubuntu)
sudo apt install package     # Install package
sudo apt remove package      # Remove package
sudo dnf install package     # Fedora
sudo pacman -S package       # Arch

# Services
sudo systemctl start service
sudo systemctl enable service
sudo systemctl status service

# User management
whoami                       # Current user
id                           # User/group IDs
sudo adduser newuser         # Add user
```

---

## Resources & Further Reading

- 📖 [Ubuntu Official Documentation](https://ubuntu.com/tutorials)
- 📖 [Arch Wiki](https://wiki.archlinux.org) — Best Linux reference wiki
- 📖 [Microsoft WSL Documentation](https://learn.microsoft.com/en-us/windows/wsl/)
- 📖 [Fedora Quick Docs](https://docs.fedoraproject.org/en-US/quick-docs/)
- 📖 [Debian Reference Manual](https://www.debian.org/doc/manuals/debian-reference/)
- 🐧 [DistroWatch](https://distrowatch.com) — Compare Linux distributions
- 💬 [r/linux4noobs](https://reddit.com/r/linux4noobs) — Community support

---
