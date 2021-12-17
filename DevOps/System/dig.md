## Dig

### Key points

- It's used to query a DNS server about what records a domain/host holds
- TTL in the result is the **time left until the TTL expires**.
- Just want to see TTL?
```
dig +nocmd +noall +answer A www.xxx.com.
```
- It looks up `/etc/resolv.conf` for name server it should use to send the query:

/etc/resolv.conf
```
nameserver 192.168.1.1
```
You can also specify a different ns you want to use:

Use google dns
```shell
$ dig @8.8.8.8 m.linuxidc.com
```

- Use `+short` to return A record value only:

```shell
$ dig m.linuxidc.com +short
```
- `~/.digrc` can be created to specify default flags for all queries:

.digrc
```
+nocmd
+nostats
+noquestion
+short
```

- It also allows query for a particular record type:

```shell
$ dig hungrypenguin.net MX
```

- Reverse lookup

```
$ dig -x 8.8.8.8
```

- Trace mode shows you full details of recursive resolutions

```
$ dig +trace https://lendi.com.au
```


### Example response

```shell
; <<>> DiG 9.2.4 <<>> www.hungrypenguin.net
;; global options:  printcmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 28017
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 2, ADDITIONAL: 2

;; QUESTION SECTION:
;www.hungrypenguin.net.         IN      A

;; ANSWER SECTION:
www.hungrypenguin.net.  75583   IN      A       67.15.117.250

;; AUTHORITY SECTION:
hungrypenguin.net.      75583   IN      NS      ns2.hosteurope.com.
hungrypenguin.net.      75583   IN      NS      ns.hosteurope.com.

;; ADDITIONAL SECTION:
ns.hosteurope.com.      158892  IN      A       212.67.202.2
ns2.hosteurope.com.     158892  IN      A       212.67.203.246

;; Query time: 2474 msec
;; SERVER: 193.231.237.2#53(193.231.237.2)
;; WHEN: Tue Apr  5 16:10:48 2005
;; MSG SIZE  rcvd: 136
```

- `;;` or `;` indicates the comments
- `IN` means internet lookup
- `SERVER` indicates DNS server used to resolve the query

### References

- [Linux dig analysis](https://www.linuxprobe.com/linux-dig-analysis.html)
- [Check your DNS records with dig](https://www.linux.com/training-tutorials/check-your-dns-records-dig/)
