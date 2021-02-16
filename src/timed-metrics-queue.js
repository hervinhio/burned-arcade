const TimedMetrics = require('./timed-metrics');
const settings = require('./settings');

class TimedMetricsQueue {
  #metrics = [];

  constructor() {

  }

  /**
   * @fn push
   * @brief Pushes a new metric in the queue and sets a timeout to delete that
   * metric value when it's been stored for more than an hour.
   * @param metrics The metrics value.
   */
  push(metrics) {
    if(!metrics?.value) {
      throw new Error('Invalid metrics data');
    }
    
    const promise = new TimedMetrics(metrics);
    this.#metrics.push(promise);

    promise.then(() => {
      this.#deleteMetrics(promise);
    })
    .catch((e) => {
      this.#deleteMetrics(promise);
    });
  }

  #deleteMetrics = (metrics) => {
    const indexToRemove = this.#metrics.indexOf(metrics);
    this.#metrics.splice(indexToRemove, 1);
  }

  /**
   * @fn sum
   * @brief Returns a sum of all metrics values in the queue.
   * @returns The sum of all metrics in the queue.
   */
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
