const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cardController = require('../controllers/cards');

router.get('/', cardController.getAllCards);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), cardController.deleteCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?([\w\-._~:/?#[\]@!$&'()*+,;=]+)/),
  }),
}), cardController.createCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), cardController.likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), cardController.dislikeCard);

module.exports = router;
