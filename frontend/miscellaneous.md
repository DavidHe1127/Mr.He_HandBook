* `Throttle` - enforce a max num of times a func can be called over time.
i.e Under normal circumstances you would call this func 1000 times over 10 seconds. If you `throttle` it to only once per 100ms, it would only
execute that func at most 100 times.

  `Debounce` - enforce that a func not be called again until a certain amount of time has passed without it being called.
