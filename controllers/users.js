const { NODE_ENV, JWT_SECRET = 'key' } = process.env;
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

module.exports.getUserInfo = async (req, res) => {
  try {
    const { _id } = req.user._id;
    const user = await User.findById(_id);
    if (!user) {
      res.status(notFound).send({ message: 'Пользователь не найден.' });
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
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });
    res.send({ data: user });
  } catch (e) {
    if (e.code === 11000) {
      res.status(conflictError).send({ message: 'Указанный email уже занят' });
      return;
    } res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.updateUser = async (req, res) => {
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
    if (e.name === 'ValidationError') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      return;
    }
    res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.updateAvatar = async (req, res) => {
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
    if (e.name === 'ValidationError') {
      res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      return;
    }
    res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    if (!user || !password) {
      res.status(notFound).send({ message: 'Неправильные почта или пароль' });
      return;
    }
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'key', { expiresIn: '7d' });
    res.send({ token });
  } catch (e) {
    res.status(authError).send({ message: 'Вы не авторизованы' });
  }
};
