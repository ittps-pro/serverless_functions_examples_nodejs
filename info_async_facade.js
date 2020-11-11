const http = require('http');

/**
 * Вызываемая функция для формирования ответа на запрос.
 *
 * Function to execute by request to make response.
 *
 * @param lat latitude
 * @param lon longitude
 * @returns {Promise<{exchange_rates: *, weather_forecast: *}>}
 */
module.exports.main = async ({lat, lon}) => {
  return {
    weather_forecast: await get_weather_forecast(lat, lon),
    exchange_rates: await get_exchange_rates(),
  }
}


/**
 * Функция для получения прогноза погоды от сервиса OpenWeatherMap.
 *
 * Function to get weather forecast by data from OpenWeatherMap.
 *
 * @param lat latitude
 * @param lon longitude
 * @returns {Promise<*>}
 */
async function get_weather_forecast(lat, lon) {
  let url = `${OPENWEATHERMAP_URL_BASE}?units=metric&lat=${lat}&lon=${lon}`
    + `&appid=${OPENWEATHERMAP_API_KEY}`;
  return _fetch_json(url)
    // Transform data.
    .then((data) => {
      return typeof data['list'] !== 'undefined' ? data['list'] : {};
    });
}
// OpenWeatherMap API endpoint.
// For more information see: https://openweathermap.org/forecast5#geo5
OPENWEATHERMAP_URL_BASE = "http://api.openweathermap.org/data/2.5/forecast";
OPENWEATHERMAP_API_KEY = process.env.OWM_API_KEY;


/**
 * Функция для получения текущих котировок мировых валют относительно
 * доллара США по данным OpenExchangeRates.
 *
 * Function get exchange rates based on USD by data from OpenExchangeRates.
 *
 * @returns {Promise<*>}
 */
async function get_exchange_rates() {
  let url = `${OPENEXCHANGERATES_URL_BASE}?app_id=${OPENEXCHANGERATES_API_KEY}`;
  return _fetch_json(url)
    // Transform data.
    .then((data) => {
      return typeof data['rates'] !== 'undefined' ? data['rates'] : {};
    });
}
// OpenExchangeRates API endpoint.
// For more information see: https://openexchangerates.org
OPENEXCHANGERATES_URL_BASE = "http://openexchangerates.org/api/latest.json";
OPENEXCHANGERATES_API_KEY = process.env.OXR_API_KEY;


/**
 * Функция для асинхронного скачивая JSON данных.
 *
 * Function to async download JSON data.
 *
 * @param url to fetch information from
 * @returns {Promise}
 * @private
 */
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

// Чтобы тестировать функцию на локальном компьютере, можно использовать
// такой вывод результатов её работы.
// To test this function locally, you can use such output of it's results.
if (require.main === module) {
  module.exports.main({ lat: 59.89, lon: 30.33 })
    .then(JSON.stringify)
    .then(console.log)
    .catch(console.error);
}
