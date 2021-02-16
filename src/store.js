const TimedMetricsQueue = require('./timed-metrics-queue');

/**
 * Data structure for storing metrics in metrics queues.
 * Each metric is logged with a corresponding key. There is only metrics queue per key.
 * @class
 */
class Store {
  #metricsQueues = {};

  /**
   * Stores the given metrics in the metric queue corresponding to the given key.
   * If no queue exists for the given key, one is created.
   * @method
   * @param {string} key The metric key
   * @param {object} metric The metric to store
   */
  store(key, metric) {
    if (!this.#metricsQueues[key]) {
      this.#metricsQueues[key] = new TimedMetricsQueue();
    }
    this.#metricsQueues[key].push(metric);
  }

  /**
   * Sums all metrics stored for the given key.
   * If no queue exists for the given key an error is thrown.
   * @method
   * @param {string} key The key the metrics of which must be sumed
   */
  sum(key) {
    if (!this.#metricsQueues[key]) {
      throw new Error('Queue Not Found');
    }
    return this.#metricsQueues[key].sum();
  }

  /**
   * Cancels all metrics timeouts and deletes them from their queues.
   * The result of the invocation of this method is that every existing queue will remain empty.
   * @method
   */
  flush() {
    Object.values(this.#metricsQueues).forEach((queue) => queue.flush());
    this.#metricsQueues = {};
  }
}

const store = new Store();

module.exports = store;
