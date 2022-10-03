---
title: 'Linux Wildcards'
date: 2022-09-23
permalink: /files/unix/unix5
layout: single
author_profile: true
toc: true
---

![Unix files sytem](/images/unix/Putorius-Feature-Default.jpg)

## Wildcards
---
### The characters `*` and ?

The character * is called a wildcard, and will match against none or more character(s) in a file (or directory) name. For example, in your **unixstuff** directory, type

```scss
$ ls list*
```
This will list all files in the current directory starting with **list....**

Try typing
```scss
$ ls *list
```
This will list all files in the current directory ending with **....list**

The character ? will match exactly one character.  
So ls ?ouse will match files like **house** and **mouse**, but not **grouse**.  
Try typing
```scss
$ ls ?list
```
## Filename conventions
------------------------

We should note here that a directory is merely a special type of file. So the rules and conventions for naming files apply also to directories.

In naming files, characters with special meanings such as **/ \* & $** , should be avoided. Also, avoid using spaces within names. The safest way to name a file is to use only alphanumeric characters, that is, letters and numbers, together with _ (underscore) and . (dot).

File names conventionally start with a lower-case letter, and may end with a dot followed by a group of letters indicating the contents of the file. For example, all files consisting of C code may be named with the ending .c, for example, prog1.c . Then in order to list all files containing C code in your home directory, you need only type ls *.c in that directory.

> **Beware**: some applications give the same name to all the output files they generate.  
  
For example, some compilers, unless given the appropriate option, produce compiled files named **a.out**. Should you forget to use that option, you are advised to rename the compiled file immediately, otherwise the next such file will overwrite it and it will be lost.


## Getting Help
---

### On-line Manuals

There are on-line manuals which gives information about most commands. The manual pages tell you which options a particular command can take, and how each option modifies the behaviour of the command. Type man command to read the manual page for a particular command.

For example, to find out more about the wc (word count) command, type
```scss
$ man wc
```
Alternatively
```scss
$ whatis wc
```
gives a one-line description of the command, but omits any information about options etc.

### Apropos

When you are not sure of the exact name of a command,
```scss
$ apropos keyword
```
will give you the commands with keyword in their manual page header. For example, try typing
```scss
$ apropos copy
```

<b>Summary </b>

| code           | Function                            |
| -------------  | :------------------------------:    |
| `*` | match any number of characters |
| `?` | match one character |
| `man command` | read the online manual page for a command |
| `whatis command` | brief description of a command |
| `apropos keyword` | match commands with keyword in their man pages |
