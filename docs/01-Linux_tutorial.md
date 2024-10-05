---
title: "Introduction to Unix"
permalink: /docs/Linux_tutorial/
author_profile: false
sidebar:
   nav: Linux_tutorial
excerpt: "How to quickly install and setup ubuntu linux"
toc: true
---

Unix is an operating system in the computer language program. The duty of an operating system is to orchestrate the various parts of computer-- the processor, graphic processor unit, the on-board memory, the disk drives ssd, hdd, keyboard, mouse video monitors, etc to preform useful tasks. The operating system is the master controller of the computer, the glue that holds together all the component of system, including the administrators, programmers, applications and users. When you use the computer to do something for you, like start the applications, copy file, or display the content of a directory, it is the operating system that must perform those tasks for you.
More than anything else, the operating system gives the computer its recognized characteristics. Distinguish between two computers would be difficult, they were running the same operating system. Conversely, two identical computers, running different operating system, would appears completely different to the user.
Unix was created in the late 1960s, in the efforts of a multiuser, multitasking system for use by programmers. The philosophy behind the design of Unix was to provide simple, yet powerful utilities that could be together in a flexible manner to perform a wide variety of tasks.

The Unix operating system comprise three parts:
1. The kernel, 
2. The standard utility programs, 
3. The system configuration files.

## The kernel
The kernel is the core of the Unix operating system. Basically, the kernel is a large program that is loaded into memory when the machine is turned on, and it controls the allocation of hardware resources from that point forward. The kernel knows what hardware resources are available (like the processor(s), the on-board memory, the disk drives, network interfaces, etc.), and it has the necessary programs to talk to all the devices connected to it.

## The standard utility programs
These programs include simple utilities like cp, which copies files, and complex utilities, like the shell that allows you to issue commands to the operating system.

## The system configuration files
The system configuration files are read by the kernel, and some of the standard utilities. The Unix kernel and the utilities are flexible programs, and certain aspects of their behavior can be controlled by changing the standard configuration files. One example of a system configuration file is the filesystem table "fstab" , which tells the kernel where to find all the files on the disk drives. Another example is the system log configuration file "syslog.conf", which tells the kernel how to record the various kinds of events and errors it may encounter.

# Section 2: Accessing a Unix System
There are many ways that you can access a Unix system. If you want the fullest possible access to the computer's commands and utilities, you must initiate a login session. The main mode of initiating a login session to a Unix machine is through a terminal, which usually includes a keyboard, and a video monitor.

When a terminal establishes a connection to the Unix system, the Unix kernel runs a process called a tty to accept input from the terminal, and send output to the terminal. When the tty process is created, it must be told the capabilities of the terminal, so it can correctly read from, and write to, the terminal. If the tty process receives incorrect information about the terminal type, unexpected results can occur.

## Console
Every Unix system has a main console that is connected directly to the machine. The console is a special type of terminal that is recognized when the system is started. Some Unix system operations must be performed at the console. Typically, the console is only accessible by the system operators, and administrators.

## Dumb terminals
Some terminals are referred to as "dumb" terminals because they have only the minimum amount of power required to send characters as input to the Unix system, and receive characters as output from the Unix system.

Personal computers are often used to emulate dumb terminals, so that they can be connected to a Unix system.

Dumb terminals can be connected directly to a Unix machine, or may be connected remotely, through a modem, a terminal server, or other network connection.

## Smart terminals
Smart terminals, like the X terminal, can interact with the Unix system at a higher level. Smart terminals have enough on-board memory and processing power to support graphical interfaces. The interaction between a smart terminal and a Unix system can go beyond simple characters to include icons, windows, menus, and mouse actions.

## Network-based access modes
Unix computers were designed early in their history to be network-aware. The fact that Unix computers were prevalent in academic and research environments led to their broad use in the implementation of the Department of Defense's Advanced Research Projects Administration (DARPA) computer network. The DARPA network laid the foundations for the Internet.

### FTP
The FTP (File Transfer Protocol) provides a simple means of transferring files to and from a Unix computer. FTP access to a Unix machine may be authenticated by means of a username and password pair, or may be anonymous. An FTP session provides the user with a limited set of commands with which to manipulate and transfer files.
### Telnet
Telnet is a means by which one can initiate a Unix shell login across the Internet. The normal login procedure takes place when the telnet session is initiated.
### HTTP
The HTTP protocol has become important in recent years, because it is the primary way in which the documents that constitute the World Wide Web are served. HTTP servers are most often publicly accessible. In some cases, access to documents provided by HTTP servers will require some form of authentication.
### HTTPS
A variation of HTTP that is likely to become increasingly important in the future. The "S" stands for "secure." When communications are initiated via the HTTPS protocol, the sender and recipient use an encryption scheme for the information to be exchanged. When the sending computer transmits the message, the information is encrypted so that outside parties cannot examine it. Once the message is received by the destination machine, decryption restores the original information.


# Section 3: Logging In and Logging Out
To ensure security and organization on a system with many users, Unix machines employ a system of user accounts. The user accounting features of Unix provide a basis for analysis and control of system resources, preventing any user from taking up more than his or her share, and preventing unauthorized people from accessing the system. Every user of a Unix system must get permission by some access control mechanism.

## Logging in
Logging in to a Unix system requires two pieces of information: A username, and a password. When you sit down for a Unix session, you are given a login prompt that looks like this:
   login:
Type your username at the login prompt, and press the return key. The system will then ask you for your password. When you type your password, the screen will not display what you type.
## Your username
Your username is assigned by the person who creates your account. At ISU, the standard username is the first four letters of your last name concatenated with the first four letters of your first name.
Your username must be unique on the system where your account exists since it is the means by which you are identified on the system.

## Your password
When your account is created, a password is assigned. The first thing you should do is change your password, using the passwd utility. To change your password, type the command
      passwd
after you have logged in. The system will ask for your old password, to prevent someone else from sneaking up, and changing your password. Then it will ask for your new password. You will be asked to confirm your new password, to make sure that you didn't mistype. It is very important that you choose a good password, so that someone else cannot guess it. Here are some rules for selecting a good password:
- Do not use any part of your name, your spouse's name, your child's name, your pet's name, or anybody's name. Do not use any backward spellings of any name, either.
- Do not use an easily-guessable number, like your phone number, your social security number, your address, license plate number, etc.
- Do not use any word that can be found in an English or foreign-language dictionary.
- Do not use all the same letter, or a simple sequence of keys on the keyboard, like qwerty.
- Do use a mix of upper-case and lower-case letters, numbers, and control characters.
- Do use at least six characters.
- If you have accounts on multiple machines, use a different password on each machine. Do not choose a password that is so difficult to remember that you must write it down.

## Logging Out
When you're ready to quit, type the command
   exit
Before you leave your terminal, make sure that you see the login prompt, indicating that you have successfully logged out. If you have left any unresolved processes, the Unix system will require you to resolve them before it will let you log out. Some shells will recognize other commands to log you out, like "logout" or even "bye".
It is always a good idea to clear the display before you log out, so that the next user doesn't get a yours user of information about you, your work, or your user account. You can type the command

   clear
right before you log out, or you can press the return key until all the information is scrolled off the screen.