### Basics
* Streams are collections of data like arrays or strings. The difference is that streams might not be available all at once, and they don't have to fit in the memory.
* Why do we need stream?

In the code below, Node program firstly creates a buffer with memory in the same size of file. Then `fs` reads the entire file content into buffer. The problem with this is apparent when dealing with large files i.e 2G. in which case your memory is drained!!! Also, it creates bad user experience since users will not receive anything until the buffer is full. By executing `readFile or readFileSync`, it will return a buffer that contains file content. To return a string, explicitely specify encoding as `utf-8`.
```js
var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    fs.readFile(__dirname + '/data.txt', function (err, data) {
        res.end(data);
    });
});
server.listen(8000);
```
Rewrite code above in stream:
```js
var stream = fs.createReadStream(__dirname + '/data.txt');
stream.pipe(res);
```
File content will be read into chunks (chunk-sized buffer) and transferred to the client continuously.
* All streams are instances of `EventEmitter`. They emit events that can be used to read and write data.

### Stream types
* Readable Stream
* Writable Stream
* Duplex Stream (Read and Write)
* Transform Stream (Read, Write and modify)

### More readings 
* [Node Stream Handbook](https://github.com/substack/stream-handbook)
* [Read files with Node](http://stackabuse.com/read-files-with-node-js/)
