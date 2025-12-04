require('dotenv').config();
const http = require('http');
const { buildApp } = require('./app');

const port = parseInt(process.env.PORT, 10) || 4000;
const app = buildApp();
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

module.exports = { app, server };
