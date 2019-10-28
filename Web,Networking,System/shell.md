## Shell script, commands

- [What is shell](#what-is-shell)
- [ctrl+d vs ctrl+c](#ctrld-ctrlc)
- [ls](#ls-output-explained)
- [less](#less)
- [scp](#scp)
- [Dot files](#dotfiles)
- [Man page/help](#manpage-help)
- [Input and Output](#input-output)
- [double dash in command](#double-dash)
- [Find files](#find-files)
- [Source a file](#source-a-file)
- [Makefile](#makefile)
- Tips
  - [Run command in history](#run-command-in-history)
  - [Define and use Variables](#define-n-use-variables)
- [Scripting](#scripting)

### what is shell

Located in `/bin/sh`. A shell is a program that runs commands. The shell also serves as a small programming environment. There is an enhanced version of shell called `bash` or `Bourne-again shell`.
We open a shell window via terminal.

### ctrld-ctrlc

- `ctrl+d` on an empty line stops the current standard input entry from terminal.
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

### scp

```
scp -i path/to/key file/to/copy ec2-user@<EC2_IP>:path/to/file
```

### dotfiles

Dot files such as `.babelrc` is a configuration file that is not displayed when you run `ls` unless with `-a`. Similarly, shell globs don't match dot files.

### manpage

```js
$ man ls
$ man -k <KEYWORD>
```

Sometimes, you might need to run:

```
$ ls --help
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

### find-kill-process

Works on OS X

```bash
> lsof -i:8000
> kill PID
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
COLORTERM ?= "Bright"

task:
   # @ will suppress command name from being logged to terminal
    @date
some:
    sleep 1
    echo "Slept"
thing:
    cal
    echo ${COLORTERM}

# pass arg $ make test SOS='o yeah'
test:
   @echo $(SOS)

# execute clean anyway even if a file called clean exists in the same directory as makefile
.PHONY: clean

clean:
  rm -rf *.o

# use as a build tool
deploy-something:
  @echo "Deploy something..."
  ./scripts/deploy_something.sh ${env} ${tag}
```

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

---

### Scripting

```sh
#!/bin/bash

# e - exit immediately if a command exits with a non-zero status
# x - print commands and their arguments as they are executed
set -xe

# turn off debugging
set +x

# evaluation & interpolation
FOO=`whoami`
EVAL_FOO=`echo Port no. is $FOO not good`

echo $EVAL_FOO

# reset var to an empty string
HTTP_PROXY=
```
