## Shell script, commands

- [What is shell](#what-is-shell)
- [ctrl+d vs ctrl+c](#ctrld-ctrlc)
- [ls](#ls-output-explained)
- [less](#less)
- [copy](#copy)
- [Brace vs Bracket](#brace-vs-bracket)
- [Input and Output](#input-output)
- [double dash in command](#double-dash)
- [; vs &&](#;-&&)
- [awk](#awk)
- [Find files](#find-files)
- [Source a file](#source-a-file)
- [Makefile](#makefile)
- [HereDoc](#heredoc)
- [Parameter Expansion](#parameter-expansion)
- Tips/Notes
  - [Run command in history](#run-command-in-history)
  - [Define and use Variables](#define-n-use-variables)
  - [Show real installation location of a binary](#show-real-installation-location-of-binary)
  - [Safeguard shell scripts](#safeguard-shell-scripts)
  - [Alias](#alias)
- [Scripting](./shell_scripting.md)
- [Bash Template](./bash_template.md)

### what is shell

Located in `/bin/sh`. A shell is a program that runs commands. The shell also serves as a small programming environment. There is an enhanced version of shell called `bash` or `Bourne-again shell`.
We open a shell window via terminal.

### ctrld-ctrlc

- `ctrl+d` on an empty line stops the current **standard input** entry from terminal.
- `ctrl+c` terminates a program regardless of ites input or output.

### ls output explained

![ls](./ls.jpg)

### less

Use `less` rather than `cat` to output large file content since the former allows to scroll **up/down** contents.
If `less` is not supported out of box then try `more`.

```Shell
less file1.txt
```

You can also search for text inside `less`. forward search `/word` and backward search `?word`.

### copy

Be super careful about the operator, you **MUST USE <** or you will risk losing target file content.

```shell
# paste stuff to clipboard. available on os x by default
# pbcopy < <FILE_PATH>
$ pbcopy < ~/.ssh/id_rsa.pub
# send output to clipboard
$ la | pbcopy
```

#### scp

```shell
# copy file from local to remote
$ scp -i path/to/key file/to/copy ec2-user@<EC2_IP>:path/to/file

# copy file from remote to local
scp -i ~/.ssh/nabx-nonprod.pem ec2-user@jenkins-nonprod.lz002.awsnp.national.com.au:david-playground/output.json .
```

### brace vs bracket

```shell
#!/bin/bash

# execute command enclosed with () and assign output to var RES
RES="$(curl https://www.lendi.com.au/) xxxxx"

# interpolate RES value
res="${RES} BBBBB"

# but u cannot do $(RES) as RES will be interpreted as a command which results in RES command not found error
```

### input-output

To send output of a command to a **file** rather than terminal:

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

### double-dash

`--` means the end of command options i.e `-v, -i, -s` etc. So `-v` here is considered to be a string rather than a command option. In this example, we simply grep string `-v` inside file `xxx`.

```bash
grep -- -v xxx
```

### ;-&&

```bash
# run 'echo "world"' regardless of status code being returned in the previous command
$ echo "Hello " ; echo "world"

# run 'echo "world"' only if previous command return exit code zero
$ echo "Hello " && echo "world"
```

### awk
It works by reading a file by line and apply `awk` against each of these lines.

Say we have a file `log.txt` as follow:

```txt
root     pts/1   192.168.1.100  Tue Feb 10 11:21   still logged in
root     pts/1   192.168.1.100  Tue Feb 10 00:46 - 02:28  (01:41)
root     pts/1   192.168.1.100  Mon Feb  9 11:41 - 18:30  (06:48)
dmtsai   pts/1   192.168.1.100  Mon Feb  9 11:41 - 11:41  (00:00)
root     tty1                   Fri Sep  5 14:09 - 14:10  (00:01)
```

`-F` specifies separator. By default separator is space.
```shell
$ awk -F: '{print $1}' log.txt
root     pts/1   192.168.1.100  Tue Feb 10 11
root     pts/1   192.168.1.100  Tue Feb 10 00
root     pts/1   192.168.1.100  Mon Feb  9 11
dmtsai   pts/1   192.168.1.100  Mon Feb  9 11
root     tty1                   Fri Sep  5 14
$ awk -F. '{print $1}' log.txt
root     pts/1   192
root     pts/1   192
root     pts/1   192
dmtsai   pts/1   192
root     tty1                   Fri Sep  5 14:09 - 14:10  (00:01)
$ awk -F. '{print $2}' awk-sample-input.txt
168
168
168
168
```
`${n}` denotes segments - a line divided by separator into multiple segments. Given last command, with `.` as separator, the first segment is `192` and second segment is `168`.

[Read more about awk](https://www.cnblogs.com/ggjucheng/archive/2013/01/13/2858470.html)

### find-kill-process

Works on OS X

```bash
$ lsof -i:8000
$ kill PID
```

### Find files

```sh
$ find . -type f -name "*.md" -exec grep "example" '{}' \; -print
```

- Search every object in current directory that is a file
- Execute `grep` on found one whose content includes `example`
- `{}` represents match result
- `\;` escape `;`. `exec` is terminated with `;`
- match results will be printed on the screen

### Source a file

- `./script` runs the script as an executable file, launching a **new shell** to run it
- source script reads and executes commands in targeting file in the **current shell** environment

a.sh

```sh
#!/bin/bash

echo $BAR
```

```sh
$ BAR=123 && source a.sh
123

$ BAR=123 && ./a.sh

```

---

### Makefile

Use makefile as a build tool is a good idea!

```makefile
# Use tab as indentations

# set value only if it's not set
COLORTERM ?= Bright
# make vars accessible from processes fired up by make
export APPLICATION_NAME=dockerzon-ecs
# use $() to eval var
export APPLICATION_PATH=$(HOME)/lab/$(APPLICATION_NAME)

task:
   # @ will suppress command name from being logged to terminal
    @date
some:
    sleep 1
    echo "Slept"
thing:
    cal
    echo ${COLORTERM}

# pass arg
# $ make test SOS='o yeah'
test:
   @echo ${SOS}

# execute clean anyway even if a file called clean exists in the same directory as makefile
.PHONY: clean

clean:
  rm -rf *.o

# use as a build tool
deploy-something:
  @echo "Deploy something..."
  ./scripts/deploy_something.sh ${env} ${tag}

# call a func in a shell script
# call function remove_fruits in destroy_something.sh
# make sure you have $* in the script end or calling function won't work
destroy-something:
  @echo "Destroy something..."
  ./scripts/destroy_something.sh remove_fruits ${env} ${tag}
```

### HereDoc
1. Pass multi-line string to a file in Bash
```shell
$ cat <<EOF > print.sh
#!/bin/bash
echo \$PWD
echo $PWD
EOF

# The print.sh file now contains:
#!/bin/bash
echo $PWD
echo /home/user
```
2. Pass multi-line string to a pipe in Bash
```shell
$ cat <<EOF | grep 'b' | tee b.txt
foo
bar
baz
EOF
```
The b.txt file contains bar and baz lines. The same output is printed to stdout.

3. Run multi-line command through bash

```shell
$ bash <<EOF
> ls
> echo 'love this game'
> printenv
> EOF
```

### Parameter Expansion

```shell
#!/bin/bash

res=${FOO-'default'}
res=${FOO:-'default'}
res=${FOO+'default'}
res=${FOO:+'default'}

# FOO='foo'
# foo
# foo
# default
# default

# FOO=''
# empty string
# default
# default
# empty string

# FOO unset
# default
# default
# empty string
# empty string

```
`:-` is more strict than `-`.

---

### Run command in history

```shell
$ history
$ !<COMMAND_NUMBER>
```

### define-n-use-variables

Varying ways of setting variables:

- `VARNAME=my_value` - only in current shell.
- `export VARNAME=my_value` - current shell and all processes started from current shell.
- Define vars in `.bashrc` - permanently for all future bash sessions.

```shell
// The shell variable is explicitly set and passed to the command you're running, causing it be an environment variable for the duration of the command being run.
$ VAR=foo node // process.env.VAR is foo.

$ VAR=foo && node // process.env.VAR is undefined
$ export VAR=foo && node // process.env.VAR is foo
$ http_proxy=123 && node // process.env.http_proxy is 123 why? because http_proxy is an env var
```

But, consider the npm script below:

```shell
// run yarn go and print process.env.VAR

"go": "export VAR=foo",
"no": "yarn go && node", // but node is launched by 'no' not 'go'

"go": "yarn no",
"no": "export VAR=foo && node",

// first one is undefined while second one is foo
```

As stated above, we export `VAR` from inside `go` script and its value is only available to program `node` being launched by `no`. As thus, the second case does the thing right.

### show real installation location of binary

```shell
$ ls -l `which java`

# output:
lrwxr-xr-x  1 root  wheel  74 23 Oct 15:31 /usr/bin/java -> /System/Library/Frameworks/JavaVM.framework/Versions/Current/Commands/java
```

### Safeguard shell scripts
Always add `set -euxo pipefail` to top of your shell scripts. `x` can be omitted if you don't need to print each command before it is executed.

```shell
#!/bin/bash

set -euxo pipefail

# e
# cause bash script to exit immediately when seeing non-zero exit code - an error

# o pipefail
# The bash shell normally only looks at the exit code of the last command of a pipeline.
# foo | echo 'a' will not exit which it should as foo command is not found. Turning flag e on will not help.
# that is why need set -o pipefail. This setting will check to see if there is any error in any command run in the pipe and exit if there is

# u
# treat unset variables as an error and exit immediately. i.e echo "$undefined". Note it's smart enough to not exit when it is seeing undefined variable in a parameter expansion. i.e RESULT=${UNDEFINED:-$DEFAULT}
```
[Safer bash scripts with 'set -euxo pipefail'](https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/)

### Alias

`alias` command will only work for that specific instance of the shell meaning once shell exits, effect will disappear.

