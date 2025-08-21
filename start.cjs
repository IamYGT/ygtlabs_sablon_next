// Force production mode
process.env.NODE_ENV = 'production';

const next = require('next');
const { createServer } = require('http');

const dev = false; // production mode
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT;

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});