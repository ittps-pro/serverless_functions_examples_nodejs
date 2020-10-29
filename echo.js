
let container_started_at = new Date().toISOString();

module.exports.main = (event) => {
  return {
    event,
    container_started_at,
    now: new Date().toISOString()
  }
}

// Call handler-function if code runs locally.
// $ node echo.js param="param pam pam" a=1
if (require.main === module) {
  args = {}
  let cleared_argv = process.argv.slice(2);
  for (let i=0; i < cleared_argv.length; i++) {
    let param = cleared_argv[i].split('=');
    args[param[0]] = param[1];
  }
  console.log(module.exports.main.call(this, args))
}
