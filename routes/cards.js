const cardsRouter = require('express').Router();
const {
  getAllCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateCreateCard, validateCardId } = require('../middlewares/reqValidation');

cardsRouter.get('/cards', getAllCards);
cardsRouter.post('/cards', validateCreateCard, createCard);
cardsRouter.delete('/cards/:cardId', validateCardId, deleteCardById);
cardsRouter.put('/cards/:cardId/likes', validateCardId, likeCard);
cardsRouter.delete('/cards/:cardId/likes', validateCardId, dislikeCard);

module.exports = {
  cardsRouter,
};
