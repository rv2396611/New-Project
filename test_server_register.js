const http = require('http');
const data = JSON.stringify({ email: 'cli-test@example.com', password: 'cliPass123' });
const opts = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(opts, (res) => {
  let body = '';
  res.on('data', (c) => body += c);
  res.on('end', () => {
    console.log('status:', res.statusCode);
    console.log('body:', body);
    process.exit(0);
  });
});
req.on('error', (e) => { console.error('request error', e); process.exit(2); });
req.write(data);
req.end();
