const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const { validCreateUser, validLogin } = require('../middlewares/validators');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/notFound');

router.post('/signup', validCreateUser, createUser);
router.post('/signin', validLogin, login);
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый пользователь не найден'));
});

module.exports = router;
