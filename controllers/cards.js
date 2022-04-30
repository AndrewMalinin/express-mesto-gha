const BadRequestError = require('../errors/badRequest');
const ForbiddenError = require('../errors/forbidden');
const InternalServerError = require('../errors/internalServer');
const NotFoundError = require('../errors/notFound');
const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (card === null) {
        next(new NotFoundError('Запрашиваемая карточка не найдена.'));
      } else if (card.owner.valueOf() === req.user._id) {
        Card.findByIdAndRemove(cardId)
          .then(() => {
            res.send(card);
          })
          .catch(() => {
            next(new InternalServerError());
          });
      } else {
        next(new ForbiddenError('У вас нет прав на удаление чужих карточек.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id.'));
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: ownerId } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        next(new NotFoundError('Запрашиваемая карточка не найдена.'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id.'));
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: ownerId } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        next(new NotFoundError('Запрашиваемая карточка не найдена.'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id.'));
      } else {
        next(new InternalServerError());
      }
    });
};
