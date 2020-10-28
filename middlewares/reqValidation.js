const { celebrate, Joi, CelebrateError } = require('celebrate');
const { isURL } = require('validator');

// валидация регистрации и аутентификации
const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value) => {
      if (!isURL(value)) {
        throw new CelebrateError();
      }
      return value;
    }),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value) => {
      if (!isURL(value)) {
        throw new CelebrateError();
      }
      return value;
    }),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().min(24),
  }),
});

const validateUserIdParams = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().min(24),
  }),
});

module.exports = {
  validateAuth,
  validateUserProfile,
  validateUserAvatar,
  validateCreateCard,
  validateCardId,
  validateUserIdParams,
};
