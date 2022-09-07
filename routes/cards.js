const router = require('express').Router();
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  validCreateCard,
  validCardId,
} = require('../middlewares/validators');

router.get('/', getCards);
router.post('/', validCreateCard, createCard);
router.delete('/:cardId', validCardId, deleteCard);
router.put('/:cardId/likes', validCardId, likeCard);
router.delete('/:cardId/likes', validCardId, dislikeCard);

module.exports = router;
