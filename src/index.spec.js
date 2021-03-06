const assert = require('assert');
const request = require('supertest');
const app = require('./index');
const store = require('./store');
const StatusCodes = require('./status-codes');

describe('Http', () => {
  it('POST should result in the posted metric being stored with the right sum', (done) => {
    request(app)
      .post('/metric/memory')
      .set('Accept', 'application/json')
      .send({ value: 30 })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(StatusCodes.Ok)
      .expect({})
      .end(() => {
        const sum = store.sum('memory');

        assert.deepStrictEqual(sum, 30);
        store.flush();
        done();
      });
  });

  it('POST with invalid data should return StatusCodes.BadRequest Bad request', (done) => {
    request(app)
      .post('/metric/cpu')
      .set('Accept', 'application/json')
      .send({ frequency: 45.23 })
      .expect(StatusCodes.BadRequest)
      .expect({})
      .end(() => {
        const sum = store.sum('cpu');
        assert.strictEqual(0, 0);
        store.flush();
        done();
      });
  });

  it('GET with existing metrics returns the correct sum', (done) => {
    store.store('cpu', { value: 47.8 });
    store.store('cpu', { value: 99 });
    store.store('cpu', { value: 0.1 });
    store.store('cpu', { value: 76.19 });

    request(app)
      .get('/metric/cpu/sum')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(StatusCodes.Ok)
      .end((_, response) => {
        assert.deepStrictEqual(response.body, { value: 223 });
        store.flush();
        done();
      });
  });

  it('GET with non-existing metric key hands StatusCodes.NotFound', (done) => {
    request(app)
      .get('/metric/cpu/sum')
      .set('Accept', 'application/json')
      .expect(StatusCodes.NotFound)
      .end(() => {
        done();
      });
  });

  after(() => {
    app.close();
  });
});
