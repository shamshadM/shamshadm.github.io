---
title: "Linux Installation Guide: Fresh PC / Laptop"
permalink: /docs/linux-Installation-Guide_fresh/
description: "A comprehensive step-by-step guide for installing Linux distributions on a fresh PC / Laptop"
date: 2026-05-09
categories: [linux, installation, wsl, tutorial]
tags: [ubuntu, debian, fedora, arch, dual-boot, virtualbox, fresh-install]
toc: true
toc_label: "Linux Installation Guide"
toc_sticky: true
---

# 🐧 Linux Installation Guide

> A complete, step-by-step reference for installing Linux on a **fresh PC / Laptop**.

---

## Overview & Choosing a Distribution

Before installing, pick the right distribution for your needs:

| Distribution | Best For | Package Manager | Difficulty |
|---|---|---|---|
| **Ubuntu 24.04 LTS** | Beginners, general use | `apt` | ⭐ Easy |
| **Linux Mint** | Windows switchers | `apt` | ⭐ Easy |
| **Fedora 40** | Developers, up-to-date packages | `dnf` | ⭐⭐ Medium |
| **Debian 12** | Servers, stability | `apt` | ⭐⭐ Medium |
| **openSUSE Leap** | Enterprise workloads | `zypper` | ⭐⭐ Medium |
| **Arch Linux** | Advanced users, rolling release | `pacman` | ⭐⭐⭐ Hard |
| **Manjaro** | Arch-based, user-friendly | `pacman` | ⭐⭐ Medium |
| **Pop!_OS** | Developers, NVIDIA GPU users | `apt` | ⭐ Easy |

---

## Fresh PC / Laptop Installation

### 1. Prerequisites & Hardware Check

#### Minimum Hardware Requirements

| Component | Ubuntu/Mint | Fedora | Arch Linux |
|---|---|---|---|
| **CPU** | 2 GHz dual-core | 2 GHz dual-core | Any x86_64 |
| **RAM** | 4 GB (8 GB recommended) | 2 GB (4 GB recommended) | 512 MB (2 GB recommended) |
| **Storage** | 25 GB | 20 GB | 2 GB (base) |
| **Display** | 1024×768 | 1024×768 | N/A (TTY) |

#### Pre-Installation Checklist

```
[ ] Back up all important data from the target machine
[ ] Note your WiFi password
[ ] Have a USB drive (8 GB minimum, 16 GB recommended)
[ ] Check if system uses UEFI or Legacy BIOS
[ ] Disable Secure Boot (for some distros)
[ ] Disable Fast Startup in Windows (for dual boot)
[ ] Note your disk partition layout
[ ] Check GPU type (NVIDIA/AMD/Intel) for driver planning
```

#### Check UEFI or Legacy BIOS (on Windows)

```powershell
# Run in PowerShell as Administrator
msinfo32
# Look for "BIOS Mode" — will show UEFI or Legacy
```

---

### 2. Download the ISO

Download official ISO images only from **official sources**:

```bash
# Ubuntu 24.04 LTS
https://ubuntu.com/download/desktop

# Fedora 40 Workstation
https://fedoraproject.org/workstation/download/

# Debian 12 "Bookworm"
https://www.debian.org/distrib/

# Arch Linux (rolling)
https://archlinux.org/download/

# Linux Mint 21.3
https://linuxmint.com/download.php

# Pop!_OS 22.04
https://pop.system76.com/
```

#### Verify ISO Integrity (SHA256 checksum)

```bash
# Linux/macOS
sha256sum ubuntu-24.04-desktop-amd64.iso

# Windows PowerShell
Get-FileHash .\ubuntu-24.04-desktop-amd64.iso -Algorithm SHA256
```

Compare the output with the checksum listed on the official download page.

---

### 3. Create a Bootable USB Drive

#### Option A: Using Balena Etcher (Recommended — All Platforms)

