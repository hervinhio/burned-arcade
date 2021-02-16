const Settings = require('./settings');

/**
 * Implements a metric that can timeout or be cancelled.
 *
 * TimedMetric extends Promise. This way, when the metric times out, it resolve. When,
 * however, the metric is cancelled it rejects.
 * @class
 */
class TimedMetric extends Promise {
  value;
  #reject;
  #resolve;
  #timeout;

  static get [Symbol.species]() {
    return Promise;
  }

  get [Symbol.toStringTag]() {
    return 'TimedMetric';
  }

  constructor(metric) {
    var resolve;
    var reject;

    /* Getting the resolve and reject callbacks */
    super((_resolve, _reject) => {
      reject = _reject;
      resolve = _resolve;
    });

    this.#init(resolve, reject, metric);
  }

  #init = (resolve, reject, metric) => {
    this.#reject = reject;
    this.#resolve = resolve;
    this.value = Math.round(metric.value);
    this.#timeout = setTimeout(() => this.#resolve(), Settings.StorageTimeout);
  };

  /**
   * Cancels the timed metric.
   *
   * When invoked, this method clears the timeout associated with the metric and, since the metric
   * is a promise, rejects it.
   * @method
   */
  cancel() {
    clearTimeout(this.#timeout);
    this.#reject(new Error('Aborted'));
  }
}

module.exports = TimedMetric;
