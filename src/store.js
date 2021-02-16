const TimedMetricsQueue = require("./timed-metrics-queue");

/**
 * @class Store
 * @description Data structure for storing metrics in metrics queues.
 * Each metric is logged with a corresponding key. There is only metrics queue per key.
 */
class Store {
  #metricsQueues = {};

  /**
   * @function store Stores the given metrics in the metric queue corresponding to the given key.
   * If no queue exists for the given key, one is created.
   * @param {The metric key} key 
   * @param {The metric to store} metric 
   */
  store(key, metric) {
    if (!this.#metricsQueues[key]) {
      this.#metricsQueues[key] = new TimedMetricsQueue();
    }
    this.#metricsQueues[key].push(metric);
  }

  /**
   * @function sum Sums all metrics stored for the given key.
   * If no queue exists for the given key an error is thrown.
   * @param {The key the metrics of which must be sumed} key 
   */
  sum(key) {
    if (!this.#metricsQueues[key]) {
      throw new Error('Queue Not Found');
    }
    return this.#metricsQueues[key].sum();
  }

  /**
   * @function flush Cancels all metrics timeouts and deletes them from their queues.
   * The result of the invocation of this method is that every existing queue will remain empty.
   */
  flush() {
    Object.values(this.#metricsQueues).forEach(queue => queue.flush());
    this.#metricsQueues = {};
  }
};

const store = new Store();

module.exports = store;
