## Systemd

- [systemctl](#systemctl)

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

# check service status
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
