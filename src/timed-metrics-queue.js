const TimedMetric = require('./timed-metric');

/**
 * @class TimedMetricsQueue
 * @description Implements a queue for storing timed metrics.
 * The metrics in the queue are deleted when they are cancelled or when they time out.
 */
class TimedMetricsQueue {
  #metrics = [];

  /**
   * @function push Pushes a new timed metric at the back of the queue.
   * This method will throw an error if the data passed to it is not of the type { value: number }
   * @param {The metric to insert in the queue} metric
   */
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

  /**
   * @function sum
   * @description Sums all the metrics values currently in the queue.
   * Returns 0 if there's nothing in the queue.
   */
  sum() {
    if (this.#metrics.length > 0) {
      return this.#metrics
            .map(metric => metric.value)
            .reduce((p, c) => p + c);
    } else {
      return 0;
    }
  }

  /**
   * @function all Returns a promise combining every timed metrics currently in the queue.
   */
  all() {
    return Promise.all(this.#metrics);
  }

  /**
   * @function flush Cancels every metric in the queue and empty the queue.
   */
  flush() {
    this.#metrics.forEach(metric => metric.cancel());
    this.#metrics = [];
  }
}

module.exports = TimedMetricsQueue;