1. Download **Balena Etcher** from [etcher.balena.io](https://etcher.balena.io)
2. Insert your USB drive (8 GB+)
3. Open Etcher → **Flash from file** → Select your ISO
4. Select the USB drive as the **Target**
5. Click **Flash!** and wait for completion
6. Eject USB safely

#### Option B: Using `dd` Command (Linux/macOS)

```bash
# Find your USB device
lsblk
# OR
diskutil list   # macOS

# Write ISO to USB (replace /dev/sdX with your device — BE CAREFUL!)
sudo dd if=ubuntu-24.04-desktop-amd64.iso of=/dev/sdX bs=4M status=progress oflag=sync

# macOS equivalent
sudo dd if=ubuntu-24.04-desktop-amd64.iso of=/dev/rdiskX bs=4m
```

> ⚠️ **WARNING**: Double-check the device path. `dd` will overwrite any disk without confirmation.

#### Option C: Using Rufus (Windows Only)

1. Download **Rufus** from [rufus.ie](https://rufus.ie)
2. Select USB Device
3. Select ISO image
4. Partition scheme: **GPT** (UEFI) or **MBR** (Legacy BIOS)
5. Click **START**

---

### 4. BIOS/UEFI Configuration

#### Accessing BIOS/UEFI

| Manufacturer | Key to Press |
|---|---|
| Dell | F2 or F12 |
| HP | F10 or Esc |
| Lenovo | F1, F2, or Enter then F1 |
| ASUS | F2 or Delete |
| Acer | F2 or Delete |
| MSI | Delete or F2 |
| Gigabyte | Delete or F2 |

**Steps:**
1. Insert the bootable USB
2. Restart PC and immediately press the BIOS key (repeatedly)
3. Navigate to **Boot** settings
4. Set **USB Drive** as the first boot device
5. Under **Security** → Disable **Secure Boot** (if needed)
6. Under **Power** → Disable **Fast Boot**
7. Save changes and exit (usually F10)

---

### 5. Boot from USB

1. Insert USB and restart
2. On boot screen, press the **Boot Menu** key:

| Manufacturer | Boot Menu Key |
|---|---|
| Dell | F12 |
| HP | F9 or Esc |
| Lenovo | F12 |
| ASUS | F8 or Esc |
| Acer | F12 |

3. Select your USB drive from the list
4. The Linux live environment will load

---

### 6. Ubuntu Installation Walkthrough

Ubuntu is the most beginner-friendly option. Steps for **Ubuntu 24.04 LTS**:

#### Step-by-Step

```
1. Boot into USB → Select "Try or Install Ubuntu"
2. Choose Language → Click "Install Ubuntu"
3. Keyboard Layout → Select your layout → Continue
4. Connect to WiFi (optional but recommended)
5. Choose installation type:
   - "Normal Installation" (recommended)
   - Check "Install third-party software" (codecs, drivers)
6. Installation Type:
   ┌─────────────────────────────────────────────┐
   │  ● Erase disk and install Ubuntu (easiest)  │
   │  ○ Manual partitioning (advanced)           │
   └─────────────────────────────────────────────┘
```

#### Manual Partition Layout (Recommended for Advanced Users)

| Mount Point | Type | Size | Notes |
|---|---|---|---|
| `/boot/efi` | FAT32 | 512 MB | UEFI systems only |
| `/boot` | ext4 | 1 GB | Optional, for older systems |
| `swap` | swap | RAM size | For hibernation support |
| `/` | ext4 | 30–50 GB | Root partition |
| `/home` | ext4 | Remaining | User data |

```
7. Select Time Zone → Continue
8. Create User:
   - Your name
   - Computer name (hostname)
   - Username (lowercase, no spaces)
   - Password (strong!)
   - Choose "Require password to log in"
9. Click "Install Now" → Confirm write to disk
10. Wait ~15–30 minutes for installation
11. Click "Restart Now" when prompted
12. Remove USB when instructed, press Enter
```

#### First Boot — Post-Install Wizard

Ubuntu 24.04 includes a welcome wizard. Follow on-screen prompts to:
- Enable Ubuntu Pro (optional, free for personal use)
- Set up location services
- Configure privacy settings

---

### 7. Fedora Installation Walkthrough

Fedora uses the **Anaconda** installer:

```
1. Boot → Select "Start Fedora-Workstation-Live"
2. Click "Install to Hard Drive" on the desktop
3. Select Language → Continue
4. Installation Summary screen:
   ┌──────────────────────────────┐
   │ ⚠ INSTALLATION DESTINATION  │  ← Must configure
   │ ✓ Network & Hostname         │
   │ ✓ Time & Date               │
   └──────────────────────────────┘
5. Click "Installation Destination":
   - Select your disk
   - Choose "Automatic" or "Custom" partitioning
   - Click "Done"
6. (Optional) Set Hostname under "Network & Hostname"
7. Click "Begin Installation"
8. Set Root Password and/or Create User while installing
9. Reboot when complete → Remove USB
```

---

### 8. Debian Installation Walkthrough

Debian offers a traditional text/graphical installer:

```
1. Boot → Select "Graphical install"
2. Language → Location → Keyboard
3. Hostname → Domain name (leave blank for home use)
4. Root password (or leave blank to use sudo only)
5. Create regular user → username → password
6. Partition disks:
   - "Guided - use entire disk" (easiest)
   - "Manual" (advanced)
   - Partitioning scheme: "All files in one partition" for desktop
7. Select mirror for package downloads (choose closest region)
8. Software selection:
   ┌────────────────────────────────┐
   │ [*] Debian desktop environment │
   │ [*] GNOME                      │  ← or KDE, XFCE, etc.
   │ [*] standard system utilities  │
   └────────────────────────────────┘
9. Install GRUB bootloader → Select /dev/sda
10. Finish installation → Reboot → Remove USB
```

---

### 9. Arch Linux Installation Walkthrough

Arch uses a **manual CLI-based** installation. Boot into the live ISO first.

#### Verify Boot Mode

```bash
ls /sys/firmware/efi/efivars
# If the directory exists → UEFI mode
# If not → Legacy BIOS mode
```

#### Connect to Internet

```bash
# For WiFi
iwctl
  device list
  station wlan0 scan
  station wlan0 get-networks
  station wlan0 connect "YourSSID"
  exit

# Test connection
ping -c 3 archlinux.org
```

#### Partition the Disk

```bash
# List disks
lsblk

# Partition with fdisk (replace /dev/sda with your disk)
fdisk /dev/sda

# UEFI partition scheme:
# /dev/sda1 → EFI System  → 512M
# /dev/sda2 → Linux swap  → 4G
# /dev/sda3 → Linux       → remainder

# Format partitions
mkfs.fat -F32 /dev/sda1          # EFI
mkswap /dev/sda2 && swapon /dev/sda2  # Swap
mkfs.ext4 /dev/sda3              # Root
```

#### Mount & Install Base System

```bash
# Mount root
mount /dev/sda3 /mnt

# Mount EFI
mkdir -p /mnt/boot/efi
mount /dev/sda1 /mnt/boot/efi

# Install base packages
pacstrap -K /mnt base linux linux-firmware base-devel vim networkmanager

# Generate fstab
genfstab -U /mnt >> /mnt/etc/fstab
```

#### Configure the System

```bash
# Enter chroot
arch-chroot /mnt

# Set timezone
ln -sf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime
hwclock --systohc

# Localization
echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
locale-gen
echo "LANG=en_US.UTF-8" > /etc/locale.conf

# Hostname
echo "myhostname" > /etc/hostname

# Set root password
passwd

# Create user
useradd -m -G wheel username
passwd username

# Enable sudo for wheel group
EDITOR=vim visudo
# Uncomment: %wheel ALL=(ALL:ALL) ALL

# Install bootloader (GRUB for UEFI)
pacman -S grub efibootmgr
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg

# Enable NetworkManager
systemctl enable NetworkManager

# Exit chroot and reboot
exit
umount -R /mnt
reboot
```

#### Install Desktop Environment (Post-Reboot)

```bash
# GNOME
sudo pacman -S gnome gnome-extra
sudo systemctl enable gdm

# OR KDE Plasma
sudo pacman -S plasma kde-applications
sudo systemctl enable sddm

# Start
sudo reboot
```

---

### 10. Dual Boot Setup (Linux + Windows)

> Install **Windows first**, then Linux. Linux's GRUB bootloader will detect Windows automatically.

#### Pre-Dual Boot Checklist

```
[ ] Windows is fully updated
[ ] Disable Fast Startup in Windows:
    Control Panel → Power Options → 
    "Choose what the power buttons do" → 
    Uncheck "Turn on fast startup"
[ ] Disable Hibernate: (PowerShell as Admin)
    powercfg /hibernate off
[ ] Shrink Windows partition to make space:
    Disk Management → Right-click C: → Shrink Volume
    Shrink by at least 30,000 MB (30 GB)
[ ] Disable Secure Boot in BIOS (if needed)
[ ] Disable BitLocker (if enabled)
```

#### During Linux Installation

When you reach **Installation Type**:
- Select **"Install alongside Windows"** (Ubuntu auto-detects this)
- Or use **Manual Partitioning** and use the unallocated space

#### GRUB Will Handle Boot Menu

After installation, GRUB automatically shows a menu at startup:
```
┌─────────────────────────────────────┐
│  Ubuntu 24.04 LTS                   │
│  Advanced options for Ubuntu        │
│  Windows Boot Manager (on /dev/sda) │
└─────────────────────────────────────┘
```

---

### 11. Post-Installation Steps

Run these on your freshly installed Linux system:

#### Update the System

```bash
# Ubuntu/Debian/Mint
sudo apt update && sudo apt upgrade -y

# Fedora
sudo dnf update -y

# Arch Linux
sudo pacman -Syu
```

#### Install Essential Tools

```bash
# Ubuntu/Debian
sudo apt install -y \
  curl wget git vim nano htop \
  build-essential software-properties-common \
  flatpak gnome-software-plugin-flatpak \
  ffmpeg vlc

# Fedora
sudo dnf install -y \
  curl wget git vim htop \
  @development-tools \
  ffmpeg vlc

# Arch
sudo pacman -S \
  curl wget git vim htop \
  base-devel flatpak
```

#### Enable Flatpak (Universal App Store)

```bash
# Ubuntu/Debian/Fedora
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo

# Install an app example (VS Code via Flatpak)
flatpak install flathub com.visualstudio.code
```

#### Install GPU Drivers

```bash
# NVIDIA — Ubuntu
sudo apt install -y nvidia-driver-550

# NVIDIA — Fedora (RPM Fusion required)
sudo dnf install -y akmod-nvidia

# AMD — Drivers are included in the kernel (mesa)
sudo apt install -y mesa-vulkan-drivers  # Ubuntu

# Intel — Usually works out of the box
sudo apt install -y intel-media-va-driver  # Ubuntu
```

---


## Troubleshooting Common Issues

### Fresh Installation Issues

| Problem | Solution |
|---|---|
| USB not detected at boot | Try different USB port (prefer USB 2.0); re-flash with Rufus/Etcher |
| "No bootable device" error | Re-enable USB boot in BIOS; check boot order |
| Black screen after boot | Add `nomodeset` to GRUB kernel parameters |
| WiFi not detected | Use Ethernet for install; install proprietary drivers after |
| GRUB not showing on dual boot | Boot into Linux USB → `sudo grub-install` → `sudo update-grub` |
| Secure Boot error | Disable Secure Boot in BIOS/UEFI |
| Installation freezes | Try "minimal installation"; check RAM with memtest |

#### Add `nomodeset` to GRUB (Black Screen Fix)

```bash
# At GRUB menu → press 'e' to edit → find the line starting with 'linux'
# Add 'nomodeset' before 'quiet splash'
# Press Ctrl+X to boot

# Make permanent after booting:
sudo nano /etc/default/grub
# Change: GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
# To:     GRUB_CMDLINE_LINUX_DEFAULT="quiet splash nomodeset"

sudo update-grub
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
