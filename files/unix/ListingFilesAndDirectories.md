---
layout: single
title: 'Listing files and Directories'
date: 2022-09-22
permalink: /files/unix/ListingFilesAndDirectories
author_profile: true
toc: true
---
 ![Unix files sytem](/images/unix/Linux-Directory-StructureS.webp)

## Listing files and directories
When you first login, your current working directory is your home directory. Your home directory has the same name as your user-name, for example, ee91ab, and it is where your personal files and subdirectories are saved.

```scss
$ ls [OPTIONS] [FILES]
```
When used with no options and arguments, ls displays out what is in your home directory, type 

```scss
$ ls (short for list)
```
The files are listed in alphabetical order in as many columns as can fit across your terminal:
```scss
OUTPUT
cache  db  empty  games  lib  local  lock  log  mail  opt  run  spool  tmp
``` 
There may be no files visible in your home directory, in which case, the UNIX prompt will be returned. Alternatively, there may already be some files inserted by the System Administrator when your account was created.

**ls** does not, in fact, cause all the files in your home directory to be listed, but only those ones whose name does not begin with a dot (.) Files beginning with a dot (.) are known as hidden files and usually contain important program configuration information. They are hidden because you should not change them unless you are very familiar with UNIX!!!

To list all files in your home directory including those whose names begin  with a dot, type
```scss
$ ls -a
```
**ls** is an example of a command which can take options: `-a` is an example of an option. The options change the behaviour of the command. There are online manual pages that tell you which options a particular command  can take, and how each option modifies the behaviour of the command.

##  Making Directories 

### mkdir (make directory) 

We will now make a subdirectory in your home directory to hold the files you will be creating and using in the course of this tutorial. To make a subdirectory called **unixstuff** in your current working directory type

```scss
$ mkdir unixstuff 
```
To see the directory you have just created, type 
```scss
$ ls
```
## Changing to a different directory&nbsp;
### cd (change directory)
The command **cd `directory`** means change the current working directory to 'directory'. The current working directory may be thought of as the directory you are in, i.e. your current position in the file-system tree.

To change to the directory you have just made, type
```scss
$ cd unixstuff 
```
Type `ls` to see the contents (which should be empty)

<b>:loudspeaker: Exercise </b>

Make another directory inside the **unixstuff** directory called 
  **backups**?

## The directories . and ..
 Still in the **unixstuff** directory, type

```scss
$ ls -a
```
As you can see, in the **unixstuff** directory (and in all other directories), there are two special directories called (**.**) and (**..**)

In UNIX, (**.**) means the current directory, so typing 
```scss
$ cd .
```
> NOTE: there is a space between cd and the dot

means stay where you are (the **unixstuff** directory). 
This may not seem very useful at first, but using (**.**) as the name of the current directory will save a lot of typing, as we shall see later in the tutorial.

<b>&nbsp;</b>
 (**..**) means the parent of the current directory, so typing 

 ```scss
$ cd ..
```
will take you one directory up the hierarchy (back to your home directory). Try it now.
> Note: typing `cd` with no argument always returns you to your home directory. This is very useful if you are lost in the file system.

## Pathnames
### *pwd* (print working directory)
Pathnames enable you to work out where you are in relation to the whole file-system. For example, to find out the absolute pathname of your home-directory, type **cd** to get back to your home-directory and then type

```scss
$ pwd 
```
The full pathname will look something like this:
**/a/fservb/fservb/fservb22/eebeng99/ee91ab**
which means that ee91ab (your home directory) is in the directory eebeng99 (the group directory),which is located on the fservb file-server.
> Note: **/a/fservb/fservb/fservb22/eebeng99/ee91ab**

can be shortened to 
**/user/eebeng99/ee91ab**

<b>:loudspeaker: Exercise</b>

Use the commands **ls**, **pwd** and **cd** to explore the file system.
(Remember, if you get lost, type **cd** by itself to return to your home-directory)

## More about home directories and pathnames

### Understanding pathnames

First type **cd** to get back to your home-directory, then type

```scss
$ ls unixstuff
```
to list the conents of your unixstuff directory.

Now type 

```scss
$ ls backups
```
You will get a message like this -
> backups: No such file or directory 

The reason is, **backups** is not in your current working directory. To use a command on a file (or directory) not in the current working directory (the directory you are currently in), you must either <samp>cd</samp> to the correct directory, or specify its full pathname. To list the contents of your backups directory, you must type 

```scss
$  ls unixstuff/backups 
```

### ~ (your home directory)

Home directories can also be referred to by the tilde **~** character. It can be used to specify paths starting at your home directory. So typing

```scss
$ ls ~/unixstuff
```
 will list the contents of your unixstuff directory, no matter where you currently are in the file system.

:loudspeaker: What do you think?

```scss
$ ls ~
```
:loudspeaker: would list

What do you think?

```scss
$  ls ~/..
``` 
:loudspeaker: would list ?

<b>Summary </b>

|code           | Function                              |                                             
| ------------- |:---------------------------------:     |
|  ls     |list files and directories                    |
| ls -a   | list all files and directories               |
| mkdir   | make a directory                             |
| cd directory  | change to named directory              |
| cd     | change to home-directory                      |
| cd ~   | change to home-directory                      |
| cd ..   | change to parent directory                   |
| pwd    | display the path of the current directory     |      

