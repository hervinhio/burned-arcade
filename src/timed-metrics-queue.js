const TimedMetric = require('./timed-metric');

class TimedMetricsQueue {
  #metrics = [];

  push(metric) {
    this.#checkMetric(metric);
    this.#createAndStoreTimedMetrics(metric);
  }

  #checkMetric = (metric) => {
    if(!metric?.value) {
      throw new Error('Invalid metric data');
    }
  }

  #createAndStoreTimedMetrics = (metric) => {
    const timedMetric = new TimedMetric(metric);
    timedMetric.finally(() => {
      this.#metrics.shift();
    });
    this.#metrics.push(timedMetric);
  }

  sum() {
    if (this.#metrics.length > 0) {
      return this.#metrics
            .map(metric => metric.value)
            .reduce((p, c) => p + c);
    } else {
      return 0;
    }
  }

  all() {
    return Promise.all(this.#metrics);
  }

  flush() {
    this.#metrics.forEach(metric => metric.cancel());
    this.#metrics = [];
  }
}

module.exports = TimedMetricsQueue;
