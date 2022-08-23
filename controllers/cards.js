const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (e) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      res.status(404).send({ message: `Пользователь по указанному - ${req.params.cardId} не найден.` });
      return;
    }
    res.status(200).send(card);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки' });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ owner: req.user._id, name, link });
    res.status(200).send(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      res.status(404).send({ message: `Передан несуществующий ${req.user._id} карточки.` });
      return;
    }
    res.status(200).send(card);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      res.status(404).send({ message: `Передан несуществующий ${req.user._id} карточки.` });
      return;
    }
    res.status(200).send(card);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      res.status(400).send({ message: 'Переданы некорректные данные для снятии лайка.' });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};
