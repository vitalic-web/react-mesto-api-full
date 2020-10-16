const Card = require('../models/cards');

// выгрузка всех карточек
const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

// создание карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

// удаление карточки по id
const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotValidCard'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotValidCard') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

// лайк карточке
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NotValidCard'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotValidCard') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

// дизлайк карточке
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NotValidCard'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotValidCard') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
