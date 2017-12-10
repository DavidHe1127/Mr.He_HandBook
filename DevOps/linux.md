* [Shell Definition](#shell-def)
* [Environment Variable](#env-var)

### shell-def
A shell is a program that runs commands. The shell also serves as a small programming environment
### env-var
$PATH说简单点就是一个字符串变量，当输入命令的时候LINUX会去查找$PATH里面记录的路径。比如在根目录/下可以输入命令ls,在/usr目录下也可以输入ls,但其实ls这个命令根本不在这个两个目录下，事实上当你输入命令的时候LINUX会去/bin,/usr/bin,/sbin等目录下面去找你此时输入的命令，而$PATH的值恰恰就是/bin:/sbin:/usr/bin:……。其中的冒号使目录与目录之间隔开.

To edit it
```js
sudo vi /etc/paths
```







* Basic Commands & Dir Hierarchy
  * [stdout file content](#stdout-file-content)

### stdout-file-content
Use `less` rather than `cat` to output large file content since the former allows to scroll **up/down** contents
```Shell
less file1.txt
```

