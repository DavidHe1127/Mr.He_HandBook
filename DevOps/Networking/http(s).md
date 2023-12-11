## HTTP, HTTP(S) with SSL/TLS and Cert

- [Cert standard and format]()
- [Cert Signing](#what-does-signing-a-cert-mean)
- [Key points](#key-points)
- [SSL Cert with Let's encrypt](#ssl-cert-with-lets-encrypt)
- [How SSL works](#how-ssl-works)
- [Persistent Connection](https://www.oreilly.com/library/view/http-the-definitive/1565925092/ch04s05.html)
- [CA](#ca)
- [Self-signed cert generation script](#cert-generation-script)

- [HTTP/2](#http/2)
- [Redirection](#redirection)

### Cert standard and format

- x.509 defines structure and data fields of a cert
- Cert has different formats such as PEM that's base64 encoded or PKCS#12 in binary format.

For more see [this](https://www.tutorialsteacher.com/https/ssl-certificate-format).

### What does signing a cert mean?

It basically means CA using its private key to encrypt a certificate's content.

When a certificate is signed, the CA calculates a hash value of the certificate's contents and encrypts it using the CA's private key. The encrypted hash value, known as the digital signature, is then added to the certificate. The digital signature serves as a guarantee that the certificate has not been altered or tampered with, and that it can be trusted.

### Key points

- Private key stays with owner (or server in webapp context) while public key can be distributed
- Root Cert is cert issued by a trusted CA. It contains public key and is not encrypted. So client can use the public key to decrypt the cert being presented by server. Cert provided by server is signed/encrypted by CA private key.
- In client/server communication process, client needs `CA Cert` while server needs to have its `Cert` as well as `Private Key`. Private key is used to decrypt the session key being encrypted by public key enclosed in `Cert`. Session key is used for comms.

### Ssl cert with Let's encrypt

- The objective of Let’s Encrypt and the ACME protocol is to make it possible to set up an HTTPS server and have it automatically obtain a browser-trusted certificate, without any human intervention. This is accomplished by running a certificate management agent on the web server.
- There are two steps to this process. First, the agent proves to the CA that the web server controls a domain (DNS challenge). Then, the agent can request, renew, and revoke certificates for that domain.

![ACME_CA](./ACME_let's_encrypt.png)

Certbot is a very popular agent.

### How SSL works

`SSL/TLS` connection enforces data encryption during transmission over the network:

1. `Browser` connects to a web server (website) secured with SSL (https). `Browser` requests that the `Server` identifies itself.
2. `Server` sends a copy of its `SSL Certificate` with server's public key enclosed.
3. `Browser` checks the certificate root against a list of trusted CAs (comes with Browsers) and that the certificate is unexpired, unrevoked and that its common name is valid for the website that it is connecting to. If the `Browser` trusts the certificate, it creates, encrypts and sends back a symmetric session key using the `Server's` public key.
4. `Server` decrypts the symmetric session key using its private key and sends back an acknowledgement encrypted with the session key to start the encrypted session.
5. `Server` and `Browser` now encrypt all transmitted data with the session key - (symmetric encryption).

Please note, for all above to work, `ssl cert` needs to be placed under a particular directory on `Server` side for `ssl` server to locate.

### mTLS

Server requests clients to prove they are who they claim to be by asking for a client cert. The process is the same to server authentication but happens in a reverse way.

Typically, org creates its own root cert so org itself becomes a CA. Client cert/private key are created and signed by root cert. They need to be kept on client side and will be presented to server during client authentication.

[See how mTLS works in Node](https://codeburst.io/mutual-tls-authentication-mtls-de-mystified-11fa2a52e9cf)

Alternatively, if org doesn't generate its own root cert, server can send a list of trusted CA certs to the clients while requesting a client cert. The list tells clients only these CA certs are supported and can be used to verify client cert. For an example with Nginx, see [client auth](https://github.com/DavidHe1127/Mr.He_HandBook/tree/master/DevOps/Monitoring/prometheus#auth).

### CA

- Verify identity of servers clients trying to connect. It's done by verifying the cert servers respond with against CAs installed on clients' browsers.
- Issue cert to servers. Done through asking clients to complete DNS challenge and issuing CA signed cert upon DNS challenge success.
- CA warns clients with a message of `your connection is not private` when either servers present a self-signed cert or no cert to clients. Self-signed cert means the cert is not signed by publicly trusted CA's private key. i.e Servers use their own private key to sign and generate the cert.

### Self-signed Cert Generation Script

```shell
# CN (Common Name) needs to match FQDN you wish to use cert with
openssl req \
  -newkey rsa:2048 \
  -days 365 \
  -nodes \
  -x509 \
  -keyout federated-prom.key \
  -out federated-prom.crt \
  -subj "/C=AU/ST=Sydney/L=Sydney/O=DavidHe/CN=federated-prom"
```

---

### HTTP/2

#### Multiplexing
- With HTTP/1.1, you can only download one resource at time. When your site needs two resources `a.css` and `b.js`, a needs to be downloaded first before connection to download b can be established. It is really inefficient since client and server don't do too much. - To mitigate this, browsers allow for opening multiple connections (typically 6-8) to download them simultaneously. But there is cost involved - setup/manage multiple connections which impact both client and browser.
- With HTTP/2, it allows you to send off multiple requests on a single connection. The requested resources are fetched in parallel and received
  **in any order**.
- Note, HTTP/1.1 has a concept of `pipelining` which also allows multiple requests to be sent off at once but they need to be returned **in the order they were requested**. This feature is nowhere near as good as HTTP/2 so it is hardly used.
- Browsers will learn from TLS handshake that if a site/server it's trying to connect to supports HTTP/2 or not.

### Redirection

`302` - tells the browsers to not cache new url at all unless response header specifies `Cache-Control` or `Expires` with particular values. It's aka `temporary redirection`.
`301` - tells the browsers to cache new url permanently. It's aka `permanent redirection`.
In case you don't want browser to cache it, modify response headers:

```
Cache-Control: no-store, no-cache, must-revalidate
Expires: Thu, 01 Jan 1970 00:00:00 GMT
```
