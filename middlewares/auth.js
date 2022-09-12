const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

// eslint-disable-next-line func-names
const extractBearerToken = function (header) {
  return header.replace('Bearer ', '');
};

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(req.headers);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
