const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { notFound } = require('./errors/errors');
const { validLogin, validCreateUser } = require('./middlewares/validators');
const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.post('/signin', validLogin, login);
app.post('/signup', validCreateUser, createUser);

app.use('/users', auth, users);
app.use('/cards', auth, cards);
app.use((req, res) => {
  res.status(notFound).send({ message: 'Запрашиваемый пользователь не найден' });
});

app.listen(PORT, () => {
  console.log(`PORT ${PORT}`);
});
