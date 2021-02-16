const settings = require("./settings");

class TimedMetrics extends Promise {
  value;
  #reject = () => { }
  #resolve =  () => { }
  #timeout;

  static get [Symbol.species]() {
    return Promise;
  }

  get [Symbol.toStringTag]() {
      return 'TimedMetrics';
  }

  constructor(metrics) {
    var resolve;
    var reject;

    super((_resolve, _reject) => {
      reject = _reject;
      resolve = _resolve;
    });

    this.#init(resolve, reject, metrics);
  }

  #init = (resolve, reject, metrics) => {
    this.#reject = reject;
    this.#resolve = resolve;
    this.value = Math.round(metrics.value);
    this.#timeout = setTimeout(() => this.#resolve(), settings.storageTimeout);
  }

  cancel() {
    clearTimeout(this.#timeout);
    this.#reject(new Error('Aborted')); 
  }
}

module.exports = TimedMetrics;
