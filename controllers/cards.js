const Card = require('../models/cards');
const BadRequestError = require('../errors/BadRequestError'); // 400
const NotFoundError = require('../errors/NotFoundError'); // 404
const ForbiddenError = require('../errors/ForbiddenError'); // 403

// выгрузка всех карточек
const getAllCards = (req, res, next) => {
  Card.find({}).sort({ createdAt: -1 })
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточки не найдены');
      }

      res.send({ data: cards });
    })
    .catch(next);
};

// создание карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Введены некорректные данные');
      }
      res.send({ data: card });
    })
    .catch(next);
};

// удаление карточки по id
const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (card.owner.toString() === req.user._id.toString()) {
        Card.findByIdAndRemove(card._id)
          .then((result) => res.send({ data: result }))
          .catch(next);
      }
      throw new ForbiddenError('Это не ваша карточка');
    })
    .catch(next);
};

// лайк карточке
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

// дизлайк карточке
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports = {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
