const TimedMetrics = require('./timed-metrics');

class TimedMetricsQueue {
  #metrics = [];

  push(metrics) {
    this.#checkMetrics(metrics);
    this.#createAndStoreTimedMetrics(metrics);
  }

  #checkMetrics = (metrics) => {
    if(!metrics?.value) {
      throw new Error('Invalid metrics data');
    }
  }

  #createAndStoreTimedMetrics = (metrics) => {
    const promise = new TimedMetrics(metrics);
    promise.finally(() => {
      this.#metrics.shift();
    });
    this.#metrics.push(promise);
  }

  sum() {
    if (this.#metrics.length > 0) {
      return this.#metrics
            .map(metrics => metrics.value)
            .reduce((p, c) => p + c);
    } else {
      return 0;
    }
  }

  empty() {
    return Promise.all(this.#metrics);
  }

  flush() {
    this.#metrics.forEach(item => item.cancel());
  }
}

module.exports = TimedMetricsQueue;
