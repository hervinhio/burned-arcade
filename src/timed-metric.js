const settings = require("./settings");

class TimedMetric extends Promise {
  value;
  #reject = () => { }
  #resolve =  () => { }
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
    this.#timeout = setTimeout(() => this.#resolve(), settings.storageTimeout);
  }

  cancel() {
    clearTimeout(this.#timeout);
    this.#reject(new Error('Aborted')); 
  }
}

module.exports = TimedMetric;
