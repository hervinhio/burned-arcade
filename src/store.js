const TimedMetricsQueue = require("./timed-metrics-queue");

class Store {
  #metricsQueues = {};

  store(key, metric) {
    if (!this.#metricsQueues[key]) {
      this.#metricsQueues[key] = new TimedMetricsQueue();
    }
    this.#metricsQueues[key].push(metric);
  }

  sum(key) {
    if (!this.#metricsQueues[key]) {
      throw new Error('Queue Not Found');
    }
    return this.#metricsQueues[key].sum();
  }

  flush() {
    Object.values(this.#metricsQueues).forEach(queue => queue.flush());
    this.#metricsQueues = {};
  }
};

const store = new Store();

module.exports = store;
