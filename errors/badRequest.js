class BadRequestError extends Error {
  constructor(message = 'В запросе допущена ошибка.') {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
