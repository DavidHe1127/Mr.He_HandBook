## Stream and Buffer

- [What is stream and why we need it](#what-is-stream-why-we-need-it)
- [Streams and Buffer](#stream-and-buffer)
- [Lab](#lab)
- [More readings](#more-readings)

### What is stream and why we need it

Streams are collections of data like arrays or strings. The difference is that streams might not be available all at once, and they don't have to fit in the memory.
Why do we need stream?

In the code below, Node program firstly creates a buffer with memory in the same size of file. Then `fs` reads the entire file content into buffer. The problem with this is apparent when dealing with large files i.e 2G. in which case your memory is drained!!! Also, it creates bad user experience since users will not receive anything until the buffer is full. By executing `readFile or readFileSync`, it will return a buffer that contains file content. To return a string, explicitely specify encoding as `utf-8`.

```js
var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res) {
  fs.readFile(__dirname + '/data.txt', function(err, data) {
    res.end(data);
  });
});
server.listen(8000);
```

Rewrite with stream:

```js
var fs = require('fs');
// create a read stream to read contents out from input file
var readStream = fs.createReadStream('./datainput.txt');
// create a write stream to hold transferred data from read stream
var writeStream = fs.createWriteStream('./dataOutput.txt');
// pipe data comes into read stream into write streams
// it has built-in backpressure
readStream.pipe(writeStream);
```

File content will be read into chunks (chunk-sized buffer) and transferred to the destination continuously. This allows us to read part of file i.e header in a csv while leaving remainder unprocessed whereas `readFile` has to process the entire file.

```js
const stream = fs.createReadStream(file, {encoding: 'utf8'});
stream.on('data', data => {
  header = data.split(/\n/)[0];
  stream.destroy();
});
stream.on('close', () => {
  console.log('read complete');
});
```

Use [Stream JSON](https://www.npmjs.com/package/stream-json) when handling big json in node.

All streams are instances of `EventEmitter`. They emit events that can be used to read and write data.

### Stream and Buffer

Key points:

- Readable Stream
  - Data is buffered in Readable streams when the implementation calls `stream.push(chunk)`. If the consumer of the Stream does not call `stream.read()`, the data will sit in the internal queue until it is consumed
  - Once the total size of the internal read buffer reaches the threshold specified by `highWaterMark`, the stream will temporarily stop reading data from the underlying resource until the data currently buffered can be consumed (that is, the stream will stop calling the internal `readable._read()` method that is used to fill the read buffer).
  - When buffer size limit is reached, `data` event will be fired and attached callback will be fired at which point you can start processing received data.
- Writable Stream
  - Data will be written to internal buffer of writable stream rather than to writable stream directly, `highWaterMark` controls how large the buffer needs to be for data storage.
  - Buffered data will be continuously written to writable stream until buffer is full.
  - If `highWaterMark` limit is never hit, `drain` event will not fire.
  - `writableStream.write('xxx')` will return `false` indicating buffer is full so that you should not continue to write
  - If you continue to do so, data to be written will end up being held in memory (buffer) and won't get lost - this could cause memory blow-up.
- Duplex Stream (Read and Write)
- Transform Stream (Read, Write and modify)

### Lab
[Stream](https://github.com/DavidHe1127/lab/tree/master/node/stream)

### More readings

- [Node Stream Handbook](https://github.com/substack/stream-handbook)
- [Read files with Node](http://stackabuse.com/read-files-with-node-js/)
