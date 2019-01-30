
## process.nextTick vs setImmediate

* `setImmediate(Fn)` will queue the `Fn` behind whatever I/O event callbacks that are already in the task queue. 
* `process.nextTick(Fn)` will effectively queue the `Fn` at the front of task queue so that it executes straight after the completion of current executing function.

So in a case where you're trying to break up a long running, CPU-bound job using recursion, you would now want to use setImmediate rather than process.nextTick to queue the next iteration as otherwise any I/O event callbacks wouldn't get the chance to run between iterations.

Referenced from [NodeJS Multi-threading: What are Worker Threads and Why do They Matter](https://blog.logrocket.com/node-js-multithreading-what-are-worker-threads-and-why-do-they-matter-48ab102f8b10)

```js
const crypto = require('crypto')

const arr = new Array(200).fill('something')
function processChunk() {
  if (arr.length === 0) {
    // code that runs after the whole array is executed
  } else {
    console.log('processing chunk');
    // pick 10 items and remove them from the array
    const subarr = arr.splice(0, 10)
    for (const item of subarr) {
      // do heavy stuff for each item on the array
      doHeavyStuff(item)
    }
    // Put the function back in the queue
    setImmediate(processChunk)
  }
}

processChunk()

function doHeavyStuff(item) {
  crypto.createHmac('sha256', 'secret').update(new Array(10000).fill(item).join('.')).digest('hex')
}

// This is just for confirming that we can continue
// doing things
let interval = setInterval(() => {
  console.log('tick!')
  if (arr.length === 0) clearInterval(interval)
}, 0)
```
