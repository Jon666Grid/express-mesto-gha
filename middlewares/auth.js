const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors/errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res
      .status(AuthError)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    res
      .status(AuthError)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
