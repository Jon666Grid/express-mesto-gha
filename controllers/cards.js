const Card = require('../models/card');
const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbidden');
const BadRequestError = require('../errors/badRequest');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (e) {
    next(e);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId)
      .orFail(() => new NotFoundError('Нет карточки по указанному id'));
    if (!card.owner.equals(req.user._id)) {
      next(new ForbiddenError('Нельзя удалить чужую карточку'));
      return;
    }
    card.remove(() => res.send('Карточка удалина'));
  } catch (e) {
    next(e);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ owner: req.user._id, name, link });
    res.send({ data: card });
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    } next(e);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      next(new NotFoundError(`Передан несуществующий ${req.user._id} карточки.`));
      return;
    }
    res.send(card);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      return;
    }
    next(e);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      next(new NotFoundError(`Передан несуществующий ${req.user._id} карточки.`));
      return;
    }
    res.send(card);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      next(new BadRequestError('Переданы некорректные данные для снятии лайка.'));
      return;
    }
    next(e);
  }
};
