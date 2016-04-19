##Sample
* Use `-d "{"version": "1.0.0.1"}"` to send plain json data
* `-v` - verbose mode

```javascript
curl -v -X POST -H 'Authorization: Bearer xxxxxxx' -H 'Content-Type: application/json' http://localhost:2202/api/platforms/xxxxxx/firmware -d '@firmware.json'
```
