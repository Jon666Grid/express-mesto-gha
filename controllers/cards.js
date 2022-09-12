const Card = require('../models/card');
const {
  badRequest, notFound, forbiddenError,
} = require('../errors/errors');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (e) {
    next(e);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (card.owner.toString() === !req.user._id) {
      res.status(forbiddenError).send({ message: 'В доступе отказано' });
      return;
    }
    res.send(card);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные при удалении карточки' });
      return;
    }
    next(e);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ owner: req.user._id, name, link });
    res.send(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные при создании карточки.' });
      return;
    }
    next(e);
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
      res.status(notFound).send({ message: `Передан несуществующий ${req.user._id} карточки.` });
      return;
    }
    res.send(card);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные для постановки лайка.' });
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
      res.status(notFound).send({ message: `Передан несуществующий ${req.user._id} карточки.` });
      return;
    }
    res.send(card);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные для снятии лайка.' });
      return;
    }
    next(e);
  }
};
