const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const store = require('./store');
const StatusCodes = require('./status-codes');

const app = express();
const SERVICE_PORT = process.env.PORT || 8082;

app.use(cors());
app.use(bodyParser.json());

app.post('/metric/:key', (request, response) => {
  try {
    store.store(request.params.key, request.body);
    response.send({});
  } catch (e) {
    console.log('Attempt to store invalid metric data');
    response.sendStatus(StatusCodes.BadRequest);
  }
});

app.get('/metric/:key/sum', (request, response) => {
  try {
    const sum = store.sum(request.params.key);
    response.send({ value: sum });
  } catch (e) {
    response.sendStatus(StatusCodes.NotFound);
  }
});

process.on('exit', () => {
  store.flush();
  console.log('All timers cancelled and data flushed. Server is now exiting');
});

module.exports = app.listen(SERVICE_PORT, () => {
  console.log('Server started up successfully!');
});
