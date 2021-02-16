const settings = require("./settings");

class TimedMetrics extends Promise {
  value;
  #_reject = () => { }
  #_resolve =  () => { }
  #_timeout;

  constructor(metrics) {
    var resolve;
    var reject;

    super((_resolve, _reject) => {
      reject = _reject;
      resolve = _resolve;
    });

    this.#_reject = reject;
    this.#_resolve = resolve;
    this.value = Math.round(metrics.value);
    this.#_timeout = setTimeout(() => this.#_resolve(), settings.storageTimeout);
  }

  cancel() {
    clearTimeout(this.#_timeout);
    this.#_reject(new Error('Aborted')); 
  }

  static get [Symbol.species]() {
    return Promise;
}

  get [Symbol.toStringTag]() {
      return 'TimedMetrics';
  }
}

module.exports = TimedMetrics;
