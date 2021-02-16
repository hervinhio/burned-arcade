const assert = require('assert');
const TimedMetricsQueue = require('./timed-metrics-queue');
const settings = require('./settings');

describe('TimedMetricsQueue', () => {
  let queue;
  
  beforeEach(() => {
    settings.storageTimeout = 10;
    queue = new TimedMetricsQueue('visitors')
  });

  it('sum() should return 0 when all metrics have timed out', async () => {
    queue.push({ value: 10 });
    queue.push({ value: 50 });
    queue.push({ value: 78 });

    await queue.empty();
    assert.strictEqual(queue.sum(), 0);

    return queue.empty();
  });

  it('sum() should return non 0 value when some metrics haven\`t yet timed out', () => {
    /* For this test to be exact regardless of the execution environment, I increase the
       timeout to make sure that no metrics timeout will occur during the execution of this
       test and the that the assertion will be correct.
    */
    settings.storageTimeout = 3600000;

    queue.push({ value: 92 });
    queue.push({ value: 1 });
    queue.push({ value: 12 });

    assert.strictEqual(queue.sum(), 105);
    queue.flush();
  });

  it('sum() should return value equal to all non timedout metrics values', async () => {
    queue.push({ value: 700});
    await new Promise(resolve => setTimeout(resolve, settings.storageTimeout));
    
    queue.push({ value: 3 });
    queue.push({ value: 103 });
    queue.push({ value: 22 });

    assert.strictEqual(queue.sum(), 128);
    return queue.empty();
  });

  it('sum() should round result to the nearest integer', () => {
    queue.push({ value: 12.8889 });
    queue.push({ value: 44/7 });
    queue.push({ value: 5E-1 });

    assert.strictEqual(queue.sum(), 20)
    queue.flush();
  });

  it('sum() invalid metrics value should not be stored', () => {
    assert.throws(() => queue.push(), Error, 'Invalid metrics data');
    assert.throws(() => queue.push(null), Error, 'Invalid metrics data');
    assert.throws(() => queue.push('Some random string'), Error, 'Invalid metrics data');
    assert.throws(() => queue.push({ what: 'Something' }), Error, 'Invalid metrics data');
  })
});
