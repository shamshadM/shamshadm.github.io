---
layout: single
title: 'Copies and moving of files'
date: 2022-09-22
permalink: /docs/Copies-moving-removing-files
sidebar:
   title: 'Copies and moving of files'
   nav: Linux_tutorial
author_profile: false
toc: true
---

![Unix files system](/images/unix/linux-cp-command.webp)

---
## Copying Files
---
### cp (copy)

cp stands for copy. This command is used to copy files or group of files or directory. It creates an exact image of a file on a disk with different file name. cp command require at least two filenames in its arguments. The **cp** do copy of **file1 file2** is the command which makes a copy of **file1** in the current working directory and calls it **file2**

```scss
$ cp [OPTION] Source Destination
$ cp [OPTION] Source Directory
```
What we are going to do now, is to take a file stored in an open access area of the file system, and use the **cp** command to copy it to your unixstuff directory.

First, **cd** to your unixstuff directory.

```scss
$ cd ~/unixstuff
```

Then at the UNIX prompt, type,

```scss
$ cp /vol/examples/tutorial/science.txt .
```

> Note: Don't forget the dot (.) at the end. Remember, in UNIX, the dot means the current directory.

The above command means copy the file **science.txt** to the current directory, keeping the name the same.

> Note: The directory **/vol/examples/tutorial/** is an area to which everyone in the department has read and copy access. If you are from outside the University, you can grab a copy of the file [here](science.txt). Use 'File/Save As..' from the menu bar to save it into your **unixstuff** directory.

<b> :loudspeaker: Exercise</b> 

Create a backup of your **science.txt** file by copying it to a file called **science.bak**

---
## Moving files
---
### mv (move)

mv file1 file2 moves (or renames) **file1** to **file2**

To move a file from one place to another, use the mv command. This has the effect of moving rather than copying the file, so you end up with only one file rather than two.

It can also be used to rename a file, by moving the file to the same directory, but giving it a different name.

We are now going to move the file science.bak to your backup directory.

First, change directories to your unixstuff directory (can you remember how?). Then, inside the **unixstuff** directory, type

```scss
$ mv science.bak backups/.
```
Type `ls` and `ls backups` to see if it has worked.

---
## Removing files and directories
---
### rm (remove), rmdir (remove directory)

To delete (remove) a file, use the rm command. As an example, we are going to create a copy of the **science.txt** file then delete it.

Inside your **unixstuff** directory, type

```scss
$ cp science.txt tempfile.txt  
$ ls (to check if it has created the file)  
$ rm tempfile.txt  
$ ls (to check if it has deleted the file)
```

You can use the rmdir command to remove a directory (make sure it is empty first). Try to remove the **backups** directory. You will not be able to since UNIX will not let you remove a non-empty directory.

To permanently remove directory use either the `rmdir` or `rm` commands:

```scss
rmdir unixstuff or 
rm -d unixstuff
```
The remove commands for various options

| Command and Option	 |  Description |
| :-------------                |:------------------------------------------	|
| rm -d	| Remove an empty directory using the rm command. |
|rm -r	| Remove a non-empty directory and its content.|
|rm -f	| Ignore any prompt when deleting a write-protected file.|
|rm -rf	| Ignore any prompt when deleting a write-protected non-empty folder.|
|rm -i	| Output a prompt before deleting every file.
|rm -I	| Output a prompt only once before deleting more than three files.|
|rm *	| Wildcard that represents multiple characters. |
|rm ?	| Wildcard that represents a single character. |
|rmdir -p	| Remove an empty subdirectory and its parent directory.|
|rmdir -v	| Print the information that the specified directory was deleted.|

:loudspeaker: <b>Exercise</b>

Create a directory called **tempstuff** using mkdir , then remove it using the rmdir command.

---
## Displaying the contents of a file on the screen
---
### clear (clear screen)

Before you start the next section, you may like to clear the terminal window of the previous commands so the output of the following commands can be clearly understood.

At the prompt, type

```scss
$ clear
```
This will clear all text and leave you with the $ prompt at the top of the window.

### cat (concatenate)

The command cat can be used to display the contents of a file on the screen. Type:
```scss
$ cat science.txt
```
As you can see, the file is longer than the size of the window, so it scrolls past making it unreadable.

### less

The command less writes the contents of a file onto the screen a page at a time. Type
```scss
$ less science.txt
```
Press the **`space-bar`** if you want to see another page, type **`q`** if you want to quit reading. As you can see, less is used in preference to cat for long files.

### head

The head command writes the first ten lines of a file to the screen.

First clear the screen then type
```scss
$ head science.txt
```
Then type
```scss
$ head -5 science.txt
```
:loudspeaker: What difference did the -5 do to the head command?

### tail

The tail command writes the last ten lines of a file to the screen.

Clear the screen and type
```scss
$ tail science.txt
```
:loudspeaker: How can you view the last 15 lines of the file?

---
## Searching the contents of a file
---

### Simple searching using less

Using less, you can search though a text file for a keyword (pattern). For example, to search through **science.txt** for the word `science`, type
```scss
$ less science.txt
```
then, still in less (i.e. don't press \[q\] to quit), type a forward slash `[/]` followed by the word to search /science

As you can see, less finds and highlights the keyword. Type `[n]` to search for the next occurrence of the word.

### grep (don't ask why it is called grep)

grep is one of many standard UNIX utilities. It searches files for specified words or patterns. First clear the screen, then type

```scss
$ grep science science.txt
```
As you can see, grep has printed out each line containing the word science.

<b>:loudspeaker: Or has it?</b>

Try typing
```scss
$ grep Science science.txt
```

The grep command is case sensitive; it distinguishes between Science and science.

To ignore upper/lower case distinctions, use the -i option, i.e. type

```scss
$ grep -i science science.txt
```

To search for a phrase or pattern, you must enclose it in single quotes (the apostrophe symbol). For example to search for spinning top, type

```scss
$ grep -i 'spinning top' science.txt
```
Some of the other options of grep are:

```scss
\-v display those lines that do NOT match  
\-n precede each matching line with the line number  
\-c print only the total count of matched lines  
```

Try some of them and see the different results. Don't forget, you can use more than one option at a time, for example, the number of lines without the words science or Science is

```scss
$ grep -ivc science science.txt
```

### wc (word count)

A handy little utility is the wc command, short for word count. To do a word count on **science.txt**, type
```scss
$ wc -w science.txt
``` 
To find out how many lines the file has, type
```scss
$ wc -l science.txt
```
---
<b> Summary</b>

| code                          | Function                                    			   |                                             
| :-------------                |:------------------------------------------ 			   |
| `cp file1 file2` 			    |   copy file1 and call it file2                           |
| `mv file1 file2` 			    |  move or rename file1 to file2                           |
| `rm file` 			        |  remove a file                                           |
| `rmdir directory` 			|  remove a directory                                      |
| `cat file` 			        |  display a file                                          |
| `more file` 			        | display a file a page at a time                          |
| `head file` 			        | display the first few lines of a file                    |
| `tail file` 			        | display the last few lines of a file                     |
| `grep [keyword file] search`  | a file for keywords                                      |
| `wc file`					    | count number of lines/words/characters in file           |
