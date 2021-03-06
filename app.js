const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'develop';
  process.env.JWT_SECRET = 'develop-jwt-secret-key';
}

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { register, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const corsChecker = require('./middlewares/corsChecker');
const NotFoundError = require('./errors/notFound');

const { PORT = 3000 } = process.env;
const DB_ADDRESS = 'mongodb://127.0.0.1:27017/mestodb';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsChecker);
app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?([\w\-._~:/?#[\]@!$&'()*+,;=]+)/),
  }),
}), register);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый путь не существует.'));
});

app.use(errorLogger); // подключаем логгер запросов
app.use(errors());
app.use(errorHandler);



mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
})
  // eslint-disable-next-line no-console
  .then(() => console.log('Database connected!'))
  // eslint-disable-next-line no-console
  .catch((err) => console.log(`Database connection error: ${err.name} (${err.message})`));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
