## Linux

- [Process](#process)
- [Multi-threading](#multi-threading)
- [Signal](./linux_signal.md)
- [File and Permissions](#file-and-permissions)
- [Host file](#host-file)
- [SSH](#ssh)
- [Add Users](https://www.tecmint.com/add-users-in-linux/)
- [sudo and sudoers File](#sudo-and-sudoers-file)
- [ssh config file](#ssh-config-file)
- [IO Redirection](#io-redirection)
- [CPU and Memory](#cpu-and-memory)
- [Internal vs External commands](#internal-vs-external-commands)
- [systemd](./systemd.md)
- [Linux commands dict](https://wangchujiang.com/linux-command/)
- [Commands](#commands)
  - [Tee](#tee)
  - [watch](#watch)
  - [dig](dig.md)
  - [Redirect app logs to stdout from static files](#log-redirection)
  - [Show process listening ports](#show-process-listening-ports)
  - [Scheduled tmp folder clean-up service](#scheduled-tmp-folder-cleanup)

### Shell

- [Shell](./shell.md)
- [Example script](./shell_scripting.md)
- [Bash Template](./bash_template.md)

### Process

- Application stored in the disk will be loaded into memory when it's running. This process will turn the application into a running process with an id (pid). Also, process has state.
- The system `libs` are shared - i.e there is only one copy of `printf` in the memory so it can be accessed by different processes.
- When system is being booted, kernel creates a special process called `init` - the parent of all processes which is derived from the file `/sbin/init`. It is never killed until the system shuts down.

To run a process and put it in the background (using &) which then gives you prompt back:

```
$ gunzip file.gz &
```

#### ps

Run `ps` without any flags will return only the process running under the logged in user account from the current terminal. A more commonly-used way is to run with `aux`. i.e `ps aux|grep jenkins`.

```
a = show processes for all users
u = display the process's user/owner
x = also show processes not attached to a terminal
```

### Multi-threading

One process can have 1 or many threads. At any single time, there is only one thread running on single-core processor. The reason we can have multiple processes running is actually done by context switching where each thread is given a time slice to run on processor then stop making way for another thread to jump on. All this is controlled by CPU. Switching happens so fast making it look like things running simultaneously.

In a multi-core CPU environment, it genuinely allows multiple threads each run on a separate core. This is the real concurrency. It boosts the overall CPU performance.

### File and Permissions

![ls output](./ls.jpg)

`Group` permissions give any users in a particular group rights to perform `read/write/execute` on file or directory.

`Other` permissions give everyone else on the system.

To see which group you are in:

```
$ groups davidhe
```

To modify permissions (user: read/write & group, other: read):

```
$ chmod 644 file
```

![chmod](./linux_permissions_chmod.jpg)

### host-file

Hosts file is a simple txt file situated at `/etc/hosts` on Linux and Mac OS.
Given `host` file below:

```
127.0.x.x  mydomain
```

It means system will not do a DNS lookup for `mydomain` but rather direct traffic to the IP address you specified in your hosts file.
On most systems the default entry in the hosts file is:

```
127.0.0.1  localhost
```

`127.0.0.1` is always the address of the computer you're on. For example, if you run a web server on your pc, you can access it from the web browser via `http://localhost:port` instead of typing the whole IP address `http://127.0.0.1:port`.

### ssh

Example `~/.ssh/config`

```
Host remote
     HostName 13.211.224.214
     Port 22
     User ec2-user
     IdentityFile ~/.ssh/id_rsa
```

With this configuration, you ssh into another ec2 instance by typing `ssh remote`.

### sudo and sudoers file

- sudo (super user do)

  - lets you use your own password to execute commands
  - When sudoing, things below will happen:

    1. System does a look-up in `/etc/sudoers` file to find out if the user has privilege to execute `sudo`.
    2. If yes, the users will be prompted for their own password.
    3. If authed, system will execute command specified by `sudo`.

  - i.e

  ```shell
  $ sudo node               # run node command as a root user
  $ sudo node -U xxxx       # run node command as user xxxx
  $ sudo -l -U xxxx         # list all this user can do
  $ sudo su                 # means run the command su as sudo which means as root. Here the system will ask you for your
                            # password since you are a sudoer. After you enter your password, you now have root privilege
                            # useful when you need to execute a number of commands as root. As opposed to sudo <command>
  ```

  - if you see something like this:

  ```
  Sorry, user xxxx is not allowed to execute '/Users/xxxx/.nvm/versions/node/v8.16.1/bin/node -u xxxx' as root on COMPUTERNAME (host).
  ```

  it basically means the command you are trying to run is not a whitelisted command you can run on behalf of root.

- su (switch user)

  - lets you switch to other users by entering their password. Once auth is passed, a new shell prompt will be opened with target user's privileges.

  - i.e

  ```shell
  $ su bob    # switch to user bob
  $ su        # switch to root user or aka superuser. Keeps your existing env vars
  $ su -      # Same as above but with settings of your specified user. In this case, it's root user's settings
  ```

[Further reading](https://askubuntu.com/questions/376199/sudo-su-vs-sudo-i-vs-sudo-bin-bash-when-does-it-matter-which-is-used)

![sudoers file](./sudoers_file.png)
Anything enclosed by [] is optional

```bash
# root user
root ALL=(ALL:ALL) ALL

# sudo group users
%sudo ALL=(ALL:ALL) ALL

# user jack can run vi,ls on behalf of root on host nginx without passwords
jack nginx=(root) NOPASSWD: vi,ls

# user peter can run all commands on behalf of all users on all hosts without password
peter ALL=(ALL) NOPASSWD: ALL

# user papi can run /bin/chown on behalf of root on all hosts without password
# user papi can run /usr/sbin/useradd on behalf of root on all hosts with password
papi ALL=(root) NOPASSWD: /bin/chown,/usr/sbin/useradd
```

[sudoers file explained](https://www.cnblogs.com/jing99/p/9323080.html)

### IO Redirection

Difference between `2>&1` and `2>1` is the previous one will redirect the `stderr` to `stdout` while the latter one redirects the `stderr` to file named `1`.

As you can see, **&** here is used to distinguish `stdout (1)` or `stderr (2)` from files named `1` or `2`.

```shell
# And this will redirect `stdout` and `stderr` to null device resulting in nothing prints out to terminal. It works because `stdout` redirects to `/dev/null`, and then `stderr` redirects to the address of `stdout` by using `>&`, which has been set to `/dev/null`, consequently both `stdout` and `stderr` point to `/dev/null`.
$ CMD > /dev/null 2>&1
$ 2>/dev/null # redirect STDERR to /dev/null
$ &>/dev/null # redirect both STDERR and STDOUT to /dev/null (nothing will show up)
$ >/dev/null  # redirect STDOUT to /dev/null (only STDERR shows up)

# Command substitution only catches the standard output(stdout). Code below will direct stderr to terminal
var=$(mkdir '')
# empty!
echo "$var"

# to capture stderr into var
var=$(cat file.log nofile.txt 2>&1 >/dev/null)

# send logs to other places rather than syslog
logger -t SPOT -s "$1" 2>> /var/log/spot-interruptions
```

### CPU and Memory

IO Wait - for a given CPU, the I/O wait time is the time during which that CPU was idle (i.e. didn’t execute any tasks) and there was at least one outstanding disk I/O operation requested by a task scheduled on that CPU (at the time it generated that I/O request).

### Internal vs External commands

- Internal commands that are built into shell. Execution of them are faster as shell doesn't need to find path for them by querying `PATH` variable. No extra process will be spawned to execute them
- External commands that are not built into shell. Shell needs to query `PATH` to learn about where the binary is. New process will be spawned to execute them.

```shell
$ type cat
cat is /bin/cat

$ type cd
cd is a shell builtin
```

---

### Commands

#### Tee

- Name after t-splitter in plumbing.
- Write output to stdout as well as one or more files.
- write to stdout and file simultaneously.

```shell
command -> tee → stdout
            ↓
           file
...
$ ls|tee file1.txt
```

#### Watch

Continuously watch a command execution and print result.

```shell
$ watch -n 1 -b "curl https://api.theparrodise.com/weather"
```

Call api server every 1 second and `b`eep when a non-zero exit code emits.

#### Show process listening ports

```shell
$ lsof -Pan -p PID -i
```

#### Scheduled tmp Folder Cleanup

Use `systemd-tmpfiles-clean` service for this purpose.

#### Log redirection

Trick below will forward logs to `stdout` rather than `access.log`.

```shell
$ ln -sf /dev/stdout /var/log/nginx/access.log
```
