const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
const { PORT = 3001 } = process.env;
const { cardsRouter } = require('./routes/cards');
const { usersRouter } = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// создание лимита на запросы
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });

// app.use(limiter); // запуск лимитера

// разрешить запросы с хоста 3000 (реакт)
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json()); // метод для парсинга req.body

app.post('/signin', login); // логин
app.post('/signup', createUser); // создание юзера

app.use(auth);

app.use(cardsRouter); // использование роута карточек
app.use(usersRouter); // использование роута юзеров и юзера по айди

// обработка несуществующего адреса
app.use('*', () => {
  throw new NotFoundError({ message: 'Запрашиваемый ресурс не найден' });
});

// централизованная обработка ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
