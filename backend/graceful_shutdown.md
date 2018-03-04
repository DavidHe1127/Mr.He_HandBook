## Graceful shutdown of your Node App Server 

Essentially, you need to

* Stop accepting new requests
* Finish all ongoing requests
* Clean up resources it used - database connections, file locks

```js
process.on('SIGTERM', () => {
  logger.info('shutdown started')
  server.stop()
    .then(closeMysqlConnection())
    .then(() => {
      logger.info('process is stopping')
    })
})
```
