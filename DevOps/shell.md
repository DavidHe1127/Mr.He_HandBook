* [Shell Definition](#shell-def)
* [ctrl+d vs ctrl+c](#ctrld-ctrlc)
* [Environment Variable](#env-var)
* [ls output explained](#ls)
* [Shell globbing (wildcard)](#globbing)
* [Stdout file content](#stdout-file-content)
* [Dot files](#dotfiles)
* [Man page](#manpage)
* [Input and Output](#input-output)
* [Process](#process)
* [File](#file)

### shell-def
Located in `/bin/sh`. A shell is a program that runs commands. The shell also serves as a small programming environment. There is an enhanced version of shell called `bash` or `Bourne-again shell`.
We open a shell window via terminal.

### ctrld-ctrlc
* `ctrl+d` on an empty line stops the current standard input entry from terminal. 
* `ctrl+c` terminates a program regardless of ites input or output.

### env-var
$PATH说简单点就是一个字符串变量，当输入命令的时候LINUX会去查找$PATH里面记录的路径。比如在根目录/下可以输入命令ls,在/usr目录下也可以输入ls,但其实ls这个命令根本不在这个两个目录下，事实上当你输入命令的时候LINUX会去/bin,/usr/bin,/sbin等目录下面去找你此时输入的命令，而$PATH的值恰恰就是/bin:/sbin:/usr/bin:……。其中的冒号使目录与目录之间隔开.

To edit it
```js
sudo vi /etc/paths
```

### ls
![ls](./ls.jpg)

### globbing
The s

### stdout-file-content
Use `less` rather than `cat` to output large file content since the former allows to scroll **up/down** contents.
If `less` is not supported out of box then try `more`.
```Shell
less file1.txt
```
You can also search for text inside `less`. forward search `/word` and backward search `?word`.

### dotfiles
Dot files such as `.babelrc` is a configuration file that is not displayed when you run `ls` unless with `-a`. Similarly, shell globs don't match dot files.

### manpage
```js
man ls
man -k <KEYWORD>
```

### input-output
To send output of a command to a file rather than terminal:
```
$ command > file
```
Command above will overwrite the existing file content. To append it use `>>`.

To send the standard output of a command to the standard input of another command:
```
$ command | another_command
```

To send the standard output to `f` and standard error to `e`:
```
$ ls /fffffffffffffffff > f 2> e
```

### process
A process is a running program and each process on the system has a numeric process ID(PID). 
To kill a process:
```
$ kill pid
```
When we run `kill`, we're asking the kernal to send a signal to another process. 

To run a process and put it in the background (using &) which then gives you prompt back:
```
$ gunzip file.gz &
```

### file
`Group` permissions give any users in a particular group rights to perform `read/write/execute` on file or directory.

`Others` permissions give everyone else on the system. 

To see which group you are in:
```
$ groups davidhe
```
