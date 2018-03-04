## Graceful shutdown of your Node App Server 



Should stop accepting new requests, finish all the ongoing requests, and clean up the resources it used. Resources may include database connections or file locks.

For your Node.js process you may add something like this:

process.on('SIGTERM', () => {
  logger.info('shutdown started')
  server.stop()
    .then(closeMysqlConnection())
    .then(() => {
      logger.info('process is stopping')
    })
})
