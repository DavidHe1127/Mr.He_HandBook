## Systemd

- [systemctl](#systemctl)
  - [Debugging tips](#debugging-tips)
- [Unit Files](#unit-files)
- [Unit status](#unit-status)
- [References](#references)

### systemctl

- A init system.
- The fundamental purpose of an init system is to initialize the components that must be started after the Linux kernel is booted (traditionally known as “userland” components).
- The init system is also used to manage services and daemons for the server
- Units are categorized by the type of resource they represent and they are defined with files known as unit files i.e Service unit, path unit, mount unit.
- Located at `/etc/systemd/system/*`

### Common commands

#### Service Level

```shell
# if unit is a service, .service suffix can be omitted

# reload if service is capable of reloading changed config or restart if it is not
sudo systemctl reload-or-restart application

# start up service upon boot, it is made possible by symlinking service file in /etc/systemd/system into the place systemd looks for autostart files Keep in mind that enabling a service does not start it in the current session. If you wish to start the service and also enable it at boot, you will have to issue both the start and enable commands
sudo systemctl enable application

# stop service start-up upon system boot, remove symlink
sudo systemctl disable application

# check service status. This command also tells you where the unit file for the service is
systemctl status application

# if service is up and running. exit code 0 => active
systemctl is-active application

# if app is enabled or not. 0 enabled 1 disabled
systemctl is-enabled app

# This will prevent the Nginx service from being started, automatically or manually, for as long as it is masked. Use unmask to reverse the state
sudo systemctl mask nginx.service
```

#### System Level

```shell
# list all active units
systemctl list-units OR systemctl

# run it after config change which will reload all units from disk
sudo systemctl daemon-reload
```

### Debugging Tips

`journalctl -u <SERVICE>` to see more infor around services failing to start. Use `-f` to show logs in follow mode.

```shell
journalctl -u cadvisor.template -f
```

---

### Unit Files

#### Path

Watch for changes to files or paths and trigger specified actions when changes being detected. It's paired with a `.service` file with the same name. Sometimes, you might want to start up the service only a prerequisite config file does exist. This is a good user case for Path file.

```shell
# foo.path
[Unit]
Description = monitor some files

[Path]
PathChanged = /tmp/foo
PathModified = /tmp/a.log
# allow multiple entries
PathExists = /tmp/file.lock
PathExists = /tmp/file2.lock
MakeDirectory = yes
# trigger foo.service when changes detected
Unit = foo.service

# how this service is enabled - auto start on boot
# this service is enabled as part of multi-user.target target
[Install]
WantedBy = multi-user.target

# foo.service
[Unit]
Description = foo.service

[Service]
ExecStart = /bin/bash -c 'echo file changed >>/tmp/path.log'
```

#### Target

A group of units.

```shell
# /etc/systemd/system/foo.target
[Unit]
Description=Foobar boot target
Requires=multi-user.target
# this will a) create a dir in /etc/systemd/system/foo.target.wants
# b) softlink /etc/systemd/system/foobar.service to /etc/systemd/system/foo.target.wants/foobar.service
Wants=foobar.service
Conflicts=rescue.service rescue.target
After=multi-user.target rescue.service rescue.target
AllowIsolate=yes
```

#### Unit file state

- `static` - doesn’t have an install section that is used to enable a unit. As such, these units cannot be enabled. Usually, this means that the unit performs a one-off action or is used only as a dependency of another unit and should not be run by itself.

#### Unit file management

```shell
# show unit file for a unit
systemctl cat atd.service

# show a deps hierarchy tree
systemctl list-dependencies sshd.service
```

- Normally services are started simultaneously unless using after and before to control order.
- `wants` and `requires` dictates dependency relations NOT start-up order.
- `wants` is weak dependency while `requires` is strong dependency.
- `EnvironmentFile=-/etc/sysconfig/sshd` - Unit file execution will not stop even if ssh file does not exit. See `-`.

todo
- A target is a group of units. All units in this group will


### Unit Status

- `loaded active exited` run once unit. In other words, service is not run as a daemon.

### References

- [Systemd guide](https://cloud.tencent.com/developer/article/1516125)
