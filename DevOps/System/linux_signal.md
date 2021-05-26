## Signals in Linux

- Signal is a notification, a message sent by either OS or some apps to our program.
- Signals are a mechanism for one-way asynchronous notifications.
- A signal may be sent from the kernel to a process, from a process to another process, or from a process to itself.
- `SIGKILL` and `SIGSTOP` always terminates the process and stops the process respectively. They cannot be handled or blocked. But `SIGTERM` and `SIGINT` can.
- `kill` command generates 'SIGTERM' by default. It can be overwritten `kill -SIGINT PID`.

### What can you do when receiving signals?

- accept the default action, which maybe to terminate the process, terminate and coredump the process, stop the process, or do nothing, depending on the signal.
- processes can elect to explicitly ignore or handle signals.

```js
// When pressing ctrl+c, We ask the kernal to send the interrupt (SIGINT) to the process. Say it's a NodeJS process, then a signal event will be emitted by EventEmitter:

// ignored signals are silently dropped
process.on('SIGINT', () => {
  console.log('SIGINT received, ignored');
});

// or handled it (graceful shutdown). signals cause the execution of a user-supplied signal handler function. The program jumps to this function as soon as the signal is received, and the control of the program resumes at the previously interrupted instructions.
process.on('SIGINT', () => {
  console.log('SIGINT received, ignored');
  // graceful shutdown gives you the chance to do cleanup work or finish ongoing HTTP requests
  db.conn.close();
  // stop accepting new conns
  server.close(() => {
    console.log('Http server closed.');
  });
});
```
