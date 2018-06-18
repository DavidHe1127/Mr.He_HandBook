## HTTP/2

#### Multiplexing
  * With HTTP/1.1, you can only download one resource at time. When your site needs two resources `a.css` and `b.js`, a needs to be downloaded first
    before connection to download b can be established. It is really inefficient since client and server don't do too much.
  * To mitigate this, browsers allow for opening multiple connections (typically 6-8) to download them simultaneously. But there is cost involved.
    - setup/manage multiple connections which impact both client and browser.
  * With HTTP/2, it allows you to send off multiple requests on the **same** connection. The requested resources are fetched in parallel and received
    **in any order**.
  * Note, HTTP/1.1 has a concept of `pipelining` which also allows multiple requests to be sent off at once but they need to be returned **in the order they were requested**. This feature is nowhere near as good as HTTP/2 so it is hardly used.

------------------------------------------------------------

#### HTTPs communications between clients and servers
SSL/TLS is implemented in the browsers (and web server) to provide confidentiality and integrity for HTTPS traffic (actual encryption of the data).

* Browser connects to a web server (website) secured with SSL (https). Browser requests that the server identify itself.
* Server sends a copy of its SSL Certificate, including the server’s public key.
* Browser checks the certificate root against a list of trusted CAs and that the certificate is unexpired, unrevoked, and that its common name is valid for the website that it is connecting to. If the browser trusts the certificate, it creates, encrypts, and sends back a symmetric session key using the server’s public key.
* Server decrypts the symmetric session key using its private key and sends back an acknowledgement encrypted with the session key to start the encrypted session.
* Server and Browser now encrypt all transmitted data with the session key.

[AWS ELB and ECS](https://medium.com/containers-on-aws/using-aws-application-load-balancer-and-network-load-balancer-with-ec2-container-service-d0cb0b1d5ae5)
