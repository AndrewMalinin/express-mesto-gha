class ForbiddenError extends Error {
  constructor(message = 'У вас нет прав на выполнение этого действия.') {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
