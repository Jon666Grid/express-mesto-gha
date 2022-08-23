const User = require('../models/user');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).send({ message: `Пользователь по указанному - ${req.user._id}не найден.` });
      return;
    }
    res.status(200).send(user);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      res.status(400).send({ message: 'Переданы некорректные данные при запросе пользователя.' });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(201).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ); if (!user) {
      res.status(404).send({ message: `Пользователь по указанному - ${req.user._id}не найден.` });
      return;
    }
    res.status(200).send({ data: user });
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    ); if (!user) {
      res.status(404).send({ message: `Пользователь по указанному - ${req.user._id}не найден.` });
      return;
    }
    res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};
