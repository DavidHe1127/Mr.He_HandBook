##Sample
* Use `-d "{"version": "1.0.0.1"}"` to send plain json data
* `-v` - verbose mode
* `-o` - output response to a file. `-O` - filename in the URL will be taken and used as the filename to store result
* **Quote url** if you have queries in it. i.e `http://localhost:2002/api/products?platform_id=xxxxx&flavor_id=xxxxx`

```javascript
curl -v -X POST -H 'Authorization: Bearer xxxxxxx' -H 'Content-Type: application/json' http://localhost:2202/api/platforms/xxxxxx/firmware -d '@firmware.json' -o 'output.md'
```
* Upload files
`-u` authentication
``` javascript
curl -u <FTP_USER>:<FTP_PSD> -T myfile.txt ftp://10.5.6.119:2221/folder
curl -u <FTP_USER>:<FTP_PSD> -T "{file1,file2}" ftp://10.5.6.119:2221/folder
```

