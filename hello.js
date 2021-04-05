module.exports.main = (event) => {
  /**
   * Это вызываемая функция.
   * Она будет выполняться для каждого отдельного запроса.
   *
   * This is function to execute.
   * It will be invoked for each request.
   */
  return `Hello, ${JSON.stringify(event)}!`
}
