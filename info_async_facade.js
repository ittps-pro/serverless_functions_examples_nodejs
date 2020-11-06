const http = require('http');

async function _fetch_json(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let body = [];
      res.on('data', (chunk) => {
        body.push(chunk);
      });
      res.on('end', () => {
        body = Buffer.concat(body).toString();
        resolve(JSON.parse(body));
      });
    }).on('error', (e) => {
      // Log errors and not throw it.
      console.error(e);
      resolve({});
    });
  })
}

// OpenWeatherMap API endpoint.
// For more information see: https://openweathermap.org/forecast5#geo5
OPENWEATHERMAP_URL_BASE = "http://api.openweathermap.org/data/2.5/forecast";
OPENWEATHERMAP_API_KEY = process.env.OWM_API_KEY;

async function get_forecast(lat, lon) {
  let url = `${OPENWEATHERMAP_URL_BASE}?units=metric&lat=${lat}&lon=${lon}`
    + `&appid=${OPENWEATHERMAP_API_KEY}`;
  return _fetch_json(url)
    // Transform data.
    .then((data) => {
      return typeof data['list'] !== 'undefined' ? data['list'] : {};
    });
}

// OpenExchangeRates API endpoint.
// For more information see: https://openexchangerates.org
OPENEXCHANGERATES_URL_BASE = "http://openexchangerates.org/api/latest.json";
OPENEXCHANGERATES_API_KEY = process.env.OXR_API_KEY;

async function get_exchange_rates() {
  let url = `${OPENEXCHANGERATES_URL_BASE}?app_id=${OPENEXCHANGERATES_API_KEY}`;
  return _fetch_json(url)
    // Transform data.
    .then((data) => {
      return typeof data['rates'] !== 'undefined' ? data['rates'] : {};
    });
}


module.exports.main = async ({lat, lon}) => {
  return {
    dt: new Date().toISOString(),
    weather: await get_forecast(lat, lon),
    exchange_rates: await get_exchange_rates(),
  }
}


// Call handler-function if code runs locally.
if (require.main === module) {
  module.exports.main({ lat: 59.89, lon: 30.33 })
    .then((d) => {
      console.log(JSON.stringify(d));
    })
    .catch(console.error);
}
