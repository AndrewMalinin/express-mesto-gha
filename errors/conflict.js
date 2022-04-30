class ConflictError extends Error {
  constructor(message = 'Ошибка изменения ресурса вследствие конфликта.') {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
