---
title: 'Briefing about the Unix'
date: 2022-09-22
permalink: /files/unix/unix1
layout: single
author_profile: true
toc: true
---
***
## Introduction
***
This briefing is intended to provide the learner with a basic overview of essential Unix/Linux commands. This allow them to navigate a file system and move, copy, and edit files. We will also introduce a brief overview of some `power` commands in Unix.

***
## Why Unix?
***
Unix allows direct communication with the computer via a terminal, hence being very interactive and giving the user direct control over the computer resources. Unix also gives users the ability to share data and programs among one another. The unix operating system has been evolved around since 1969 back, when there were no such a thing as graphical user infrence. There are several different shell languages. What we will be using in this course is a popular shell flavor called [BASH](https://www.howtogeek.com/68563/htg-explains-what-are-the-differences-between-linux-shells/)
UNIX systems also have a graphical user interface (GUI) similar to Microsoft Windows which provides an easy to use environment. However, knowledge of UNIX is required for operations which aren't covered by a graphical program, or for when there is no windows interface available, for example, in a telnet session.

***
## The UNIX operating system
***
The UNIX operating system is made up of three parts; the kernel, the shell and the programs.

### <u><b> The kernel </b></u>
***
The kernel of UNIX is the hub of the operating system: it allocates time and memory to programs and handles the filestore and communications in response to system calls.

As an illustration of the way that the shell and the kernel work together, suppose a user types **rm myfile** (which has the effect of removing the file **myfile**). The shell searches the filestore for the file containing the program **rm**, and then requests the kernel, through system calls, to execute the program **rm** on **myfile**. When the process **rm myfile** has finished running, the shell then returns the UNIX prompt $ to the user, indicating that it is waiting for further commands.

### <u><b> The shell </b></u>
***

The shell acts as an interface between the user and the kernel. When a user logs in, the login program checks the username and password, and then starts another program called the shell. The shell is a command line interpreter (CLI). It interprets the commands the user types in and arranges for them to be carried out. The commands are themselves programs: when they terminate, the shell gives the user another prompt (% on our systems).

The adept user can customise his/her own shell, and users can use different shells on the same machine. Most accounts on our clusters have the **bash shell** by default. The accounts on hpc-class use shell specified at https://asw.iastate.edu/cgi-bin/acropolis/user/shell .

The bash and tcsh shells have certain features to help the user inputting commands.

Filename Completion - By typing part of the name of a command, filename or directory and pressing the **Tab** key, the shell will complete the rest of the name automatically. If the shell finds more than one name beginning with those letters you have typed, it will beep, prompting you to type a few more letters before pressing the tab key again.

History - The shell keeps a list of the commands you have typed in. If you need to repeat a command, use the cursor keys to scroll up and down the list or type history for a list of previous commands.

***
## Files and processes
***

Everything in Unix is a file or a process. In Unix a file is just a destination for or a source of a stream of data. Thus a printer, for example, is a file and so is the screen.

A process is a program that is currently running. So a process may be associated with a file. The file stores the instructions that are executed for that process to run.

Another way to look at it is that file is a collection of data that can be referred to by name. Files are created by users either directly (using text editors, running compilers etc.) or indirectly (by running some program - like processing a text input file to produce a formatted file for printing). 

Examples of files include:

- a text document;
- a program written in a programming language such as C++ or Java;
- a jpeg image;
- a directory: directories can be thought of as the analogue of Windows’ folders. Directories are files that contain links to other files.

***
## The Directory Structure
***

All the files are grouped together in the directory structure. The file-system is arranged in a hierarchical structure, like an inverted tree. The top of the hierarchy is traditionally called root (written as a slash / )

<img src="/images/unix/Linux-Directory-Structure.webp" width="100%" height="100%" alt="Bash Shell"/>

| Directory	| Description                                                                           |
| :-------- | :----------------------:                                                              |
| /			|The directory called “root.” It is the beginning point for the file system hierarchy.  |
| /bin		|Binaries and other executable programs.                                                |
| /etc		|System configuration files.                                                            |
| /home		|Home directories.                                                                      |
| /opt		|Optional or third party software.                                                      |
| /tmp		|Temporary space, typically cleared on reboot.                                          |
| /usr		|User related programs.                                                                 |
| /var		|Variable data, most notably log files.                                                 |

***
## Starting an UNIX terminal
***

<img src="/images/unix/unix.png" width="100%" height="100%" alt="Bash Shell"/>

