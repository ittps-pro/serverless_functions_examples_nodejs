const http = require('http');
const https = require('https');

DOMAINS_ALLOWED = process.env.DOMAINS_ALLOWED || '*';
TIMEOUT_SECONDS = process.env.TIMEOUT_SECONDS || 5;


async function fetch(url, opts = {}) {
  // The switching logic between HTTP and HTTPS.
  var client;
  if (url.toString().indexOf("https") === 0){
    client = https;
  } else {
    client = http;
  }
  // Make request.
  return new Promise((resolve) => {
    let timeout;
    let req = client.get(url, opts, (res) => {
      let body = [];
      res.on('data', (chunk) => {
        body.push(chunk);
      });
      res.on('end', () => {
        clearTimeout(timeout);
        resolve(Buffer.concat(body).toString());
      });
    }).on('error', (e) => {
      // Log errors and not throw it.
      console.error(e);
      clearTimeout(timeout);
      resolve();
    });
    timeout = setTimeout(() => {
      console.error(`Timeout exceeded. Request to "${url}" will be halted.`);
      req.abort();
    }, TIMEOUT_SECONDS * 1000);
  })
}

module.exports.main = async ({url}) => {
  return await fetch(url)
}


// Call handler-function if code runs locally.
if (require.main === module) {
  module.exports.main({ url: 'https://selectel.ru' })
    .then(console.log)
    .catch(console.error);
}
