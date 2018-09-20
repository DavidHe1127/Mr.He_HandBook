## JS/Node error handling guide

### Key points
* When a runtime error occurs, a new `Error` object will be created and thrown. We can use `try/catch` block to handle errors ourselves rather than
  let the browsers handle it
* Never throw errors in your api server since throw a error simply turns errors into exceptions!
  ```js
  // don't do this unless unless it is in async/await
  throw new Error('something bad happened');

  // do this instead
  callback(new Error('something bad happened'));
  ```
* Two types of errors: **Operational Errors** vs **Programmers Errors**

  * Operational errors represent run-time problems experienced by correctly-written programs. These are not bugs in the program. In fact, these are usually problems with something else: the system itself (e.g., out of memory or too many open files), the system's configuration (e.g., no route to a remote host), the network (e.g., socket hang-up), or a remote service (e.g., a 500 error, failure to connect, or the like). Examples include:
      * failed to connect to server
      * failed to resolve hostname
      * invalid user input
      * request timeout
      * server returned a 500 response
      * socket hang-up
      * system is out of memory
  * Programmer errors are **BUGS** in the program. These are things that can always be avoided by changing the code. They can never be handled properly (since by definition the code in question is broken).
      * tried to read property of "undefined"
      * called an asynchronous function without a callback
      * passed a "string" where an object was expected
      * passed an object where an IP address string was expected
* **The best way to recover from programmer errors is to crash immediately.**

  You should run your programs using a restarter that will automatically restart the program in the event of a crash. With a restarter  in place, crashing is the fastest way to restore reliable service in the face of a transient programmer error.
  Some people advocate attempting to recover from programmer errors — that is, allow the current operation to fail, but keep handling requests. This is not recommended. Consider that a programmer error is a case that you didn't think about when you wrote the original code. How can you be sure that the problem won't affect other requests? If other requests share any common state (a server, a socket, a pool of database connections, etc.), it's very possible that the other requests will do the wrong thing.
  
* Comparisons
![error_handling](./error_handling.png)

* The general rule is that a function may deliver operational errors synchronously (e.g., by throwing) or asynchronously (by passing them to a callback or emitting error on an EventEmitter), but it should not do both. This way, a user can handle errors by either handling them in the callback or using try/catch, but they never need to do both.

* The correct use of 'uncaughtException' is to perform synchronous cleanup of allocated resources (e.g. file descriptors, handles, etc) before shutting down the process.
```js
process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });
```
