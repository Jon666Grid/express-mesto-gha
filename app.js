const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { createUser, login } = require('./controllers/users');
const { notFound } = require('./errors/errors');
const users = require('./routes/users');
const cards = require('./routes/cards');
const auth = require('./middlewares/auth');
const { validLogin, validCreateUser } = require('./middlewares/validators');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.post('/signup', validCreateUser, createUser);
app.post('/signin', validLogin, login);

app.use('/users', auth, users);
app.use('/cards', auth, cards);
app.use((req, res) => {
  res.status(notFound).send({ message: 'Запрашиваемый пользователь не найден' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`PORT ${PORT}`);
});
