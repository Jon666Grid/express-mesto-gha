const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  badRequest, notFound, internalServerError, conflictError, authError,
} = require('../errors/errors');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(notFound).send({ message: `Пользователь по указанному - ${req.params.id}не найден.` });
      return;
    }
    res.send(user);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные при запросе пользователя.' });
      return;
    }
    res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });
    res.send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      return;
    } if (e.name === 'MongoError' || e.code === 11000) {
      res.status(conflictError).send({ message: 'Указанный email уже занят' });
    } else res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    res.send({
      token: jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
    });
  } catch (e) {
    res.status(authError).send({ message: e.message });
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
      res.status(notFound).send({ message: `Пользователь по указанному - ${req.user._id}не найден.` });
      return;
    }
    res.send({ data: user });
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      return;
    }
    res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
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
      res.status(notFound).send({ message: `Пользователь по указанному - ${req.user._id}не найден.` });
      return;
    }
    res.send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      return;
    }
    res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
  }
};
