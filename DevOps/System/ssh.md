## SSH(connection)

- [Port](#port)
- [SSH VS TLS](#ssh-vs-tls)
- [ssh connection](#ssh-connection)

### port

`ssh` uses port `22`.

### SSH vs TLS

`SSL` is designed to secure the transmission of data. While `SSH` (Secure Shell) is designed to execute remote commands. i.e `git push` uses `ssh` to do its job via the key that's issued by an user.

### SSH connection

2 important files - `known_hosts` and `authorized_keys` under `~/.ssh/`.

**known_hosts**

- A client should know that the server it's trying to connect is indeed the server it claims to be.
- It maintains a list of known hosts in the format of `hostname,ip algo public_key` or `hostname algo public_key`.

```sh
192.168.1.20 ecdsa-sha2-nistp256 public_key
gerardnico.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABA............
```

- Its purpose is to prevent man-in-the-middle attacks by ensuring that you are connecting to the same server that you were connected to last time (it hasn't been sneakily swapped out by a DNS hack).
- Host Key Verification process:
  - When an SSH server is initialized, it creates a host key, which is a public/private keypair. The SSH server gives out the public key to anyone who wants to connect to it.
  - Your SSH client checks if the host you are trying to connect to has an entry in the `known_hosts` file.
  - If the entry does not exist, adds it in.
  - If the entry exists, use the host key (which is a public key) to encrypt a message, and expect the server to decrypt it. If the server has successfully decrypted the message, then it means that the server holds the private key which matches the given host key, meaning that it is who it claims to be

When similar warning message is presented, it means host identity is changed since last connection, you can simply find the entry and remove it. That way, you can connect afresh.

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@       WARNING: POSSIBLE DNS SPOOFING DETECTED!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
The ECDSA host key for jenkins.lz002.awsnp.national.com.au has chan
ged,
and the key for the corresponding IP address 10.156.61.79
is unknown. This could either mean that
DNS SPOOFING is happening or the IP address for the host
and its host key have changed at the same time.
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle
attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ECDSA key sent by the remote host is
SHA256:heOIATWHJC/Vfy6IHNG3BjFhFlQnl6UqwKi1mTsHpsw.
Please contact your system administrator.
Add correct host key in /Users/P782199/.ssh/known_hosts to get rid
of this message.
Offending ECDSA key in /Users/P782199/.ssh/known_hosts:11
ECDSA host key for jenkins.lz002.awsnp.national.com.au has changed
and you have requested strict checking.
Host key verification failed.
```

**authorized_keys**

- Just like the client wants to know if the host is who it really claims to be, the server wants to know if the user that is connecting is in fact the user it claims to be.
- Client generates a public/private key pair and then appends public key to `authorized_keys` file. Server admin can help client with key addition.
- Key-based Authentication process
  - Client user `david` connects to `ssh.foo.com` and goes through the previously discussed host-key verification process.
  - Server asks for a user name and the client responds with `david`.
  - Client offers the public key for `/Users/david/.ssh/id_rsa` (which is stored in `/Users/david/.ssh/id_rsa.pub`)
  - Server checks to see if that public key is in the list of authorized keys that would allow us to connect to the user’s account on client server (the authorized keys are in `/home/david/.ssh/authorized_keys`)
  - If the key exists, server will encrypt a message using the public key from the authorized keys list and expect the client to be able to decrypt it, since it should have the private key
  - Client will get the encrypted token from the server, decrypt it, and send it back (it actually sends back a hash of the token and a session key, but this is not important for the sake of this explanation)
  - Server will see that the token was decrypted successfully, and will allow the user to log in as `david` by impersonating the user.
