const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

// выгрузка всех юзеров
const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены');
      }

      res.send({ data: users });
    })
    .catch(next);
};

// создание юзера
const createUser = (req, res, next) => {
  const name = 'currentUser';
  const about = 'currentAbout';
  const avatar = 'https://pbs.twimg.com/media/ERCI6cgXsAASOtq.jpg';
  const {
    email, password,
  } = req.body;

  bcrypt.hash(password, 10) // хэширование пароля
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Введены некорректные данные');
      }
      res.send({ data: user });
    })
    .catch(next);
};

// аутентификация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password') // находим юзера по емейл
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password) // проверяем совпадение паролей
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user; // если пароли совпали возвращаем данные юзера
        });
    })
    .then((loggedUser) => {
      const token = jwt.sign(
        { _id: loggedUser._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }); // создаем токен сроком на 7 дней
      if (!token) {
        throw new UnauthorizedError('Токен не найден');
      }
      return res.status(200).send({ token });
    })
    .catch(next);
};

// поиск юзера по id
const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// обновление профиля
const updateUserProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Введены некорректные данные');
      }

      res.send({ data: user });
    })
    .catch(next);
};

// обновление аватара
const updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Введены некорректные данные');
      }

      res.send({ data: user });
    })
    .catch(next);
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  login,
};
