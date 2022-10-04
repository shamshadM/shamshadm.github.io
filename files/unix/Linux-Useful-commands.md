---
layout: single
title: 'Linux useful commands'
date: 2022-09-23
permalink: /files/unix/Linux-Useful-commands
type: 'Bioinformatics'
venue: Online
author_profile: true
toc: true
---

![Unix files sytem](/images/unix/linux-tar-gz.webp)

### quota

All students are allocated a certain amount of disk space on the file system for their personal files, usually about 100Mb. If you go over your quota, you are given 7 days to remove excess files.

To check your current quota and how much of it you have used, type
```scss
$ quota -v
```
### df

The df command reports on the space left on the file system. For example, to find out how much space is left on the fileserver, type
```scss
$ df .
```
### du

The du command outputs the number of kilobyes used by each subdirectory. Useful if you have gone over quota and you want to find out which directory has the most files. In your home-directory, type
```scss
$ du
```
### compress

This reduces the size of a file, thus freeing valuable disk space. For example, type
```scss
$ ls -l science.txt
```
and note the size of the file. Then to compress science.txt, type
```scss
$ compress science.txt
```
This will compress the file and place it in a file called science.txt.Z

To see the change in size, type `ls -l` again.

To uncomress the file, use the uncompress command.
```scss
$ uncompress science.txt.Z
```
### gzip

This also compresses a file, and is more efficient than compress. For example, to zip science.txt, type
```scss
$ gzip science.txt
```
This will zip the file and place it in a file called science.txt.gz

To unzip the file, use the gunzip command.
```scss
$ gunzip science.txt.gz
```
### file

file classifies the named files according to the type of data they contain, for example ascii (text), pictures, compressed data, etc.. To report on all files in your home directory, type
```scss
$ file *
```
### history

The C shell keeps an ordered list of all the commands that you have entered. Each command is given a number according to the order it was entered.
```scss
$ history (show command history list)
```
If you are using the C shell, you can use the exclamation character (!) to recall commands easily.
```scss
$ !! (recall last command)
$ !-3 (recall third most recent command)
$ !5 (recall 5th command in list)
$ !grep (recall last command starting with grep)
```
You can increase the size of the history buffer by typing
```scss
$ set history=100
```