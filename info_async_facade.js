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
    current_weather: await get_current_weather(lat, lon),
    exchange_rates: await get_exchange_rates(),
  }
}


/**
 * Функция для получения текущей погоды от сервиса OpenWeatherMap.
 *
 * Function to get current weather by data from OpenWeatherMap.
 *
 * @param lat latitude
 * @param lon longitude
 * @returns {Promise<*>}
 */
async function get_current_weather(lat, lon) {
  return _fetch_json(`${OPENWEATHERMAP_URL_BASE}&lat=${lat}&lon=${lon}`)
    // Transform data.
    .then((data) => {
      if (typeof data['main'] !== 'undefined') {
        return {
          ...data['main'],
          wind: data['wind']
        };
      } else {
        console.error("Can't transform data from OWM: ", data);
        return {}
      }
    });
}
// OpenWeatherMap API endpoint.
// For more information see: https://openweathermap.org/current
OPENWEATHERMAP_URL_BASE = "http://api.openweathermap.org/data/2.5/weather"
  + `?appid=${process.env.OWM_API_KEY}&units=metric`;


/**
 * Функция для получения текущих котировок мировых валют по данным OpenExchangeRates.
 *
 * Function get exchange rates by data from OpenExchangeRates.
 *
 * @returns {Promise<*>}
 */
async function get_exchange_rates() {
  return _fetch_json(OPENEXCHANGERATES_URL)
    // Transform data.
    .then((data) => {
      if (typeof data['rates'] !== 'undefined') {
        // Filter currencies. Show only few.
        return Object.fromEntries(Object.entries(data['rates'])
          .filter((v) => {
            return ['RUB', 'EUR', 'JPY', 'GBP'].indexOf(v[0]) >= 0
          }))
      } else {
        console.error("Can't transform data from OXR: ", data);
        return {}
      }
    });
}
// OpenExchangeRates API endpoint.
// For more information see: https://openexchangerates.org
OPENEXCHANGERATES_URL = "http://openexchangerates.org/api/latest.json"
  + `?app_id=${process.env.OXR_API_KEY}&base=USD`;


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
        resolve(JSON.parse(Buffer.concat(body).toString()));
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
