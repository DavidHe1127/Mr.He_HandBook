## SSH(connection)

- [Port](#port)
- [SSH VS TLS](#ssh-vs-tls)
- [ssh connection](#ssh-connection)
- [Port Forwarding/Tunneling](#port-forwarding)

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

### Port Forwarding

It enables you to send traffic to a remote private server from your local terminal. The traffic flows from `client --> jump box (public subnet) --> server (private subnet)`. Note, jump box needs to open `22` and ideally should only allow traffic sourcing from a particular IP.

```shell
# ssh -L <local_port>:<remote_server_ip>:<remote_port> user@<jumpbox_ip> -N
ssh -L 6379:10.8.22.88:6379 ec2-user@5.26.117.150 -N
```

After tunnel connected, whatever command you push to `localhost:6379` will be forwarded through to `10.8.22.88:6379`. Specifying `-N` will avoid running command on remote server. It's useful when you only want the tunnel but are not interested in running any commands. i.e normally it would open a login shell when running `ssh ec2-user@x.xx.xxx.xxx`.
