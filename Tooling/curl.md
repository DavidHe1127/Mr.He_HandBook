## Curl

- Use `-d "{"version": "1.0.0.1"}"` to send plain json data
- [Curl Progress Metre](https://ec.haxx.se/cmdline-progressmeter.html)

```shell
$ curl -v -X POST -H 'Authorization: Bearer xxxxxxx' -H 'Content-Type: application/json' http://localhost:2202/api/platforms/xxxxxx/firmware -d '@firmware.json' -o 'output.md'
```

Redirect res into a file and log res status code to stdout
```shell
curl -s \
  -o res.json \
  -w "%{http_code}" \
  -X GET "${SONAR_URL}" \
  -H "Authorization: ${BASIC_AUTH_TOKEN}"
```

- Upload files
`-u` authentication
``` javascript
curl -u <FTP_USER>:<FTP_PSD> -T myfile.txt ftp://10.5.6.119:2221/folder
curl -u <FTP_USER>:<FTP_PSD> -T '{file1,file2}' ftp://10.5.6.119:2221/folder
```

