const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  const { authorization } = req.headers || req.cookies;
  console.log(authorization);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = await authorization.replace('Bearer ', '');
  let payload;
  try {
    // eslint-disable-next-line no-undef
    payload = jwt.verify(token, 'SECRET');
  } catch (e) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
