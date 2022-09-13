const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const { validCreateUser, validLogin } = require('../middlewares/validators');
const NotFoundError = require('../errors/notFound');

router.post('/signup', validCreateUser, createUser);
router.post('/signin', validLogin, login);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый пользователь не найден'));
});

module.exports = router;
