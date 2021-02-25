const TimedMetric = require('./timed-metric');

/**
 * Implements a queue for storing timed metrics.
 *
 * The metrics in the queue are deleted when they are cancelled or when they time out.
 * @class
 */
class TimedMetricsQueue {
  #metrics = [];

  /**
   * Pushes a new timed metric at the back of the queue.
   *
   * This method will throw an error if the data passed to it is not of the type { value: number }
   * @method
   * @param {object} metric The metric to insert in the queue
   */
  push(metric) {
    this.#checkMetric(metric);
    this.#createAndStoreTimedMetrics(metric);
  }

  #checkMetric = (metric) => {
    if (typeof metric.value !== 'number') {
      throw new Error('Invalid metric data');
    }
  };

  #createAndStoreTimedMetrics = (metric) => {
    const timedMetric = new TimedMetric(metric);
    timedMetric.finally(() => {
      this.#metrics.shift();
    });
    this.#metrics.push(timedMetric);
  };

  /**
   * Sums all the metrics values currently in the queue.
   * @returns 0 if there's nothing in the queue.
   * @method
   */
  sum() {
    /*
    It would be much easier here to do 
      ```
      this.#metrics
        .map(metric => metric.value)
        .reduce((p, c) => p + c);
      ```
    That would mean iterating twice over the #metrics array.
    Instead of doing that I've decided, during the reduce() to map the 'previous' value to a number...
    the very value of the 'previous' argument. As for the rest, we simply add that value to 'current.value'.
    This, however only works when you have more than 1 element in the array otherwise reduce() would return
    the only element of the array and confuse the caller who expects a number.
    That's why I created a special case for when there's only one element in the array.
    */
    if (this.#metrics.length == 1) {
      return this.#metrics[0].value;
    } else if (this.#metrics.length > 1) {
      return this.#metrics.reduce((previous, current, index) => {
        if (index === 1) {
          return previous.value + current.value;
        }
        return previous + current.value;
      });
    }

    return 0;
  }

  /**
   * Returns a promise combining every timed metrics currently in the queue.
   * @returns A promise.
   * @method
   */
  all() {
    return Promise.all(this.#metrics);
  }

  /**
   * Cancels every metric in the queue and empty the queue.
   * @method
   */
  flush() {
    this.#metrics.forEach((metric) => metric.cancel());
    this.#metrics = [];
  }
}

module.exports = TimedMetricsQueue;
