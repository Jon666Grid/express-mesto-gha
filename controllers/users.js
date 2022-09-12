const { NODE_ENV, JWT_SECRET = 'key' } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  badRequest, notFound, conflictError, authError,
} = require('../errors/errors');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    next(e);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(notFound).send({ message: `Пользователь по указанному - ${req.params._id}не найден.` });
      return;
    }
    res.send(user);
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные при запросе пользователя.' });
      return;
    }
    next(e);
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(notFound).send({ message: 'Пользователь не найден.' });
      return;
    }
    res.send(user);
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные при запросе пользователя.' });
      return;
    }
    next(e);
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    res.status(authError).send({ message: 'Пароль или почта некорректны' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });
    res.send({ data: user });
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные.' });
      return;
    }
    if (e.name === 'MongoError' || e.code === 11000) {
      res.status(conflictError).send({ message: 'Указанный email уже занят' });
      return;
    }
    next(e);
  }
};

module.exports.updateUser = async (req, res, next) => {
  const { name, about } = req.body;
  try {
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
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      return;
    }
    next(e);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
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
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      return;
    }
    next(e);
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    if (!user) {
      res.status(notFound).send({ message: 'Пользователь не найден.' });
      return;
    }
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'key', { expiresIn: '7d' });
    res.send({ token });
  } catch (e) {
    res.status(authError).send({ message: 'Вы не авторизованы' });
  }
};
