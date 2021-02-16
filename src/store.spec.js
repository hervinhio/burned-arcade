const store = require('./store');
const assert = require('assert');

describe('Store', () => {
  it('store() stores the metric in the proper queue', () => {
    store.store('cpu', { value: 44 });
    store.store('cpu', { value: 99.28 });

    assert.strictEqual(store.sum('cpu'), 143);
    store.flush();
  });

  it('flush() flushes all queues', () => {
    store.store('cpu', { value: 77 });
    store.store('mem', { value: 8 });
    store.flush();

    assert.throws(() => store.sum('mem'), Error);
  });
});
