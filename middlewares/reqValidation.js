const { celebrate, Joi } = require('celebrate');

// валидация регистрации и аутентификации
const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
    about: Joi.string().required().min(2),
  }),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
    link: Joi.string().required().uri(),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex(),
  }),
});

module.exports = {
  validateAuth,
  validateUserProfile,
  validateUserAvatar,
  validateCreateCard,
  validateCardId,
};
