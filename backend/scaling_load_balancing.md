* Use `fork` method provided by `cluster` module (use `child_process.fork` api under the hood) to enable load balancing over an multi-core CPU.
* It is suitable for only one machine.
* We create a `master` process which in turn forks as many `worker` AKA `child process` as the number of CPU core.

```javascript
// cluster.js
const cluster = require('cluster');
const os = require('os');

// run the file first time will execute the master process and set the isMaster true
if (cluster.isMaster) {
  const cpus = os.cpus().length;
  console.log('Forking ' + cpus + ' child processes');
  
  for(let i = 0; i < cpus; i++) {
    cluster.fork(); // run this file again. It is in worker mode this time and 'isMaster' is false
  }
} else {
  require('./server');
}
```


* All incoming requests are handled by the master process. It then decides which `worker` process should handle the request.
* `master` process uses `round-robin` algorithm to distribute the workload evenly across all available processes on a rotational basis.
  the first request goes to the first `worker` process, the second goes to the next `worker` process and so on until the last one is occupied.
  Then the algorithm starts all over again from the beginning.
* Use **Apache benchmarking tool** to benchmark your server performance.
* Remember each `worker` process has its own `event loop` and `memory space` and one cannot access the other's memory - spin-up takes time.
* Communication channels setup between the master process and each worker.
```javascript
// send message from master to workers
Object.values(cluster.workers).forEach(worker => {
  worker.send(`Hello Worker ${worker.id}`);
});

// in server.js read message sent from master
process.on('message', msg => {
  console.log(`Message from master: ${msg}`);
});
```
* Recommended tool [StrongLoop Process Manager](https://github.com/strongloop/strong-pm)
* We should not always rely on CPU cores to determine how many workers we need to spin up since if the server has limited resources - i.e 512M memory, more than one worker will simply compete for more memory. Thus, multi-instance will hurt rather than benefit. Heroku for instance resolve such problem by using `process.env.WEB_CONCURRENCY` which works out the optimal number of instances you should spin up as per `dyno` resources.
* Use `throng` for node clustering.


