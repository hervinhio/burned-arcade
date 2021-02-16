const express = require('express');
const store = require('./store');
const bodyParser = require('body-parser');

const app = express();
const SERVICE_PORT = process.env.PORT || 8082;

app.use(bodyParser.json());

app.post('/metric/:key', (request, response) => {
  try {
    store.store(request.params.key, request.body);
    response.send({});
  } catch (e) {
    response.sendStatus(400);
  }
});

app.get('/metric/:key/sum', (request, response) => {
  const sum = store.sum(request.params.key);
  response.send({ value: sum });
});

process.on('exit', () => {
  store.flush();
});

module.exports = app.listen(SERVICE_PORT);
