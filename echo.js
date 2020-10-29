
let container_started_at = new Date().toISOString();

module.exports.main = (event) => {
  return {
    event,
    container_started_at,
    now: new Date().toISOString()
  }
}

// Call handler-function if code runs locally.
// $ node echo.js test abc
if (require.main === module) {
    console.log(module.exports.main.call(this, process.argv.slice(2)))
}
