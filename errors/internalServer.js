class InternalServerError extends Error {
  constructor(message = 'На сервере возникло необработанное исключение.') {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = InternalServerError;
