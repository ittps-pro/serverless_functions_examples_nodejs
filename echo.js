
let container_started_at = new Date().toISOString();

module.exports.main = (event) => {
  return {
    event,
    container_started_at,
    now: new Date().toISOString()
  }
}
