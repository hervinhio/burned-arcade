const assert = require('assert');
const settings = require("./settings");
const TimedMetrics = require("./timed-metrics");

describe('TimedMetric', () => {
  before(() => {
    settings.storageTimeout = 10;
  });

  it('TimedMetric resolves after timeout', () => {
    return assert.doesNotReject(new TimedMetrics({ value: 33}));
  });

  it('TimedMetric rejects when cancelled', () => {
    const metric = new TimedMetrics({ value: 78.109 });
    metric.cancel();
    return assert.rejects(metric);
  });

  it('TimedMetric stores a rounded value', () => {
    const metric = new TimedMetrics({ value: 21.8099 });
    assert.strictEqual(metric.value, 22);
    metric.cancel();
  });
});
