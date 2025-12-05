const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { buildApp } = require('../src/app');

let server;

before(() => {
  const app = buildApp();
  server = app.listen(0);
});

after(() => {
  if (server) {
    server.close();
  }
});

test('GET /health returns ok status', async () => {
  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, { status: 'ok' });
});
