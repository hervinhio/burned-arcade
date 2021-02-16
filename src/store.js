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
      return 0;
    }
    return this.#metricsQueues[key].sum();
  }

  flush() {
    for (let queue of Object.values(this.#metricsQueues)) {
      queue.flush();
    }
  }
};

const store = new Store();

module.exports = store;
