module.exports = (err, req, res, next) => {
  const { statusCode = 500, message = 'Неизвестная ошибка.' } = err;
  res.status(statusCode).send({ message });
  next();
};
