## VM

### Disk

- 3 Disk roles - Data disk, OS disk and Temporary disk.
- Data disk - customer defined, persistent, managed disk
- OS disk - all VMs have one, persistent
- Temporary disk - Local, non-persistent, used for storing temp files - page/swap files
    - On Azure Linux VMs, temp disk is typically `/dev/sdb` while on Windows VMs the temp disk is `D:` by default
- On linux, device naming conventions is as follow: sda (sATA disk) is the first disk, sdb is the second disk and so on sdc, sdd